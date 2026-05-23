"use client";

import {
  MessageCircle,
  CalendarDays,
  UtensilsCrossed,
  Bus,
  Shield,
  Siren,
  type LucideIcon,
} from "lucide-react";
import type { AIMode } from "@/lib/ai-modes";
import { useT } from "@/components/providers/LocaleProvider";

const MODE_ICONS: Record<AIMode, LucideIcon> = {
  guide: MessageCircle,
  plan: CalendarDays,
  food: UtensilsCrossed,
  logistics: Bus,
  safety: Shield,
  sos: Siren,
};

const MODES: AIMode[] = ["guide", "plan", "food", "logistics", "safety", "sos"];

interface AIModeSelectorProps {
  value: AIMode;
  onChange: (mode: AIMode) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function AIModeSelector({ value, onChange, disabled, compact }: AIModeSelectorProps) {
  const t = useT();

  if (compact) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted">
          {t("chat.modes.label")}
        </p>
        <div className="mode-scroll flex gap-2 overflow-x-auto pb-1">
          {MODES.map((mode) => {
            const Icon = MODE_ICONS[mode];
            const active = value === mode;
            return (
              <button
                key={mode}
                type="button"
                disabled={disabled}
                onClick={() => onChange(mode)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-bold transition-all disabled:opacity-50 ${
                  active
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border bg-background text-muted hover:border-accent/30"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t(`chat.modes.${mode}.title`)}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-wider text-muted">
        {t("chat.modes.label")}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {MODES.map((mode) => {
          const Icon = MODE_ICONS[mode];
          const active = value === mode;
          return (
            <button
              key={mode}
              type="button"
              disabled={disabled}
              onClick={() => onChange(mode)}
              className={`flex flex-col items-start gap-1.5 rounded-xl border px-3 py-2.5 text-left transition-all disabled:opacity-50 ${
                active
                  ? "border-accent bg-accent/15 shadow-sm shadow-accent/10"
                  : "border-border bg-background hover:border-accent/30 hover:bg-surface-hover"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${active ? "text-accent" : "text-muted"}`}
              />
              <span
                className={`text-sm font-bold leading-tight ${active ? "text-foreground" : "text-foreground/90"}`}
              >
                {t(`chat.modes.${mode}.title`)}
              </span>
              <span className="text-[11px] leading-snug text-muted">
                {t(`chat.modes.${mode}.desc`)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
