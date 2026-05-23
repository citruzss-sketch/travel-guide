import type { Locale } from "@/types/content";

export const PDF_BRAND = {
  name: {
    ru: "Онлайн Путеводитель",
    en: "Online Travel Guide",
  },
  tagline: {
    ru: "Карманный travel-гид с AI-ассистентом",
    en: "Your pocket travel guide with AI assistant",
  },
  features: {
    ru: [
      "Структурированные советы без воды",
      "AI-помощник по городу на сайте",
      "Интерактивная карта и избранное",
      "Оффлайн PDF — этот файл",
    ],
    en: [
      "Structured, practical travel tips",
      "City AI assistant on the website",
      "Interactive map and favorites",
      "Offline PDF — this guide",
    ],
  },
} as const;

export function cityPageUrl(
  siteUrl: string,
  locale: Locale,
  countrySlug: string,
  citySlug: string
): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/${locale}/${countrySlug}/${citySlug}`;
}

export function pdfSiteLabel(siteUrl: string): string {
  try {
    const host = new URL(siteUrl).host;
    return host.replace(/^www\./, "");
  } catch {
    return siteUrl;
  }
}
