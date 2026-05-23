"use client";

import { useState } from "react";
import { Copy, MapPin, Car, Check } from "lucide-react";
import type { ContentItem, Locale } from "@/types/content";
import { useT } from "@/components/providers/LocaleProvider";

interface QuickActionsProps {
  item: ContentItem;
  locale: Locale;
  cityName: string;
}

export function QuickActions({ item, locale, cityName }: QuickActionsProps) {
  const t = useT();
  const [copied, setCopied] = useState(false);

  const title = item.title[locale];
  const address = item.address?.[locale];
  const mapsQuery =
    item.coordinates != null
      ? `${item.coordinates.lat},${item.coordinates.lng}`
      : address ?? `${title}, ${cityName}, Vietnam`;
  const grabQuery = item.grabQuery ?? `${title} ${cityName}`;

  const copyText = [title, item.description[locale], address]
    .filter(Boolean)
    .join("\n\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;
  const grabUrl = `https://www.grab.com/vn/download/`;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-accent/40 hover:text-foreground"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        {copied ? t("quickActions.copied") : t("quickActions.copy")}
      </button>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-accent/40 hover:text-foreground"
      >
        <MapPin className="h-3.5 w-3.5" />
        {t("quickActions.maps")}
      </a>
      <a
        href={grabUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={grabQuery}
        className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/20"
      >
        <Car className="h-3.5 w-3.5" />
        {t("quickActions.grab")}
      </a>
    </div>
  );
}
