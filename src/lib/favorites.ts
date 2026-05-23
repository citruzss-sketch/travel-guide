export interface FavoriteItem {
  id: string;
  type: "content" | "chat";
  countrySlug: string;
  citySlug: string;
  title: string;
  subtitle?: string;
  body?: string;
  tab?: string;
  sectionKey?: string;
  itemIndex?: number;
  createdAt: number;
}

const STORAGE_KEY = "travel-guide-favorites";

function readAll(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoriteItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items: FavoriteItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getFavorites(): FavoriteItem[] {
  return readAll().sort((a, b) => b.createdAt - a.createdAt);
}

export function addFavorite(item: Omit<FavoriteItem, "id" | "createdAt">): FavoriteItem {
  const favorites = readAll();
  const entry: FavoriteItem = {
    ...item,
    id: `${item.type}-${item.citySlug}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  };
  writeAll([entry, ...favorites]);
  return entry;
}

export function removeFavorite(id: string): void {
  writeAll(readAll().filter((f) => f.id !== id));
}

export function isFavorite(id: string): boolean {
  return readAll().some((f) => f.id === id);
}

export function findFavoriteByContent(
  citySlug: string,
  title: string
): FavoriteItem | undefined {
  return readAll().find(
    (f) => f.citySlug === citySlug && f.type === "content" && f.title === title
  );
}
