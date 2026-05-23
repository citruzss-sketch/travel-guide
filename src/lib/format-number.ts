/** Stable number formatting for SSR + client (avoids hydration mismatch). */
export function formatNumber(value: number, locale: "ru" | "en" = "en"): string {
  return value.toLocaleString(locale === "ru" ? "ru-RU" : "en-US");
}
