"use client";

import {
  AlertTriangle,
  FileWarning,
  HeartPulse,
  Phone,
  Smartphone,
  Bike,
  ShieldAlert,
} from "lucide-react";
import { SOS_SCENARIOS } from "@/lib/sos-scenarios";
import { useT } from "@/components/providers/LocaleProvider";

const ICONS = {
  passport: FileWarning,
  hospital: HeartPulse,
  scam: AlertTriangle,
  sim: Smartphone,
  bike: Bike,
  police: ShieldAlert,
} as const;

interface SOSPanelProps {
  cityName: string;
  onScenario: (scenarioId: string) => void;
}

export function SOSPanel({ cityName, onScenario }: SOSPanelProps) {
  const t = useT();

  return (
    <div className="rounded-2xl border-2 border-red-500/40 bg-red-500/5 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15">
          <Phone className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <h3 className="font-display text-lg font-black text-foreground">
            {t("sos.title")}
          </h3>
          <p className="mt-1 text-sm text-muted">{t("sos.subtitle", { city: cityName })}</p>
          <p className="mt-2 text-xs font-semibold text-red-500/90">{t("sos.numbers")}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {SOS_SCENARIOS.map(({ id, icon }) => {
          const Icon = ICONS[icon];
          return (
            <button
              key={id}
              type="button"
              onClick={() => onScenario(id)}
              className="flex items-center gap-2.5 rounded-xl border border-red-500/25 bg-background/80 px-3 py-3 text-left text-sm font-semibold transition-colors hover:border-red-500/50 hover:bg-red-500/10"
            >
              <Icon className="h-4 w-4 shrink-0 text-red-500" />
              <span>{t(`sos.scenarios.${id}`)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SOSChatBar({
  onScenario,
}: {
  onScenario: (scenarioId: string) => void;
}) {
  const t = useT();

  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-red-500">
        {t("sos.quickLabel")}
      </p>
      <div className="flex flex-wrap gap-2">
        {SOS_SCENARIOS.map(({ id }) => (
          <button
            key={id}
            type="button"
            onClick={() => onScenario(id)}
            className="rounded-full border border-red-500/30 bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-red-500/10"
          >
            {t(`sos.scenarios.${id}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
