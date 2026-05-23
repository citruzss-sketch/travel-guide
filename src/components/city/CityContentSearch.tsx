"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CityContent, CityTab, Locale } from "@/types/content";
import { searchCityContent } from "@/lib/city-search";
import { useT } from "@/components/providers/LocaleProvider";

interface CityContentSearchProps {
  city: CityContent;
  locale: Locale;
  onNavigate: (tab: CityTab, sectionId?: string) => void;
}

export function CityContentSearch({
  city,
  locale,
  onNavigate,
}: CityContentSearchProps) {
  const t = useT();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(
    () => searchCityContent(city, query, locale),
    [city, query, locale]
  );

  const handleSelect = (tab: CityTab, sectionKey: string, itemIndex: number, hitId: string) => {
    const scrollId =
      hitId === "overview" ? undefined : `${sectionKey}-item-${itemIndex}`;
    onNavigate(tab, scrollId);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("search.cityPlaceholder", { city: city.name[locale] })}
          className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-10 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            aria-label={t("search.clear")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && query.length >= 2 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-border bg-surface shadow-xl"
          >
            {results.length === 0 ? (
              <li className="px-4 py-3 text-sm text-muted">
                {t("search.noResults")}
              </li>
            ) : (
              results.map((hit) => (
                <li key={hit.id}>
                  <button
                    type="button"
                    onClick={() =>
                      handleSelect(hit.tab, hit.sectionKey, hit.itemIndex, hit.id)
                    }
                    className="w-full px-4 py-3 text-left transition-colors hover:bg-surface-hover"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {hit.title}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                      {hit.sectionTitle} · {hit.snippet}
                    </p>
                  </button>
                </li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
