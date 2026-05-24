"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Send,
  Bot,
  User,
  Loader2,
  Copy,
  Check,
  Heart,
  ListCollapse,
  Bookmark,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Locale } from "@/types/content";
import type { AIMode, PlaceContext } from "@/lib/ai-modes";
import { useT } from "@/components/providers/LocaleProvider";
import { ChatMarkdown } from "@/components/chat/ChatMarkdown";
import { AIModeSelector } from "@/components/chat/AIModeSelector";
import { TravelProfileBar } from "@/components/chat/TravelProfileBar";
import { ChatSavedPanel } from "@/components/chat/ChatSavedPanel";
import { SOSChatBar } from "@/components/city/SOSPanel";
import { useToast } from "@/components/providers/ToastProvider";
import { useFavorites } from "@/hooks/useFavorites";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useTravelProfile } from "@/hooks/useTravelProfile";
import { enrichMapsLinksInText } from "@/lib/maps-links";
import {
  normalizeChatMarkdown,
  plainTextFromMarkdown,
} from "@/lib/chat-markdown";
import { getSOSPrompt } from "@/lib/sos-scenarios";
import { createSessionId, type ChatHistorySession } from "@/lib/chat-history";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatLaunchConfig {
  mode?: AIMode;
  initialInput?: string;
  placeContext?: PlaceContext;
  autoSend?: boolean;
}

function ChatShell({
  expanded,
  portalReady,
  children,
}: {
  expanded: boolean;
  portalReady: boolean;
  children: React.ReactNode;
}) {
  const shell = (
    <div
      className={`flex h-full overflow-hidden bg-surface ${
        expanded
          ? "fixed inset-0 z-[200] h-[100dvh] max-h-[100dvh] w-full rounded-none border-0 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
          : "relative h-[min(calc(100dvh-9.5rem),820px)] rounded-2xl border border-border md:h-[min(78vh,720px)]"
      }`}
    >
      {children}
    </div>
  );

  if (expanded && portalReady) {
    return createPortal(shell, document.body);
  }

  return shell;
}

interface AIChatProps {
  cityName: string;
  countrySlug: string;
  citySlug: string;
  locale: Locale;
  launchConfig?: ChatLaunchConfig;
  launchKey?: number;
  onExpandChange?: (expanded: boolean) => void;
}

function welcomeForMode(
  t: (key: string, vars?: Record<string, string>) => string,
  cityName: string,
  mode: AIMode
) {
  return t(`chat.welcome.${mode}`, { city: cityName });
}

