"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/types/content";

interface LocaleContextValue {
  locale: Locale;
  messages: Messages;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={{ locale, messages }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export function useT() {
  const { messages } = useLocale();
  return (key: string, params?: Record<string, string>) => {
    const keys = key.split(".");
    let value: unknown = messages;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    if (typeof value !== "string") return key;
    if (!params) return value;
    return Object.entries(params).reduce(
      (str, [k, v]) => str.replace(`{${k}}`, v),
      value
    );
  };
}
