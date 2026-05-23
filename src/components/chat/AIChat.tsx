"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Send, Bot, User, Loader2, Copy, Check, Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Locale } from "@/types/content";
import { useT } from "@/components/providers/LocaleProvider";
import { ChatMarkdown } from "@/components/chat/ChatMarkdown";
import { useFavorites } from "@/hooks/useFavorites";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatProps {
  cityName: string;
  countrySlug: string;
  citySlug: string;
  locale: Locale;
}

export function AIChat({
  cityName,
  countrySlug,
  citySlug,
  locale,
}: AIChatProps) {
  const t = useT();
  const { add } = useFavorites();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: t("chat.welcome", { city: cityName }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const quickPrompts = useMemo(
    () => [
      t("chat.prompts.food"),
      t("chat.prompts.beach"),
      t("chat.prompts.transport"),
      t("chat.prompts.scams"),
    ],
    [t]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

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
    } catch {
      setError(t("chat.error"));
      setMessages(messages);
    } finally {
      setLoading(false);
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

  const saveToFavorites = (content: string) => {
    add({
      type: "chat",
      countrySlug,
      citySlug,
      title: t("favorites.chatTitle", { city: cityName }),
      subtitle: content.slice(0, 80) + (content.length > 80 ? "…" : ""),
      body: content,
    });
  };

  return (
    <div className="flex h-[min(70vh,600px)] flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-display text-lg font-black">{t("chat.title")}</h3>
        <p className="text-sm text-muted">
          {t("chat.subtitle", { city: cityName })}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
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

      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
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
              className={`group relative max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
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
                <div className="mt-2 flex gap-2 border-t border-border/50 pt-2">
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
                    onClick={() => saveToFavorites(msg.content)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-accent"
                  >
                    <Heart className="h-3.5 w-3.5" />
                    {t("chat.saveFavorite")}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="border-t border-border px-4 py-2 text-sm text-red-500">
          {error}
        </p>
      )}

      <form
        className="flex gap-2 border-t border-border p-4"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("chat.placeholder")}
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
  );
}
