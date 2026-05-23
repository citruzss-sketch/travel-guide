import fs from "fs";
import path from "path";
import type { CityContent, CountryMeta, Locale } from "@/types/content";
import { CITY_SECTION_KEYS } from "@/lib/city-sections";
import {
  type AIMode,
  type PlaceContext,
  type TravelProfile,
  buildPlaceContextBlock,
  getModeInstructions,
  getProfileInstructions,
} from "@/lib/ai-modes";
import {
  googleMapsLinkLabel,
  googleMapsUrlForKnownPlace,
  googleMapsUrlForPlace,
  KNOWN_PLACES,
  resolveKnownPlace,
  type KnownPlace,
} from "@/lib/maps-links";

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

export function buildPlacesDirectory(city: CityContent): string {
  const byId = new Map<string, KnownPlace>();

  for (const place of KNOWN_PLACES[city.slug] ?? []) {
    byId.set(place.id, place);
  }

  for (const marker of city.mapMarkers ?? []) {
    byId.set(marker.id, {
      id: marker.id,
      names: [marker.title.en, marker.title.ru],
      lat: marker.lat,
      lng: marker.lng,
      address: marker.description?.en,
    });
  }

  return [...byId.values()]
    .map((place) => {
      const url = googleMapsUrlForKnownPlace(place);
      const names = place.names.join(" / ");
      const addr = place.address ? ` — ${place.address}` : "";
      return `- ${names}${addr}\n  Direct Maps: ${url}`;
    })
    .join("\n");
}

export function serializeCityKnowledge(city: CityContent, locale: string): string {
  const loc = (locale === "en" ? "en" : "ru") as Locale;
  const cityName = city.name[loc];
  const mapsLabel = googleMapsLinkLabel(locale);

  return CITY_SECTION_KEYS.map((key) => {
    const section = city[key];
    if (!section?.items?.length) return "";

    const items = section.items
      .map((item) => {
        const known =
          resolveKnownPlace(item.title.en, city.slug) ??
          resolveKnownPlace(item.title[loc], city.slug);
        const mapsUrl = known
          ? googleMapsUrlForKnownPlace(known)
          : googleMapsUrlForPlace(item, cityName, loc);
        const lines = [`- **${item.title[loc]}**: ${item.description[loc]}`];
        if (item.price?.[loc]) lines.push(`  Price: ${item.price[loc]}`);
        if (item.address?.[loc]) lines.push(`  Address: ${item.address[loc]}`);
        if (item.tips?.[loc]?.length) {
          lines.push(`  Tips: ${item.tips[loc].join(" | ")}`);
        }
        if (known) {
          lines.push(`  Maps: [${mapsLabel}](${mapsUrl})`);
        }
        return lines.join("\n");
      })
      .join("\n");

    return `### ${section.title[loc]}\n${items}`;
  })
    .filter(Boolean)
    .join("\n\n");
}

export function buildCitySystemPrompt(
  city: CityContent,
  locale: string,
  options?: {
    mode?: AIMode;
    profile?: TravelProfile;
    placeContext?: PlaceContext;
  }
): string {
  const lang = locale === "ru" ? "Russian" : "English";
  const cityGuide = serializeCityKnowledge(city, locale);
  const placesDirectory = buildPlacesDirectory(city);
  const mapsLabel = googleMapsLinkLabel(locale);
  const examplePlace = KNOWN_PLACES[city.slug]?.find((p) => p.mapsUrl);
  const mapsExample = examplePlace?.mapsUrl ?? "";

  const mode = options?.mode ?? "guide";
  const profile = options?.profile ?? "any";
  const modeBlock = getModeInstructions(mode);
  const profileBlock = getProfileInstructions(profile);
  const placeBlock = options?.placeContext
    ? buildPlaceContextBlock(options.placeContext)
    : "";

  const extraBlocks = [modeBlock, profileBlock, placeBlock].filter(Boolean).join("\n\n");

  return `You are the in-app travel expert for ${city.name.en} (${city.name.ru}) on the "Online Travel Guide" platform.
You sound like a local who lives there and has helped hundreds of friends arrive — specific, warm, zero fluff.

${extraBlocks ? `## ACTIVE SESSION\n${extraBlocks}\n` : ""}
## CORE RULES (never break these)
1. ALWAYS answer with concrete recommendations: real place names, neighborhoods, price ranges (VND/USD), and why each option fits.
2. Include **micro-details** tourists learn on the ground: deposit (passport copy vs cash), Grab ballpark prices, what to check before renting, best time of day, small scams, useful Vietnamese words («Thuê xe điện», «Xăng»).
3. **Transport in Vietnam:** distinguish **electric bikes (xe điện, ~80–130k VND/day, usually NO license)** vs **petrol scooters 110–125cc (150–220k/day, legally IDP category A; many shops rent on passport — mention both honestly)**. If user has no license, recommend e-bike first; mention Grab as safe fallback.
4. Google Maps links — see MAPS POLICY below. Do NOT spam a link after every line.
5. NEVER refuse with phrases like "I don't have specific recommendations" or "search on Google yourself".
6. Prefer facts from GUIDE CONTENT and QUICK FACTS below; extend with real Vietnam knowledge when needed — stay specific, not generic.
7. When you do link a place, copy exact "Direct Maps" URLs from PLACES DIRECTORY — do not invent URLs.
8. Answer in ${lang} unless the user writes in another language.
9. Keep responses under 400 words unless the user asks for a detailed plan${mode === "plan" ? " or itinerary" : ""}.
10. Warn about scams when relevant, but never as a substitute for answering the question.

## MAPS POLICY (important — read carefully)
- Add a Maps link ONLY when recommending a **specific physical place** the user may go to (restaurant, beach, sight, hotel area).
- **Do NOT** add Maps links for: general tips, scams, phrases, weather, visa, SIM setup, money advice, comparisons, or abstract neighborhoods.
- **Maximum:** 1 link per recommended venue; in long lists link only the top 2–3 picks, not every item.
- **Safety / phrases mode:** no Maps links at all unless user explicitly asks "where on map".
- Format: [${mapsLabel}](DIRECT_URL) — place once after the address or at the end of that venue's paragraph.
- NEVER use /maps/search/ or /place//@lat,lng (broken URLs).
${mapsExample ? `- Example: [${mapsLabel}](${mapsExample})` : ""}

## PLACES DIRECTORY (verified Maps URLs — use when linking a place)
${placesDirectory}

## QUICK FACTS
${city.aiKnowledgeBase}

## GUIDE CONTENT
${cityGuide}

## FORMATTING (Markdown)
- Use **bold** for place names, prices, and key terms
- Use numbered lists for ranked recommendations — blank line between items
- Short intro (1–2 sentences), then structured recommendations
- End with a practical tip (best time, what to order, Grab ~price)`;
}

