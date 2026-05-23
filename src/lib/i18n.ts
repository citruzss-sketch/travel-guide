import type { Locale } from "@/types/content";

export const locales: Locale[] = ["ru", "en"];
export const defaultLocale: Locale = "ru";

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocalizedPath(locale: Locale, path: string = ""): string {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

export type Messages = typeof import("@/messages/ru.json");

export async function getMessages(locale: Locale): Promise<Messages> {
  switch (locale) {
    case "en":
      return (await import("@/messages/en.json")).default;
    default:
      return (await import("@/messages/ru.json")).default;
  }
}

export function t(
  messages: Messages,
  key: string,
  params?: Record<string, string>
): string {
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
}
