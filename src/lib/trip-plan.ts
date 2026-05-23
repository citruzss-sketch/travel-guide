export interface TripPlanItem {
  id: string;
  countrySlug: string;
  citySlug: string;
  title: string;
  sectionId: string;
  sectionTitle?: string;
  itemIndex: number;
  day: number;
  createdAt: number;
}

export const TRIP_PLAN_STORAGE_KEY = "travel-guide-trip-plan";
export const TRIP_PLAN_CHANGED_EVENT = "travel-guide-trip-plan-changed";

function readAll(): TripPlanItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TRIP_PLAN_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TripPlanItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items: TripPlanItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TRIP_PLAN_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(TRIP_PLAN_CHANGED_EVENT));
}

export function getTripPlan(citySlug?: string): TripPlanItem[] {
  const items = readAll().sort((a, b) => a.day - b.day || b.createdAt - a.createdAt);
  return citySlug ? items.filter((i) => i.citySlug === citySlug) : items;
}

export function addTripPlanItem(
  item: Omit<TripPlanItem, "id" | "createdAt" | "day"> & { day?: number }
): TripPlanItem {
  const items = readAll();
  const duplicate = items.find(
    (i) =>
      i.citySlug === item.citySlug &&
      i.sectionId === item.sectionId &&
      i.itemIndex === item.itemIndex
  );
  if (duplicate) return duplicate;

  const cityItems = items.filter((i) => i.citySlug === item.citySlug);
  const maxDay = cityItems.reduce((m, i) => Math.max(m, i.day), 0);
  const entry: TripPlanItem = {
    ...item,
    day: item.day ?? Math.min(maxDay + 1 || 1, 7),
    id: `trip-${item.citySlug}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
  };
  writeAll([entry, ...items]);
  return entry;
}

export function removeTripPlanItem(id: string): void {
  writeAll(readAll().filter((i) => i.id !== id));
}

export function setTripPlanItemDay(id: string, day: number): void {
  writeAll(
    readAll().map((i) => (i.id === id ? { ...i, day: Math.min(7, Math.max(1, day)) } : i))
  );
}

export function isInTripPlan(
  citySlug: string,
  sectionId: string,
  itemIndex: number
): boolean {
  return readAll().some(
    (i) =>
      i.citySlug === citySlug &&
      i.sectionId === sectionId &&
      i.itemIndex === itemIndex
  );
}
