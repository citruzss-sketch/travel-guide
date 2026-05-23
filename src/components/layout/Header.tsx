"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, Heart } from "lucide-react";
import { useLocale, useT } from "@/components/providers/LocaleProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LocaleToggle } from "@/components/ui/LocaleToggle";
import { SearchBar } from "@/components/ui/SearchBar";
import { FavoritesDrawer } from "@/components/favorites/FavoritesDrawer";
import { useFavorites } from "@/hooks/useFavorites";

export function Header() {
  const { locale } = useLocale();
  const t = useT();
  const { count } = useFavorites();
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            href={`/${locale}`}
            className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-display text-lg font-black tracking-tight sm:block">
              {t("app.name")}
            </span>
          </Link>

          <div className="hidden flex-1 md:block">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFavoritesOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent"
              aria-label={t("favorites.title")}
            >
              <Heart className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>
            <LocaleToggle />
            <ThemeToggle />
          </div>
        </div>

        <div className="border-t border-border/40 px-4 pb-3 pt-2 md:hidden">
          <SearchBar />
        </div>
      </header>

      <FavoritesDrawer
        open={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
      />
    </>
  );
}
