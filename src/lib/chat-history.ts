import type { AIMode } from "@/lib/ai-modes";

export interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatHistorySession {
  id: string;
  countrySlug: string;
  citySlug: string;
  mode: AIMode;
  messages: ChatHistoryMessage[];
  preview: string;
  createdAt: number;
  updatedAt: number;
}

export const CHAT_HISTORY_STORAGE_KEY = "travel-guide-chat-history";
export const CHAT_HISTORY_CHANGED_EVENT = "travel-guide-chat-history-changed";

function readAll(): ChatHistorySession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatHistorySession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(sessions: ChatHistorySession[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(sessions));
  window.dispatchEvent(new CustomEvent(CHAT_HISTORY_CHANGED_EVENT));
}

export function getChatHistory(citySlug?: string): ChatHistorySession[] {
  const all = readAll().sort((a, b) => b.updatedAt - a.updatedAt);
  if (!citySlug) return all;
  return all.filter((s) => s.citySlug === citySlug);
}

export function upsertChatSession(
  session: Omit<ChatHistorySession, "createdAt" | "updatedAt"> & {
    createdAt?: number;
  }
): ChatHistorySession {
  const now = Date.now();
  const sessions = readAll();
  const existing = sessions.find((s) => s.id === session.id);

  const entry: ChatHistorySession = {
    ...session,
    createdAt: existing?.createdAt ?? session.createdAt ?? now,
    updatedAt: now,
  };

  const next = existing
    ? sessions.map((s) => (s.id === session.id ? entry : s))
    : [entry, ...sessions];

  writeAll(next);
  return entry;
}

export function removeChatSession(id: string): void {
  writeAll(readAll().filter((s) => s.id !== id));
}

export function createSessionId(citySlug: string): string {
  return `session-${citySlug}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
