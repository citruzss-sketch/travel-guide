"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CHAT_HISTORY_CHANGED_EVENT,
  CHAT_HISTORY_STORAGE_KEY,
  getChatHistory,
  removeChatSession,
  upsertChatSession,
  type ChatHistorySession,
} from "@/lib/chat-history";

export function useChatHistory(citySlug?: string) {
  const [sessions, setSessions] = useState<ChatHistorySession[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setSessions(getChatHistory(citySlug));
  }, [citySlug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    setReady(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === CHAT_HISTORY_STORAGE_KEY) refresh();
    };
    const onChanged = () => refresh();

    window.addEventListener("storage", onStorage);
    window.addEventListener(CHAT_HISTORY_CHANGED_EVENT, onChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CHAT_HISTORY_CHANGED_EVENT, onChanged);
    };
  }, [refresh]);

  const upsert = useCallback(
    (session: Omit<ChatHistorySession, "createdAt" | "updatedAt">) => {
      const entry = upsertChatSession(session);
      refresh();
      return entry;
    },
    [refresh]
  );

  const remove = useCallback(
    (id: string) => {
      removeChatSession(id);
      refresh();
    },
    [refresh]
  );

  return { sessions, ready, upsert, remove, refresh };
}
