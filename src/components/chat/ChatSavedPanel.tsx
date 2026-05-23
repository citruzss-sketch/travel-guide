"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Trash2,
  X,
} from "lucide-react";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useLocale, useT } from "@/components/providers/LocaleProvider";
import { ChatMarkdown } from "@/components/chat/ChatMarkdown";
import type { ChatHistorySession } from "@/lib/chat-history";

interface ChatSavedPanelProps {
  citySlug: string;
  activeSessionId?: string | null;
  highlightId?: string | null;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  onRestoreSession?: (session: ChatHistorySession) => void;
  onSessionDeleted?: (sessionId: string) => void;
}

function formatSavedDate(ts: number, locale: string): string {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

export function ChatSavedPanel({
  citySlug,
  activeSessionId,
  highlightId,
  mobileOpen = false,
  onMobileOpenChange,
  onRestoreSession,
  onSessionDeleted,
}: ChatSavedPanelProps) {
  const t = useT();
  const { locale } = useLocale();
  const { sessions, remove } = useChatHistory(citySlug);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [flashId, setFlashId] = useState<string | null>(null);

  const selected =
    sessions.find((s) => s.id === selectedId) ?? sessions[0] ?? null;

  useEffect(() => {
    if (sessions.length === 0) {
      setSelectedId(null);
      return;
    }
    if (activeSessionId && sessions.some((s) => s.id === activeSessionId)) {
      setSelectedId(activeSessionId);
      return;
    }
    if (!selectedId || !sessions.some((s) => s.id === selectedId)) {
      setSelectedId(sessions[0].id);
    }
  }, [sessions, selectedId, activeSessionId]);

  useEffect(() => {
    if (!highlightId) return;
    setSelectedId(highlightId);
    setCollapsed(false);
    onMobileOpenChange?.(true);
    setFlashId(highlightId);
    const timer = setTimeout(() => setFlashId(null), 2200);
    return () => clearTimeout(timer);
  }, [highlightId, onMobileOpenChange]);

  const copySelected = async () => {
    if (!selected) return;
    const text = selected.messages
      .map((m) => `${m.role === "user" ? t("chat.history.you") : "AI"}: ${m.content}`)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const selectSession = (session: ChatHistorySession) => {
    setSelectedId(session.id);
    onRestoreSession?.(session);
  };

  const sessionList = (compact = false) =>
    sessions.map((item) => {
      const active = item.id === selected?.id || item.id === activeSessionId;
      return (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => selectSession(item)}
            className={`w-full rounded-lg px-2.5 py-2 text-left transition-colors ${
              active
                ? "bg-accent/15 ring-1 ring-accent/30"
                : "hover:bg-surface-hover"
            } ${flashId === item.id ? "animate-pulse bg-accent/20" : ""}`}
          >
            {!compact && (
              <span className="truncate text-[10px] text-muted">
                {formatSavedDate(item.updatedAt, locale)}
              </span>
            )}
            <p className={`line-clamp-2 text-xs leading-snug text-foreground ${compact ? "" : "mt-0.5"}`}>
              {item.preview}
            </p>
          </button>
        </li>
      );
    });

  const sessionDetail = selected ? (
    <div className="flex min-h-0 flex-1 flex-col p-3">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {selected.messages.map((msg, i) => (
          <div key={i}>
            <p
              className={`mb-1 text-[10px] font-bold uppercase tracking-wider ${
                msg.role === "user" ? "text-accent" : "text-muted"
              }`}
            >
              {msg.role === "user" ? t("chat.history.you") : t("chat.history.ai")}
            </p>
            <ChatMarkdown
              content={msg.content}
              variant={msg.role === "user" ? "user" : "assistant"}
              compact
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex shrink-0 gap-2 border-t border-border pt-2">
        <button
          type="button"
          onClick={copySelected}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-border py-1.5 text-xs font-semibold text-muted hover:text-foreground"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {t("chat.copy")}
        </button>
        <button
          type="button"
          onClick={() => {
            const id = selected.id;
            remove(id);
            if (activeSessionId === id) onSessionDeleted?.(id);
          }}
          className="inline-flex items-center justify-center rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted hover:border-red-500/40 hover:text-red-500"
          aria-label={t("chat.history.remove")}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  ) : null;

  return (
    <>
      <motion.div
        initial={false}
        animate={{ width: collapsed ? 48 : 288 }}
        className="hidden h-full shrink-0 flex-col border-r border-border bg-background/95 md:flex"
      >
        <div className="flex items-center justify-between border-b border-border px-3 py-3">
          {!collapsed && (
            <div className="flex min-w-0 items-center gap-2">
              <History className="h-4 w-4 shrink-0 text-accent" />
              <div className="min-w-0">
                <p className="truncate text-xs font-bold uppercase tracking-wider text-accent">
                  {t("chat.history.title")}
                </p>
                <p className="truncate text-[10px] text-muted">
                  {t("chat.history.count", { count: String(sessions.length) })}
                </p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="ml-auto rounded-lg p-1.5 text-muted hover:bg-surface-hover hover:text-foreground"
            aria-label={
              collapsed ? t("chat.savedPanel.expand") : t("chat.savedPanel.collapse")
            }
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {!collapsed && (
          <div className="flex min-h-0 flex-1 flex-col">
            {sessions.length === 0 ? (
              <p className="px-3 py-6 text-center text-xs leading-relaxed text-muted">
                {t("chat.history.empty")}
              </p>
            ) : (
              <>
                <ul className="max-h-44 shrink-0 space-y-1 overflow-y-auto border-b border-border p-2">
                  {sessionList()}
                </ul>
                {sessionDetail}
              </>
            )}
          </div>
        )}

        {collapsed && sessions.length > 0 && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="flex flex-1 flex-col items-center gap-2 py-4 text-accent"
            aria-label={t("chat.savedPanel.expand")}
          >
            <History className="h-5 w-5" />
            <span className="text-[10px] font-bold">{sessions.length}</span>
          </button>
        )}
      </motion.div>

      <div className="md:hidden">
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[80] bg-black/50"
                onClick={() => onMobileOpenChange?.(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
                className="fixed left-0 top-0 z-[90] flex h-full w-[min(100%,320px)] flex-col border-r border-border bg-background shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div>
                    <p className="font-display text-sm font-black">
                      {t("chat.history.title")}
                    </p>
                    <p className="text-xs text-muted">
                      {t("chat.history.count", { count: String(sessions.length) })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onMobileOpenChange?.(false)}
                    className="rounded-lg p-2 text-muted hover:bg-surface-hover"
                    aria-label={t("favorites.close")}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {sessions.length === 0 ? (
                  <p className="px-4 py-10 text-center text-sm text-muted">
                    {t("chat.history.empty")}
                  </p>
                ) : (
                  <div className="flex min-h-0 flex-1 flex-col">
                    <ul className="max-h-48 shrink-0 space-y-1 overflow-y-auto border-b border-border p-2">
                      {sessionList(true)}
                    </ul>
                    {sessionDetail}
                  </div>
                )}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
