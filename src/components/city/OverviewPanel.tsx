"use client";

import { motion } from "framer-motion";
import type { CityContent, CityTab, Locale } from "@/types/content";
import { SectionCard } from "./SectionCard";
import { TripChecklist } from "./TripChecklist";
import { CityContentSearch } from "./CityContentSearch";

interface OverviewPanelProps {
  city: CityContent;
  locale: Locale;
  onNavigate: (tab: CityTab, sectionId?: string) => void;
}

export function OverviewPanel({ city, locale, onNavigate }: OverviewPanelProps) {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <CityContentSearch city={city} locale={locale} onNavigate={onNavigate} />

      {city.checklist && city.checklist.length > 0 && (
        <TripChecklist
          citySlug={city.slug}
          items={city.checklist}
          locale={locale}
        />
      )}

      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-base leading-relaxed text-foreground sm:text-lg">
          {city.overview[locale]}
        </p>
      </div>
      <SectionCard
        section={city.districts}
        locale={locale}
        cityName={city.name[locale]}
        sectionId="districts"
        index={0}
      />
      <SectionCard
        section={city.airport}
        locale={locale}
        cityName={city.name[locale]}
        sectionId="airport"
        index={1}
      />
    </motion.div>
  );
}
