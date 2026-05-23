"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { CityContent, Locale } from "@/types/content";
import { useLocale, useT } from "@/components/providers/LocaleProvider";

interface CityCompareProps {
  cities: CityContent[];
  countrySlug: string;
}

function countSectionItems(city: CityContent): number {
  return (
    city.sights.items.length +
    city.beaches.items.length +
    city.food.items.length +
    city.markets.items.length
  );
}

export function CityCompare({ cities, countrySlug }: CityCompareProps) {
  const t = useT();
  const { locale } = useLocale();

  if (cities.length < 2) return null;

  const [a, b] = cities.slice(0, 2);
  const loc = locale as Locale;

  const rows: { key: string; a: string; b: string }[] = [
    {
      key: "tagline",
      a: a.tagline[loc],
      b: b.tagline[loc],
    },
    {
      key: "bestTime",
      a: a.bestTime[loc],
      b: b.bestTime[loc],
    },
    {
      key: "beaches",
      a: String(a.beaches.items.length),
      b: String(b.beaches.items.length),
    },
    {
      key: "sightsFood",
      a: String(countSectionItems(a)),
      b: String(countSectionItems(b)),
    },
    {
      key: "markers",
      a: String(a.mapMarkers?.length ?? 0),
      b: String(b.mapMarkers?.length ?? 0),
    },
    {
      key: "checklist",
      a: String(a.checklist?.length ?? 0),
      b: String(b.checklist?.length ?? 0),
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 rounded-2xl border border-border bg-surface p-5 sm:p-8"
    >
      <h2 className="font-display text-2xl font-black">{t("compare.title")}</h2>
      <p className="mt-2 text-sm text-muted">{t("compare.subtitle")}</p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 pr-4 font-semibold text-muted">
                {t("compare.criteria")}
              </th>
              <th className="pb-3 pr-4 font-display font-bold text-foreground">
                {a.name[loc]}
              </th>
              <th className="pb-3 font-display font-bold text-foreground">
                {b.name[loc]}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-border/60">
                <td className="py-3 pr-4 font-medium text-muted">
                  {t(`compare.row.${row.key}`)}
                </td>
                <td className="py-3 pr-4 text-foreground">{row.a}</td>
                <td className="py-3 text-foreground">{row.b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        {[a, b].map((city) => (
          <Link
            key={city.slug}
            href={`/${locale}/${countrySlug}/${city.slug}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-accent hover:underline"
          >
            {city.name[loc]}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
