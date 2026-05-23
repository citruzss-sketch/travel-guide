"use client";

import {
  Plane,
  Smartphone,
  Banknote,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import type { CityTab, Locale } from "@/types/content";
import { useT } from "@/components/providers/LocaleProvider";

interface FirstDayGuideProps {
  locale: Locale;
  cityName: string;
  onNavigate: (tab: CityTab, sectionId?: string) => void;
}

const STEPS = [
  { icon: Plane, tab: "transport" as CityTab, sectionId: "airport", key: "airport" },
  { icon: Smartphone, tab: "lifehacks" as CityTab, sectionId: "simAndInternet", key: "sim" },
  { icon: Banknote, tab: "lifehacks" as CityTab, sectionId: "money", key: "money" },
  { icon: ShieldAlert, tab: "lifehacks" as CityTab, sectionId: "scams", key: "safety" },
];

export function FirstDayGuide({ locale, cityName, onNavigate }: FirstDayGuideProps) {
  const t = useT();

  return (
    <div className="rounded-2xl border border-accent/25 bg-accent/5 p-5 sm:p-6">
      <h3 className="font-display text-lg font-black text-foreground">
        {t("firstDay.title", { city: cityName })}
      </h3>
      <p className="mt-1 text-sm text-muted">{t("firstDay.subtitle")}</p>
      <ol className="mt-4 space-y-2">
        {STEPS.map(({ icon: Icon, tab, sectionId, key }, index) => (
          <li key={key}>
            <button
              type="button"
              onClick={() => onNavigate(tab, sectionId)}
              className="flex w-full items-center gap-3 rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-left transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-sm font-black text-accent">
                {index + 1}
              </span>
              <Icon className="h-4 w-4 shrink-0 text-accent" />
              <span className="min-w-0 flex-1 text-sm font-semibold text-foreground">
                {t(`firstDay.steps.${key}`)}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
