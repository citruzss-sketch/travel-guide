"use client";

import {
  LayoutGrid,
  Landmark,
  UtensilsCrossed,
  Map,
  MessageCircle,
} from "lucide-react";
import type { CityTab } from "@/types/content";
import { useT } from "@/components/providers/LocaleProvider";

const MOBILE_TABS: { id: CityTab; icon: typeof LayoutGrid }[] = [
  { id: "overview", icon: LayoutGrid },
  { id: "sights", icon: Landmark },
  { id: "food", icon: UtensilsCrossed },
  { id: "map", icon: Map },
  { id: "chat", icon: MessageCircle },
];

interface MobileCityNavProps {
  activeTab: CityTab;
  onChange: (tab: CityTab) => void;
  hidden?: boolean;
}

export function MobileCityNav({ activeTab, onChange, hidden }: MobileCityNavProps) {
  const t = useT();

  if (hidden) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">
      <div role="tablist" className="mx-auto flex max-w-lg items-stretch justify-around gap-1">
        {MOBILE_TABS.map(({ id, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`city-panel-${id}`}
              id={`city-mobile-tab-${id}`}
              onClick={() => onChange(id)}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-bold transition-colors ${
                active ? "text-accent" : "text-muted"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                  active ? "bg-accent/15" : ""
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="truncate">{t(`city.${id}`)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
