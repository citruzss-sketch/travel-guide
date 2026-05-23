"use client";

import { motion } from "framer-motion";
import type { CityContent, Locale } from "@/types/content";
import { SectionCard, type AskAIPayload } from "./SectionCard";
import { SOSPanel } from "./SOSPanel";

interface LifehacksPanelProps {
  city: CityContent;
  locale: Locale;
  countrySlug: string;
  cityName: string;
  onAskAI?: (payload: AskAIPayload) => void;
  onSOS?: (scenarioId: string) => void;
}

export function LifehacksPanel({
  city,
  locale,
  countrySlug,
  cityName,
  onAskAI,
  onSOS,
}: LifehacksPanelProps) {
  const common = {
    locale,
    countrySlug,
    citySlug: city.slug,
    cityName,
    onAskAI,
  };

  return (
    <motion.div
      key="lifehacks"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-10"
    >
      {onSOS && <SOSPanel cityName={cityName} onScenario={onSOS} />}
      <SectionCard section={city.lifehacks} {...common} sectionId="lifehacks" index={0} />
      <SectionCard section={city.scams} {...common} sectionId="scams" index={1} />
      <SectionCard section={city.phrases} {...common} sectionId="phrases" index={2} />
      <SectionCard section={city.safety} {...common} sectionId="safety" index={3} />
      <SectionCard section={city.simAndInternet} {...common} sectionId="simAndInternet" index={4} />
      <SectionCard section={city.money} {...common} sectionId="money" index={5} />
    </motion.div>
  );
}
