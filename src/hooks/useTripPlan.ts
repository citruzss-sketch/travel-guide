"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addTripPlanItem,
  getTripPlan,
  removeTripPlanItem,
  setTripPlanItemDay,
  TRIP_PLAN_CHANGED_EVENT,
  TRIP_PLAN_STORAGE_KEY,
  type TripPlanItem,
} from "@/lib/trip-plan";

export function useTripPlan(citySlug?: string) {
  const [items, setItems] = useState<TripPlanItem[]>([]);

  const refresh = useCallback(() => {
    setItems(getTripPlan(citySlug));
  }, [citySlug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === TRIP_PLAN_STORAGE_KEY) refresh();
    };
    const onChanged = () => refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener(TRIP_PLAN_CHANGED_EVENT, onChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(TRIP_PLAN_CHANGED_EVENT, onChanged);
    };
  }, [refresh]);

  const add = useCallback(
    (item: Omit<TripPlanItem, "id" | "createdAt" | "day"> & { day?: number }) => {
      const entry = addTripPlanItem(item);
      refresh();
      return entry;
    },
    [refresh]
  );

  const remove = useCallback(
    (id: string) => {
      removeTripPlanItem(id);
      refresh();
    },
    [refresh]
  );

  const setDay = useCallback(
    (id: string, day: number) => {
      setTripPlanItemDay(id, day);
      refresh();
    },
    [refresh]
  );

  const hasItem = useCallback(
    (sectionId: string, itemIndex: number) =>
      items.some(
        (i) =>
          i.citySlug === citySlug &&
          i.sectionId === sectionId &&
          i.itemIndex === itemIndex
      ),
    [items, citySlug]
  );

  return { items, count: items.length, add, remove, setDay, hasItem, refresh };
}
