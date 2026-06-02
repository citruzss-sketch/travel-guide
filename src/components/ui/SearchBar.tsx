"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Globe } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useT } from "@/components/providers/LocaleProvider";
import type { SearchResult } from "@/lib/content";

export function SearchBar() {
  const { locale } = useLocale();
  const t = useT();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  const getHref = (r: SearchResult) => {
    if (r.type === "country") return `/${locale}/${r.countrySlug}`;
    return `/${locale}/${r.countrySlug}/${r.citySlug}`;
  };

  const getName = (r: SearchResult) =>
    locale === "ru" ? r.nameRu : r.nameEn;

  return (
    <div ref={ref} className="relative w-full">
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
          placeholder={t("nav.search")}
          className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <AnimatePresence>
        {open && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-surface shadow-xl"
          >
            {loading ? (
              <p className="px-4 py-3 text-sm text-muted">{t("chat.thinking")}</p>
            ) : results.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted">
                {t("nav.searchNoResults")}
              </p>
            ) : (
              <ul className="max-h-72 overflow-y-auto py-1">
                {results.map((r) => (
                  <li key={`${r.type}-${r.countrySlug}-${r.citySlug ?? ""}`}>
                    <Link
                      href={getHref(r)}
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-surface-hover"
                    >
                      {r.type === "country" ? (
                        <Globe className="h-4 w-4 shrink-0 text-accent" />
                      ) : (
                        <MapPin className="h-4 w-4 shrink-0 text-accent" />
                      )}
                      <span className="text-sm font-medium">{getName(r)}</span>
                      <span className="ml-auto text-xs uppercase text-muted">
                        {r.type === "country" ? r.countrySlug : r.citySlug}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
