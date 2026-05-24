"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  ChevronLeft,
  ChevronRight,
  Trash2,
  X,
} from "lucide-react";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useLocale, useT } from "@/components/providers/LocaleProvider";
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

  const selectSession = (session: ChatHistorySession) => {
    setSelectedId(session.id);
    onRestoreSession?.(session);
    onMobileOpenChange?.(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    remove(id);
    if (activeSessionId === id) onSessionDeleted?.(id);
  };

  const sessionList = () =>
    sessions.map((item) => {
      const active = item.id === selected?.id || item.id === activeSessionId;
      return (
        <li key={item.id}>
          <div
            className={`group flex items-start gap-1 rounded-lg transition-colors ${
              active
                ? "bg-accent/15 ring-1 ring-accent/30"
                : "hover:bg-surface-hover"
            } ${flashId === item.id ? "animate-pulse bg-accent/20" : ""}`}
          >
            <button
              type="button"
              onClick={() => selectSession(item)}
              className="min-w-0 flex-1 rounded-lg px-2.5 py-2 text-left"
            >
              <span className="truncate text-[10px] text-muted">
                {formatSavedDate(item.updatedAt, locale)}
              </span>
              <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-foreground">
                {item.preview}
              </p>
            </button>
            <button
              type="button"
              onClick={(e) => deleteSession(item.id, e)}
              className="mt-2 shrink-0 rounded-lg p-1.5 text-muted opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
              aria-label={t("chat.history.remove")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </li>
      );
    });

  return (
    <>
      <motion.div
        initial={false}
        animate={{ width: collapsed ? 48 : 288 }}
        className="hidden h-full min-h-0 shrink-0 flex-col border-r border-border bg-background/95 md:flex"
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
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {sessions.length === 0 ? (
              <p className="px-1 py-6 text-center text-xs leading-relaxed text-muted">
                {t("chat.history.empty")}
              </p>
            ) : (
              <ul className="space-y-1">{sessionList()}</ul>
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

                <div className="min-h-0 flex-1 overflow-y-auto p-2">
                  {sessions.length === 0 ? (
                    <span className="block px-2 py-10 text-center text-sm text-muted">
                      {t("chat.history.empty")}
                    </span>
                  ) : (
                    <ul className="space-y-1">{sessionList()}</ul>
                  )}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
