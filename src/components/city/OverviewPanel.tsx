"use client";

import { motion } from "framer-motion";
import type { CityContent, CityTab, Locale } from "@/types/content";
import { SectionCard, type AskAIPayload } from "./SectionCard";
import { TripChecklist } from "./TripChecklist";
import { CityContentSearch } from "./CityContentSearch";
import { FirstDayGuide } from "./FirstDayGuide";
import { TripPlanPanel } from "./TripPlanPanel";
import { TravelProfileBar } from "@/components/chat/TravelProfileBar";
import { useTravelProfile } from "@/hooks/useTravelProfile";
import { useT } from "@/components/providers/LocaleProvider";
import type { TripPlanItem } from "@/lib/trip-plan";

interface OverviewPanelProps {
  city: CityContent;
  locale: Locale;
  countrySlug: string;
  onNavigate: (tab: CityTab, sectionId?: string) => void;
  onAskAI?: (payload: AskAIPayload) => void;
  onBuildDay?: (day: number, items: TripPlanItem[]) => void;
}

export function OverviewPanel({
  city,
  locale,
  countrySlug,
  onNavigate,
  onAskAI,
  onBuildDay,
}: OverviewPanelProps) {
  const t = useT();
  const { profile, setProfile } = useTravelProfile();
  const cityName = city.name[locale];

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="rounded-2xl border border-border/80 bg-surface/80 p-4 sm:p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">
          {t("overview.profileHint")}
        </p>
        <TravelProfileBar value={profile} onChange={setProfile} />
      </div>

      <FirstDayGuide cityName={cityName} onNavigate={onNavigate} />

      <TripPlanPanel
        citySlug={city.slug}
        locale={locale}
        cityName={cityName}
        onNavigate={onNavigate}
        onBuildDay={onBuildDay}
      />

      <CityContentSearch city={city} locale={locale} onNavigate={onNavigate} />

      {city.checklist && city.checklist.length > 0 && (
        <TripChecklist citySlug={city.slug} items={city.checklist} locale={locale} />
      )}

      <div className="rounded-2xl border border-border/80 bg-surface/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <p className="text-base leading-relaxed text-foreground sm:text-lg">
          {city.overview[locale]}
        </p>
      </div>
      <SectionCard
        section={city.districts}
        locale={locale}
        countrySlug={countrySlug}
        citySlug={city.slug}
        cityName={cityName}
        sectionId="districts"
        index={0}
        onAskAI={onAskAI}
      />
      <SectionCard
        section={city.airport}
        locale={locale}
        countrySlug={countrySlug}
        citySlug={city.slug}
        cityName={cityName}
        sectionId="airport"
        index={1}
        onAskAI={onAskAI}
      />
    </motion.div>
  );
}
