"use client";

import { motion } from "framer-motion";
import type { CityContent, Locale } from "@/types/content";
import { SectionCard } from "./SectionCard";

interface LifehacksPanelProps {
  city: CityContent;
  locale: Locale;
  cityName: string;
}

export function LifehacksPanel({ city, locale, cityName }: LifehacksPanelProps) {
  return (
    <motion.div
      key="lifehacks"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-10"
    >
      <SectionCard section={city.lifehacks} locale={locale} cityName={cityName} index={0} />
      <SectionCard section={city.scams} locale={locale} cityName={cityName} index={1} />
      <SectionCard section={city.phrases} locale={locale} cityName={cityName} index={2} />
      <SectionCard section={city.safety} locale={locale} cityName={cityName} index={3} />
      <SectionCard section={city.simAndInternet} locale={locale} cityName={cityName} index={4} />
      <SectionCard section={city.money} locale={locale} cityName={cityName} index={5} />
    </motion.div>
  );
}
