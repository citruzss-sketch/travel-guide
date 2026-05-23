"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
  type FavoriteItem,
} from "@/lib/favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "travel-guide-favorites") refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const add = useCallback(
    (item: Omit<FavoriteItem, "id" | "createdAt">) => {
      const entry = addFavorite(item);
      refresh();
      return entry;
    },
    [refresh]
  );

  const remove = useCallback(
    (id: string) => {
      removeFavorite(id);
      refresh();
    },
    [refresh]
  );

  return {
    favorites,
    count: favorites.length,
    ready,
    add,
    remove,
    refresh,
  };
}
