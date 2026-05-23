export type Locale = "ru" | "en";

export type LocalizedString = Record<Locale, string>;

export type LocalizedList = Record<Locale, string[]>;

export interface Coordinates {
  lat: number;
  lng: number;
}

export type MapMarkerCategory =
  | "airport"
  | "beach"
  | "food"
  | "sight"
  | "district"
  | "transport";

export interface MapMarker {
  id: string;
  title: LocalizedString;
  description?: LocalizedString;
  lat: number;
  lng: number;
  category: MapMarkerCategory;
}

export interface ChecklistItem {
  id: string;
  label: LocalizedString;
}

export interface ContentItem {
  title: LocalizedString;
  description: LocalizedString;
  tips?: LocalizedList;
  price?: LocalizedString;
  image?: string;
  coordinates?: Coordinates;
  address?: LocalizedString;
  grabQuery?: string;
}

export interface CitySection {
  title: LocalizedString;
  items: ContentItem[];
}

export interface CityContent {
  id: string;
  slug: string;
  countryId: string;
  name: LocalizedString;
  tagline: LocalizedString;
  heroImage: string;
  overview: LocalizedString;
  bestTime: LocalizedString;
  currency: LocalizedString;
  language: LocalizedString;
  timezone: LocalizedString;
  coordinates?: Coordinates;
  mapMarkers?: MapMarker[];
  checklist?: ChecklistItem[];
  timezoneOffset?: number;
  airport: CitySection;
  districts: CitySection;
  sights: CitySection;
  beaches: CitySection;
  food: CitySection;
  markets: CitySection;
  tours: CitySection;
  transport: CitySection;
  simAndInternet: CitySection;
  money: CitySection;
  safety: CitySection;
  phrases: CitySection;
  lifehacks: CitySection;
  scams: CitySection;
  aiKnowledgeBase: string;
}

export interface CountryMeta {
  id: string;
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  heroImage: string;
  flag: string;
  cities: string[];
}

export type CityTab =
  | "overview"
  | "sights"
  | "food"
  | "transport"
  | "lifehacks"
  | "map"
  | "chat"
  | "download";
