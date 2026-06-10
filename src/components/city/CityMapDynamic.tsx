"use client";

import dynamic from "next/dynamic";
import type { CityContent, Locale } from "@/types/content";
import { Skeleton } from "@/components/ui/Skeleton";
import { useT } from "@/components/providers/LocaleProvider";

function MapSkeleton() {
  const t = useT();
  return (
    <div className="relative h-[min(60vh,480px)] overflow-hidden rounded-2xl border border-border bg-surface">
      <Skeleton className="h-full w-full rounded-2xl" />
      {/* Decorative pulse dots mimicking map pins */}
      <div className="absolute left-1/3 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-accent/40" />
      <div className="absolute left-1/2 top-1/3 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-accent/30" />
      <div className="absolute left-2/3 top-2/3 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-accent/40" />
      {/* Loading pill */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-surface/90 px-4 py-2 shadow-sm backdrop-blur-sm">
        <div className="h-3 w-3 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="text-xs font-medium text-muted">{t("map.loading")}</span>
      </div>
    </div>
  );
}

const CityMap = dynamic(() => import("./CityMap"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

interface CityMapDynamicProps {
  city: CityContent;
  locale: Locale;
}

export function CityMapDynamic({ city, locale }: CityMapDynamicProps) {
  return <CityMap city={city} locale={locale} />;
}