export function AIChat({
  cityName,
  countrySlug,
  citySlug,
  locale,
  launchConfig,
  launchKey = 0,
  onExpandChange,
}: AIChatProps) {
  const t = useT();
  const { add } = useFavorites();
  const { upsert: upsertHistory, sessions: historySessions } = useChatHistory(citySlug);
  const { toast } = useToast();
  const { profile, setProfile } = useTravelProfile();
  const [mode, setMode] = useState<AIMode>(launchConfig?.mode ?? "guide");
  const [placeContext, setPlaceContext] = useState<PlaceContext | undefined>(
    launchConfig?.placeContext
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [compactedByIndex, setCompactedByIndex] = useState<Record<number, string>>(
    {}
  );
  const [compactingIndex, setCompactingIndex] = useState<number | null>(null);
  const [favoriteSavedKey, setFavoriteSavedKey] = useState<string | null>(null);
  const [highlightHistoryId, setHighlightHistoryId] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [savedPanelMobileOpen, setSavedPanelMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(true);
  const [portalReady, setPortalReady] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launchApplied = useRef(-1);
  const sessionIdRef = useRef<string | null>(null);

  const resetWelcome = useCallback(
    (nextMode: AIMode) => {
      setMessages([
        {
          role: "assistant",
          content: welcomeForMode(t, cityName, nextMode),
        },
      ]);
    },
    [t, cityName]
  );

  const resetSession = useCallback(() => {
    sessionIdRef.current = null;
    setActiveSessionId(null);
  }, []);

  const persistHistory = useCallback(
    (finalMessages: Message[], activeMode: AIMode) => {
      const conversationOnly = finalMessages.filter(
        (m, i) => !(i === 0 && m.role === "assistant")
      );
      const userMsgs = conversationOnly.filter((m) => m.role === "user");
      if (userMsgs.length === 0) return;

      if (!sessionIdRef.current) {
        sessionIdRef.current = createSessionId(citySlug);
      }

      const preview = userMsgs[0].content.trim();
      const entry = upsertHistory({
        id: sessionIdRef.current,
        countrySlug,
        citySlug,
        mode: activeMode,
        messages: conversationOnly,
        preview:
          preview.slice(0, 100) + (preview.length > 100 ? "…" : ""),
      });
      setActiveSessionId(entry.id);
      setHighlightHistoryId(entry.id);
    },
    [citySlug, countrySlug, upsertHistory]
  );

  const restoreSession = useCallback(
    (session: ChatHistorySession) => {
      sessionIdRef.current = session.id;
      setActiveSessionId(session.id);
      setMode(session.mode);
      setPlaceContext(undefined);
      setCompactedByIndex({});
      setMessages([
        {
          role: "assistant",
          content: welcomeForMode(t, cityName, session.mode),
        },
        ...session.messages,
      ]);
    },
    [t, cityName]
  );

  const handleSessionDeleted = useCallback(
    (deletedId: string) => {
      if (sessionIdRef.current !== deletedId) return;
      resetSession();
      resetWelcome(mode);
    },
    [mode, resetSession, resetWelcome]
  );

  useEffect(() => {
    resetSession();
    resetWelcome(mode);
  }, [cityName]); // eslint-disable-line react-hooks/exhaustive-deps -- reset on city change only

  useEffect(() => {
    if (launchKey === launchApplied.current) return;
    launchApplied.current = launchKey;
    if (!launchConfig) return;

    resetSession();
    const nextMode = launchConfig.mode ?? "guide";
    setMode(nextMode);
    if (launchConfig.placeContext) setPlaceContext(launchConfig.placeContext);
    resetWelcome(nextMode);

    if (launchConfig.autoSend && launchConfig.initialInput) {
      setInput("");
      queueMicrotask(() => {
        void sendMessage(launchConfig.initialInput, {
          mode: nextMode,
          placeContext: launchConfig.placeContext,
        });
      });
    } else if (launchConfig.initialInput) {
      setInput(launchConfig.initialInput);
    }
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [launchKey, launchConfig, resetWelcome]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = async (
    textOverride?: string,
    overrides?: { mode?: AIMode; placeContext?: PlaceContext }
  ) => {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

    const activeMode = overrides?.mode ?? mode;
    const activePlaceContext = overrides?.placeContext ?? placeContext;

    const userMessage: Message = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const conversationMessages = nextMessages.filter(
        (m, i) => !(i === 0 && m.role === "assistant")
      );

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          countrySlug,
          citySlug,
          locale,
          mode: activeMode,
          profile,
          placeContext: activePlaceContext,
        }),
      });

      if (res.status === 503) {
        setError(t("chat.noApiKey"));
        setMessages(messages);
        return;
      }

      if (!res.ok || !res.body) {
        throw new Error("Request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantText,
          };
          return updated;
        });
      }

      assistantText = enrichMapsLinksInText(assistantText, citySlug);
      const finalMessages: Message[] = [
        ...nextMessages,
        { role: "assistant", content: assistantText },
      ];
      setMessages(finalMessages);
      persistHistory(finalMessages, activeMode);
      setPlaceContext(undefined);
    } catch {
      setError(t("chat.error"));
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const handleSOSScenario = (scenarioId: string) => {
    void sendMessage(getSOSPrompt(scenarioId, locale, cityName), { mode: "sos" });
  };

  const quickPrompts = useMemo(() => {
    const keys = ["1", "2", "3"] as const;
    return keys
      .map((n) => t(`chat.prompts.${mode}.${n}`, { city: cityName }))
      .filter(Boolean);
  }, [t, mode, cityName]);

  const placeholder = t(`chat.placeholder.${mode}`);

  useEffect(() => {
    const el = messagesScrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleModeChange = (next: AIMode) => {
    setMode(next);
    setPlaceContext(undefined);
    if (messages.length <= 1) {
      resetSession();
      resetWelcome(next);
    }
  };

  const copyMessage = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      /* ignore */
    }
  };

  const historyCount = historySessions.length;
  const hasConversation = messages.some((m) => m.role === "user");

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    onExpandChange?.(expanded);
    if (!expanded) return;
    const html = document.documentElement;
    const prevBody = document.body.style.overflow;
    const prevHtml = html.style.overflow;
    document.body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      html.style.overflow = prevHtml;
    };
  }, [expanded, onExpandChange]);

  useEffect(() => {
    if (hasConversation) setControlsOpen(false);
  }, [hasConversation]);

  const toggleExpanded = () => {
    setExpanded((v) => {
      if (!v) setControlsOpen(false);
      return !v;
    });
  };

  const handleControlsToggle = () => {
    setControlsOpen((v) => !v);
  };

  const saveToFavorites = (content: string, compact = false) => {
    add({
      type: "chat",
      countrySlug,
      citySlug,
      title: compact
        ? `${t("favorites.chatTitle", { city: cityName })} — ${t("chat.compactTitle")}`
        : t("favorites.chatTitle", { city: cityName }),
      subtitle: (() => {
        const plain = plainTextFromMarkdown(content);
        return plain.slice(0, 100) + (plain.length > 100 ? "…" : "");
      })(),
      body: content,
    });
    toast(t("chat.savedFavorite"));
  };

  const compactMessage = async (content: string, index: number) => {
    if (compactingIndex !== null) return;
    setCompactingIndex(index);
    setError(null);

    try {
      const res = await fetch("/api/chat/compact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content, locale }),
      });

      if (res.status === 503) {
        setError(t("chat.noApiKey"));
        return;
      }

      if (!res.ok) {
        throw new Error("compact failed");
      }

      const data = (await res.json()) as { text?: string };
      const compact = data.text?.trim();
      if (!compact) throw new Error("empty compact");

      const enriched = enrichMapsLinksInText(
        normalizeChatMarkdown(compact),
        citySlug
      );
      setCompactedByIndex((prev) => ({ ...prev, [index]: enriched }));
    } catch {
      setError(t("chat.compactError"));
    } finally {
      setCompactingIndex(null);
    }
  };

  const saveFavoriteWithFeedback = (content: string, index: number, compact = false) => {
    saveToFavorites(content, compact);
    const key = `${index}-${compact ? "compact" : "full"}`;
    setFavoriteSavedKey(key);
    setTimeout(() => setFavoriteSavedKey(null), 2000);
  };

  return (
    <ChatShell expanded={expanded} portalReady={portalReady}>
      <ChatSavedPanel
        citySlug={citySlug}
        activeSessionId={activeSessionId}
        highlightId={highlightHistoryId}
        mobileOpen={savedPanelMobileOpen}
        onMobileOpenChange={setSavedPanelMobileOpen}
        onRestoreSession={restoreSession}
        onSessionDeleted={handleSessionDeleted}
      />

      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-border px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display text-base font-black sm:text-lg">{t("chat.title")}</h3>
            {controlsOpen ? (
              <p className="text-sm text-muted">{t("chat.subtitle", { city: cityName })}</p>
            ) : (
              <p className="truncate text-xs text-muted">{t("chat.subtitle", { city: cityName })}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={handleControlsToggle}
              className="inline-flex items-center gap-1 rounded-xl border border-border px-2.5 py-2 text-xs font-semibold text-muted transition-colors hover:border-accent/40 hover:text-accent"
              aria-expanded={controlsOpen}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {controlsOpen ? t("chat.hideControls") : t("chat.showControls")}
              </span>
              {controlsOpen ? (
                <ChevronUp className="h-3.5 w-3.5 sm:hidden" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 sm:hidden" />
              )}
            </button>
            <button
              type="button"
              onClick={toggleExpanded}
              className="inline-flex items-center justify-center rounded-xl border border-border p-2 text-muted transition-colors hover:border-accent/40 hover:text-accent"
              aria-label={expanded ? t("chat.collapse") : t("chat.expand")}
            >
              {expanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setSavedPanelMobileOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-2.5 py-2 text-xs font-semibold text-muted transition-colors hover:border-accent/40 hover:text-accent md:hidden"
            >
              <Bookmark className="h-4 w-4 text-accent" />
              {historyCount > 0 ? historyCount : t("chat.history.short")}
            </button>
          </div>
        </div>

        {controlsOpen && !expanded && (
          <div className="mt-3 space-y-3 sm:space-y-4">
            <AIModeSelector value={mode} onChange={handleModeChange} disabled={loading} />
            <TravelProfileBar value={profile} onChange={setProfile} disabled={loading} />
            {placeContext && (
              <p className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs text-foreground">
                {t("chat.aboutPlace", { place: placeContext.title })}
              </p>
            )}
            {mode === "sos" && <SOSChatBar onScenario={handleSOSScenario} />}
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  disabled={loading}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-accent/40 hover:text-foreground disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {expanded && controlsOpen && (
        <div className="chat-scroll shrink-0 border-b border-border px-3 py-3 sm:px-5 max-h-[min(34dvh,320px)] overflow-y-auto overscroll-contain">
          <AIModeSelector value={mode} onChange={handleModeChange} disabled={loading} compact />
          <div className="mt-3 space-y-3">
            <TravelProfileBar value={profile} onChange={setProfile} disabled={loading} />
            {placeContext && (
              <p className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs text-foreground">
                {t("chat.aboutPlace", { place: placeContext.title })}
              </p>
            )}
            {mode === "sos" && <SOSChatBar onScenario={handleSOSScenario} />}
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  disabled={loading}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-accent/40 hover:text-foreground disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        className={`flex min-h-0 flex-1 basis-0 flex-col overflow-hidden ${
          expanded ? "mx-auto w-full max-w-3xl" : ""
        }`}
      >
        <div
          ref={messagesScrollRef}
          className="chat-scroll min-h-0 flex-1 basis-0 space-y-4 overflow-y-auto overscroll-contain p-3 sm:p-5"
          onWheel={(e) => e.stopPropagation()}
        >

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={msg.role === "assistant" ? "space-y-2" : ""}
          >
            <div
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  msg.role === "user"
                    ? "bg-accent text-white"
                    : "bg-surface-hover text-accent"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div
                className={`group relative rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  expanded && msg.role === "assistant" ? "max-w-full" : "max-w-[92%]"
                } ${
                  msg.role === "user"
                    ? "bg-accent text-white"
                    : "bg-surface-hover text-foreground"
                }`}
              >
                {msg.content ? (
                  <ChatMarkdown
                    content={msg.content}
                    variant={msg.role === "user" ? "user" : "assistant"}
                  />
                ) : loading && i === messages.length - 1 ? (
                  <span className="inline-flex gap-1 text-muted">
                    <span className="animate-pulse">●</span>
                    <span className="animate-pulse [animation-delay:150ms]">●</span>
                    <span className="animate-pulse [animation-delay:300ms]">●</span>
                  </span>
                ) : null}
                {msg.role === "assistant" && msg.content && i > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 border-t border-border/50 pt-2">
                    <button
                      type="button"
                      onClick={() => copyMessage(msg.content, i)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-foreground"
                    >
                      {copiedIndex === i ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {t("chat.copy")}
                    </button>
                    <button
                      type="button"
                      onClick={() => compactMessage(msg.content, i)}
                      disabled={compactingIndex !== null}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-foreground disabled:opacity-50"
                    >
                      {compactingIndex === i ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ListCollapse className="h-3.5 w-3.5" />
                      )}
                      {compactingIndex === i ? t("chat.compacting") : t("chat.compact")}
                    </button>
                    <button
                      type="button"
                      onClick={() => saveFavoriteWithFeedback(msg.content, i)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-accent"
                    >
                      {favoriteSavedKey === `${i}-full` ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Heart className="h-3.5 w-3.5" />
                      )}
                      {favoriteSavedKey === `${i}-full`
                        ? t("chat.savedFavorite")
                        : t("chat.saveFavorite")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {msg.role === "assistant" && compactedByIndex[i] && (
              <div className="ml-11 min-w-0 max-w-[min(100%,42rem)] pr-2">
                <div className="rounded-xl border border-accent/25 bg-accent/5 px-3 py-2.5">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                    {t("chat.compactTitle")}
                  </p>
                  <ChatMarkdown content={compactedByIndex[i]} variant="assistant" />
                  <div className="mt-2 flex flex-wrap gap-2 border-t border-accent/20 pt-2">
                    <button
                      type="button"
                      onClick={() => copyMessage(compactedByIndex[i], i)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-foreground"
                    >
                      {copiedIndex === i ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {t("chat.copy")}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        saveFavoriteWithFeedback(compactedByIndex[i], i, true)
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-accent"
                    >
                      {favoriteSavedKey === `${i}-compact` ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Heart className="h-3.5 w-3.5 fill-accent/20" />
                      )}
                      {favoriteSavedKey === `${i}-compact`
                        ? t("chat.savedFavorite")
                        : t("chat.saveFavoriteCompact")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
        <div ref={bottomRef} />
        </div>

      {error && (
        <p className="shrink-0 border-t border-border px-4 py-2 text-sm text-red-500">{error}</p>
      )}

      <form
        className="flex shrink-0 gap-2 border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
          className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          aria-label={t("chat.send")}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
      </div>
      </div>
    </ChatShell>
  );
}
