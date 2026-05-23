"use client";

import dynamic from "next/dynamic";
import type { CityContent, Locale } from "@/types/content";

const CityMap = dynamic(() => import("./CityMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(60vh,480px)] items-center justify-center rounded-2xl border border-border bg-surface">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  ),
});

interface CityMapDynamicProps {
  city: CityContent;
  locale: Locale;
}

export function CityMapDynamic({ city, locale }: CityMapDynamicProps) {
  return <CityMap city={city} locale={locale} />;
}
