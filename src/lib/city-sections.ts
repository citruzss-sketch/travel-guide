export const CITY_SECTION_KEYS = [
  "airport",
  "districts",
  "sights",
  "beaches",
  "food",
  "markets",
  "tours",
  "transport",
  "simAndInternet",
  "money",
  "safety",
  "phrases",
  "lifehacks",
  "scams",
] as const;

export type CitySectionKey = (typeof CITY_SECTION_KEYS)[number];
