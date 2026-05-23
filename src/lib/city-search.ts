import type { CityContent, CityTab, Locale } from "@/types/content";
import { CITY_SECTION_KEYS, type CitySectionKey } from "@/lib/city-sections";

export interface CitySearchHit {
  id: string;
  title: string;
  snippet: string;
  sectionKey: CitySectionKey;
  sectionTitle: string;
  tab: CityTab;
  itemIndex: number;
}

const SECTION_TO_TAB: Partial<Record<CitySectionKey, CityTab>> = {
  districts: "overview",
  airport: "transport",
  sights: "sights",
  beaches: "sights",
  tours: "sights",
  food: "food",
  markets: "food",
  transport: "transport",
  simAndInternet: "lifehacks",
  money: "lifehacks",
  safety: "lifehacks",
  phrases: "lifehacks",
  lifehacks: "lifehacks",
  scams: "lifehacks",
};

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

export function searchCityContent(
  city: CityContent,
  query: string,
  locale: Locale,
  limit = 12
): CitySearchHit[] {
  const q = normalize(query);
  if (!q || q.length < 2) return [];

  const hits: CitySearchHit[] = [];

  for (const sectionKey of CITY_SECTION_KEYS) {
    const section = city[sectionKey];
    if (!section?.items?.length) continue;

    const tab = SECTION_TO_TAB[sectionKey] ?? "overview";
    const sectionTitle = section.title[locale];

    section.items.forEach((item, itemIndex) => {
      const title = item.title[locale];
      const description = item.description[locale];
      const tipsText = item.tips?.[locale]?.join(" ") ?? "";
      const haystack = normalize(`${title} ${description} ${tipsText} ${item.price?.[locale] ?? ""}`);

      if (!haystack.includes(q)) return;

      hits.push({
        id: `${sectionKey}-${itemIndex}`,
        title,
        snippet: description.slice(0, 120) + (description.length > 120 ? "…" : ""),
        sectionKey,
        sectionTitle,
        tab,
        itemIndex,
      });
    });
  }

  const overviewText = normalize(city.overview[locale]);
  if (overviewText.includes(q)) {
    hits.unshift({
      id: "overview",
      title: city.name[locale],
      snippet: city.overview[locale].slice(0, 120) + "…",
      sectionKey: "districts",
      sectionTitle: city.name[locale],
      tab: "overview",
      itemIndex: 0,
    });
  }

  return hits.slice(0, limit);
}
