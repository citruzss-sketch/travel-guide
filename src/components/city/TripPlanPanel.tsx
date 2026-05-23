"use client";

import { CalendarDays, Sparkles, Trash2 } from "lucide-react";
import type { CityTab, Locale } from "@/types/content";
import { useTripPlan } from "@/hooks/useTripPlan";
import { useT } from "@/components/providers/LocaleProvider";
import type { TripPlanItem } from "@/lib/trip-plan";

interface TripPlanPanelProps {
  citySlug: string;
  locale: Locale;
  cityName: string;
  onNavigate: (tab: CityTab, sectionId?: string) => void;
  onBuildDay?: (day: number, items: TripPlanItem[]) => void;
}

const TAB_FOR_SECTION: Record<string, CityTab> = {
  districts: "overview",
  airport: "transport",
  transport: "transport",
  sights: "sights",
  beaches: "sights",
  tours: "sights",
  food: "food",
  markets: "food",
  lifehacks: "lifehacks",
  scams: "lifehacks",
  phrases: "lifehacks",
  safety: "lifehacks",
  simAndInternet: "lifehacks",
  money: "lifehacks",
};

export function TripPlanPanel({
  citySlug,
  onNavigate,
  onBuildDay,
}: TripPlanPanelProps) {
  const t = useT();
  const { items, remove, setDay } = useTripPlan(citySlug);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-5 text-center">
        <CalendarDays className="mx-auto h-8 w-8 text-muted" />
        <p className="mt-2 font-display text-sm font-bold">{t("tripPlan.title")}</p>
        <p className="mt-1 text-xs text-muted">{t("tripPlan.empty")}</p>
      </div>
    );
  }

  const byDay = items.reduce<Record<number, typeof items>>((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {});

  const days = Object.keys(byDay)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-accent" />
        <h3 className="font-display text-lg font-black">{t("tripPlan.title")}</h3>
        <span className="ml-auto rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent">
          {t("tripPlan.count", { count: String(items.length) })}
        </span>
      </div>
      <div className="mt-4 space-y-4">
        {days.map((day) => (
          <div key={day}>
            <div className="mb-2 flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-accent">
                {t("tripPlan.day", { day: String(day) })}
              </p>
              {onBuildDay && byDay[day].length > 0 && (
                <button
                  type="button"
                  onClick={() => onBuildDay(day, byDay[day])}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold text-accent transition-colors hover:bg-accent/20"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("tripPlan.buildDay")}
                </button>
              )}
            </div>
            <ul className="space-y-2">
              {byDay[day].map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2"
                >
                  <select
                    value={item.day}
                    onChange={(e) => setDay(item.id, Number(e.target.value))}
                    className="rounded-lg border border-border bg-surface px-2 py-1 text-xs font-semibold"
                    aria-label={t("tripPlan.daySelect")}
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate(
                        TAB_FOR_SECTION[item.sectionId] ?? "overview",
                        `${item.sectionId}-item-${item.itemIndex}`
                      )
                    }
                    className="min-w-0 flex-1 text-left text-sm font-semibold hover:text-accent"
                  >
                    {item.title}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="rounded-lg p-1.5 text-muted hover:text-red-500"
                    aria-label={t("tripPlan.remove")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
