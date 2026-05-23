"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
  FAVORITES_CHANGED_EVENT,
  FAVORITES_STORAGE_KEY,
  type FavoriteItem,
  type FavoritesChangeDetail,
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
      if (e.key === FAVORITES_STORAGE_KEY) refresh();
    };

    const onChanged = () => refresh();

    window.addEventListener("storage", onStorage);
    window.addEventListener(FAVORITES_CHANGED_EVENT, onChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(FAVORITES_CHANGED_EVENT, onChanged);
    };
  }, [refresh]);

  const add = useCallback(
    (
      item: Omit<FavoriteItem, "id" | "createdAt">,
      options?: FavoritesChangeDetail
    ) => {
      const entry = addFavorite(item, options);
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
