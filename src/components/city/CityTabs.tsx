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
import { AIChat, type ChatLaunchConfig } from "@/components/chat/AIChat";
import { inferModeFromSection } from "@/lib/ai-modes";
import { buildTripDayPrompt } from "@/lib/build-day-prompt";
import { getSOSPrompt } from "@/lib/sos-scenarios";
import type { TripPlanItem } from "@/lib/trip-plan";
import { useTravelProfile } from "@/hooks/useTravelProfile";
import type { AskAIPayload } from "./SectionCard";
import { DownloadGuide } from "./DownloadGuide";
import { CityMapDynamic } from "./CityMapDynamic";
import { MobileCityNav } from "./MobileCityNav";
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
  const { profile } = useTravelProfile();
  const [activeTab, setActiveTab] = useState<CityTab>("overview");
  const [chatLaunch, setChatLaunch] = useState<ChatLaunchConfig | undefined>();
  const [chatLaunchKey, setChatLaunchKey] = useState(0);
  const [chatExpanded, setChatExpanded] = useState(false);

  const tabLabel = (id: CityTab) => t(`city.${id}`);

  const openChat = useCallback((config: ChatLaunchConfig) => {
    setChatLaunch(config);
    setChatLaunchKey((k) => k + 1);
    setActiveTab("chat");
  }, []);

  const handleAskAI = useCallback(
    (payload: AskAIPayload) => {
      openChat({
        mode: inferModeFromSection(payload.sectionId),
        placeContext: {
          title: payload.title,
          section: payload.sectionTitle ?? payload.sectionId,
          description: payload.description,
        },
        initialInput:
          payload.initialInput ?? t("chat.askPrompt", { place: payload.title }),
      });
    },
    [t, openChat]
  );

  const handleBuildDay = useCallback(
    (day: number, items: TripPlanItem[]) => {
      openChat({
        mode: "plan",
        initialInput: buildTripDayPrompt(locale, city.name[locale], day, items, profile),
        autoSend: true,
      });
    },
    [locale, city.name, profile, openChat]
  );

  const handleSOS = useCallback(
    (scenarioId: string) => {
      openChat({
        mode: "sos",
        initialInput: getSOSPrompt(scenarioId, locale, city.name[locale]),
        autoSend: true,
      });
    },
    [locale, city.name, openChat]
  );

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
    <div className="mx-auto max-w-6xl px-3 pb-24 sm:px-6 md:pb-16">
      <nav
        aria-label={cityName}
        className="tab-scroll sticky top-[72px] z-40 -mx-4 hidden overflow-x-auto border-b border-border/60 bg-background/75 px-4 backdrop-blur-xl sm:top-[65px] md:block"
      >
        <div role="tablist" className="flex min-w-max gap-1 py-3">
          {TABS.map(({ id, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                id={`tab-desktop-${id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${id}`}
                tabIndex={isActive ? 0 : -1}
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
                    className="absolute inset-0 rounded-full bg-accent shadow-md shadow-accent/30"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 h-4 w-4" aria-hidden="true" />
                <span className="relative z-10">{tabLabel(id)}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className={activeTab === "chat" ? "mt-3 md:mt-8" : "mt-8"}>
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              id="tabpanel-overview"
              role="tabpanel"
              aria-labelledby="tab-desktop-overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <OverviewPanel
                city={city}
                locale={locale}
                countrySlug={countrySlug}
                onNavigate={handleNavigate}
                onAskAI={handleAskAI}
                onBuildDay={handleBuildDay}
              />
            </motion.div>
          )}
          {activeTab === "sights" && (
            <motion.div
              key="sights"
              id="tabpanel-sights"
              role="tabpanel"
              aria-labelledby="tab-desktop-sights"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              <SectionCard
                section={city.sights}
                locale={locale}
                countrySlug={countrySlug}
                citySlug={city.slug}
                cityName={cityName}
                sectionId="sights"
                onAskAI={handleAskAI}
              />
              <SectionCard
                section={city.beaches}
                locale={locale}
                countrySlug={countrySlug}
                citySlug={city.slug}
                cityName={cityName}
                sectionId="beaches"
                index={1}
                onAskAI={handleAskAI}
              />
              <SectionCard
                section={city.tours}
                locale={locale}
                countrySlug={countrySlug}
                citySlug={city.slug}
                cityName={cityName}
                sectionId="tours"
                index={2}
                onAskAI={handleAskAI}
              />
            </motion.div>
          )}
          {activeTab === "food" && (
            <motion.div
              key="food"
              id="tabpanel-food"
              role="tabpanel"
              aria-labelledby="tab-desktop-food"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              <SectionCard
                section={city.food}
                locale={locale}
                countrySlug={countrySlug}
                citySlug={city.slug}
                cityName={cityName}
                sectionId="food"
                onAskAI={handleAskAI}
              />
              <SectionCard
                section={city.markets}
                locale={locale}
                countrySlug={countrySlug}
                citySlug={city.slug}
                cityName={cityName}
                sectionId="markets"
                index={1}
                onAskAI={handleAskAI}
              />
            </motion.div>
          )}
          {activeTab === "transport" && (
            <motion.div
              key="transport"
              id="tabpanel-transport"
              role="tabpanel"
              aria-labelledby="tab-desktop-transport"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              <SectionCard
                section={city.airport}
                locale={locale}
                countrySlug={countrySlug}
                citySlug={city.slug}
                cityName={cityName}
                sectionId="airport"
                onAskAI={handleAskAI}
              />
              <SectionCard
                section={city.transport}
                locale={locale}
                countrySlug={countrySlug}
                citySlug={city.slug}
                cityName={cityName}
                sectionId="transport"
                index={1}
                onAskAI={handleAskAI}
              />
            </motion.div>
          )}
          {activeTab === "lifehacks" && (
            <motion.div
              key="lifehacks"
              id="tabpanel-lifehacks"
              role="tabpanel"
              aria-labelledby="tab-desktop-lifehacks"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <LifehacksPanel
                city={city}
                locale={locale}
                countrySlug={countrySlug}
                cityName={cityName}
                onAskAI={handleAskAI}
                onSOS={handleSOS}
              />
            </motion.div>
          )}
          {activeTab === "map" && (
            <motion.div
              key="map"
              id="tabpanel-map"
              role="tabpanel"
              aria-labelledby="tab-desktop-map"
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
              id="tabpanel-chat"
              role="tabpanel"
              aria-labelledby="tab-desktop-chat"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <AIChat
                cityName={cityName}
                countrySlug={countrySlug}
                citySlug={city.slug}
                locale={locale}
                launchConfig={chatLaunch}
                launchKey={chatLaunchKey}
                onExpandChange={setChatExpanded}
              />
            </motion.div>
          )}
          {activeTab === "download" && (
            <motion.div
              key="download"
              id="tabpanel-download"
              role="tabpanel"
              aria-labelledby="tab-desktop-download"
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

      <BackToTop hidden={chatExpanded && activeTab === "chat"} />
      <MobileCityNav
        activeTab={activeTab}
        onChange={setActiveTab}
        hidden={chatExpanded && activeTab === "chat"}
      />
    </div>
  );
}
