"use client";

import { useCallback, useState } from "react";
import {
  LayoutGrid,
  Landmark,
  UtensilsCrossed,
  Bus,
  Sparkles,
  MessageCircle,
  Download,
  Map,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CityContent, CityTab, Locale } from "@/types/content";
import { useT } from "@/components/providers/LocaleProvider";
import { OverviewPanel } from "./OverviewPanel";
import { LifehacksPanel } from "./LifehacksPanel";
import { SectionCard } from "./SectionCard";
import { AIChat } from "@/components/chat/AIChat";
import { DownloadGuide } from "./DownloadGuide";
import { CityMapDynamic } from "./CityMapDynamic";
import { BackToTop } from "@/components/ui/BackToTop";

const TABS: { id: CityTab; icon: typeof LayoutGrid }[] = [
  { id: "overview", icon: LayoutGrid },
  { id: "sights", icon: Landmark },
  { id: "food", icon: UtensilsCrossed },
  { id: "transport", icon: Bus },
  { id: "lifehacks", icon: Sparkles },
  { id: "map", icon: Map },
  { id: "chat", icon: MessageCircle },
  { id: "download", icon: Download },
];

interface CityTabsProps {
  city: CityContent;
  locale: Locale;
  countrySlug: string;
}

export function CityTabs({ city, locale, countrySlug }: CityTabsProps) {
  const t = useT();
  const [activeTab, setActiveTab] = useState<CityTab>("overview");

  const tabLabel = (id: CityTab) => t(`city.${id}`);

  const handleNavigate = useCallback((tab: CityTab, sectionId?: string) => {
    setActiveTab(tab);
    if (sectionId) {
      requestAnimationFrame(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  const cityName = city.name[locale];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <nav className="tab-scroll sticky top-[72px] z-40 -mx-4 overflow-x-auto border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:top-[65px]">
        <div className="flex min-w-max gap-1 py-3">
          {TABS.map(({ id, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-muted hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="city-tab-pill"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 h-4 w-4" />
                <span className="relative z-10">{tabLabel(id)}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <OverviewPanel
              key="overview"
              city={city}
              locale={locale}
              onNavigate={handleNavigate}
            />
          )}
          {activeTab === "sights" && (
            <motion.div
              key="sights"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              <SectionCard
                section={city.sights}
                locale={locale}
                cityName={cityName}
                sectionId="sights"
              />
              <SectionCard
                section={city.beaches}
                locale={locale}
                cityName={cityName}
                sectionId="beaches"
                index={1}
              />
              <SectionCard
                section={city.tours}
                locale={locale}
                cityName={cityName}
                sectionId="tours"
                index={2}
              />
            </motion.div>
          )}
          {activeTab === "food" && (
            <motion.div
              key="food"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              <SectionCard
                section={city.food}
                locale={locale}
                cityName={cityName}
                sectionId="food"
              />
              <SectionCard
                section={city.markets}
                locale={locale}
                cityName={cityName}
                sectionId="markets"
                index={1}
              />
            </motion.div>
          )}
          {activeTab === "transport" && (
            <motion.div
              key="transport"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              <SectionCard
                section={city.airport}
                locale={locale}
                cityName={cityName}
                sectionId="airport"
              />
              <SectionCard
                section={city.transport}
                locale={locale}
                cityName={cityName}
                sectionId="transport"
                index={1}
              />
            </motion.div>
          )}
          {activeTab === "lifehacks" && (
            <LifehacksPanel city={city} locale={locale} cityName={cityName} />
          )}
          {activeTab === "map" && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted">{t("map.hint")}</p>
              <CityMapDynamic city={city} locale={locale} />
            </motion.div>
          )}
          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <AIChat
                cityName={cityName}
                countrySlug={countrySlug}
                citySlug={city.slug}
                locale={locale}
              />
            </motion.div>
          )}
          {activeTab === "download" && (
            <motion.div
              key="download"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <DownloadGuide
                countrySlug={countrySlug}
                citySlug={city.slug}
                cityName={cityName}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BackToTop />
    </div>
  );
}
