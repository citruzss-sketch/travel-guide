"use client";

import { useState } from "react";
import { Copy, MapPin, Car, Check, Share2 } from "lucide-react";
import type { ContentItem, Locale } from "@/types/content";
import { useT } from "@/components/providers/LocaleProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { googleMapsUrlForPlace } from "@/lib/maps-links";

interface QuickActionsProps {
  item: ContentItem;
  locale: Locale;
  cityName: string;
  countrySlug: string;
  citySlug: string;
  sectionId?: string;
  itemIndex: number;
}

export function QuickActions({
  item,
  locale,
  cityName,
  countrySlug,
  citySlug,
  sectionId,
  itemIndex,
}: QuickActionsProps) {
  const t = useT();
  const { locale: appLocale } = useLocale();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const title = item.title[locale];
  const address = item.address?.[locale];
  const grabQuery = item.grabQuery ?? `${title} ${cityName}`;
  const mapsUrl = googleMapsUrlForPlace(item, cityName, locale);
  const grabUrl = `https://www.grab.com/vn/download/`;

  const anchor = sectionId ? `#${sectionId}-item-${itemIndex}` : "";
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${appLocale}/${countrySlug}/${citySlug}${anchor}`
      : "";

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

  const handleShare = async () => {
    const text = `${title} — ${cityName}`;
    try {
      if (navigator.share && shareUrl) {
        await navigator.share({ title, text, url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
      toast(t("quickActions.linkCopied"));
    } catch {
      /* user cancelled share */
    }
  };

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
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-accent/40 hover:text-foreground"
      >
        <Share2 className="h-3.5 w-3.5" />
        {t("quickActions.share")}
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
