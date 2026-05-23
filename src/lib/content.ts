import fs from "fs";
import path from "path";
import type { CityContent, CountryMeta } from "@/types/content";

export { CITY_SECTION_KEYS, type CitySectionKey } from "@/lib/city-sections";

const contentDir = path.join(process.cwd(), "content", "countries");

export function getAllCountries(): CountryMeta[] {
  const countriesDir = contentDir;
  if (!fs.existsSync(countriesDir)) return [];

  return fs
    .readdirSync(countriesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const metaPath = path.join(countriesDir, d.name, "meta.json");
      return JSON.parse(fs.readFileSync(metaPath, "utf-8")) as CountryMeta;
    });
}

export function getCountry(slug: string): CountryMeta | null {
  const metaPath = path.join(contentDir, slug, "meta.json");
  if (!fs.existsSync(metaPath)) return null;
  return JSON.parse(fs.readFileSync(metaPath, "utf-8")) as CountryMeta;
}

export function getCity(countrySlug: string, citySlug: string): CityContent | null {
  const cityPath = path.join(contentDir, countrySlug, "cities", `${citySlug}.json`);
  if (!fs.existsSync(cityPath)) return null;

  const base = JSON.parse(fs.readFileSync(cityPath, "utf-8")) as CityContent;
  const extrasPath = path.join(
    contentDir,
    countrySlug,
    "cities",
    `${citySlug}.extras.json`
  );

  if (!fs.existsSync(extrasPath)) {
    return { ...base, timezoneOffset: base.timezoneOffset ?? 7 };
  }

  const extras = JSON.parse(fs.readFileSync(extrasPath, "utf-8")) as Partial<CityContent>;
  return {
    ...base,
    ...extras,
    timezoneOffset: extras.timezoneOffset ?? base.timezoneOffset ?? 7,
  };
}

export function getCitiesForCountry(countrySlug: string): CityContent[] {
  const country = getCountry(countrySlug);
  if (!country) return [];
  return country.cities
    .map((slug) => getCity(countrySlug, slug))
    .filter((c): c is CityContent => c !== null);
}

export interface SearchResult {
  type: "country" | "city";
  countrySlug: string;
  citySlug?: string;
  nameRu: string;
  nameEn: string;
}

export function searchDestinations(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: SearchResult[] = [];
  const countries = getAllCountries();

  for (const country of countries) {
    if (
      country.name.ru.toLowerCase().includes(q) ||
      country.name.en.toLowerCase().includes(q) ||
      country.slug.includes(q)
    ) {
      results.push({
        type: "country",
        countrySlug: country.slug,
        nameRu: country.name.ru,
        nameEn: country.name.en,
      });
    }

    for (const citySlug of country.cities) {
      const city = getCity(country.slug, citySlug);
      if (!city) continue;
      if (
        city.name.ru.toLowerCase().includes(q) ||
        city.name.en.toLowerCase().includes(q) ||
        city.slug.includes(q)
      ) {
        results.push({
          type: "city",
          countrySlug: country.slug,
          citySlug: city.slug,
          nameRu: city.name.ru,
          nameEn: city.name.en,
        });
      }
    }
  }

  return results;
}

export function buildCitySystemPrompt(city: CityContent, locale: string): string {
  return `You are a knowledgeable travel assistant for ${city.name.en} (${city.name.ru}), Vietnam.
You help travelers with practical, accurate, up-to-date advice about this specific city.

KNOWLEDGE BASE:
${city.aiKnowledgeBase}

GUIDELINES:
- Answer in ${locale === "ru" ? "Russian" : "English"} unless the user writes in another language
- Be concise, practical, and friendly — like a local friend
- Focus on ${city.name.en}: restaurants, transport, beaches, safety, prices, hidden gems
- Give specific names, prices in VND, and neighborhoods when relevant
- Warn about common scams when appropriate
- If asked about other cities, briefly mention but redirect focus to ${city.name.en}
- Never invent specific business hours or prices you're unsure about — say "check locally"
- Keep responses under 300 words unless the user asks for a detailed plan

FORMATTING (Markdown):
- Use **bold** for place names, prices, and key terms
- Use numbered lists (1. 2. 3.) for step-by-step recommendations — put each item on its own line with a blank line between items
- Use bullet lists (- item) for short tips (3+ items)
- Keep a short intro paragraph, then structured list — never one long wall of text
- Separate sections with a blank line
- Do not use # headers unless the answer is very long`;
}

