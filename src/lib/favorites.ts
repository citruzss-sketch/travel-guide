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

export const FAVORITES_STORAGE_KEY = "travel-guide-favorites";
export const FAVORITES_CHANGED_EVENT = "travel-guide-favorites-changed";

export type FavoritesChangeDetail = {
  openDrawer?: boolean;
};

const STORAGE_KEY = FAVORITES_STORAGE_KEY;

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

export function notifyFavoritesChanged(detail?: FavoritesChangeDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<FavoritesChangeDetail>(FAVORITES_CHANGED_EVENT, { detail })
  );
}

function writeAll(items: FavoriteItem[], options?: FavoritesChangeDetail): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  notifyFavoritesChanged(options);
}

export function getFavorites(): FavoriteItem[] {
  return readAll().sort((a, b) => b.createdAt - a.createdAt);
}

export function addFavorite(
  item: Omit<FavoriteItem, "id" | "createdAt">,
  options?: FavoritesChangeDetail
): FavoriteItem {
  const favorites = readAll();
  const entry: FavoriteItem = {
    ...item,
    id: `${item.type}-${item.citySlug}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  };
  writeAll([entry, ...favorites], options);
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

export function findContentFavorite(
  citySlug: string,
  sectionKey: string,
  itemIndex: number
): FavoriteItem | undefined {
  return readAll().find(
    (f) =>
      f.type === "content" &&
      f.citySlug === citySlug &&
      f.sectionKey === sectionKey &&
      f.itemIndex === itemIndex
  );
}
