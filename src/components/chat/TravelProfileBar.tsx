"use client";

import { Users, Heart, Wallet, Mountain } from "lucide-react";
import type { TravelProfile } from "@/lib/ai-modes";
import { useT } from "@/components/providers/LocaleProvider";

const PROFILES: { id: TravelProfile; icon?: typeof Users }[] = [
  { id: "any", icon: Users },
  { id: "family", icon: Users },
  { id: "couple", icon: Heart },
  { id: "budget", icon: Wallet },
  { id: "active", icon: Mountain },
];

interface TravelProfileBarProps {
  value: TravelProfile;
  onChange: (profile: TravelProfile) => void;
  disabled?: boolean;
}

export function TravelProfileBar({
  value,
  onChange,
  disabled,
}: TravelProfileBarProps) {
  const t = useT();

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-wider text-muted">
        {t("chat.profile.label")}
      </p>
      <div className="flex flex-wrap gap-2">
        {PROFILES.map(({ id, icon: Icon }) => {
          const active = value === id;
          return (
            <button
              key={id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                active
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-background text-muted hover:border-accent/40 hover:text-foreground"
              }`}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {t(`chat.profile.${id}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
