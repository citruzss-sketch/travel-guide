"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Bot, Heart, CalendarPlus, Check } from "lucide-react";
import type { CitySection, Locale } from "@/types/content";
import { useT } from "@/components/providers/LocaleProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { useFavorites } from "@/hooks/useFavorites";
import { useTripPlan } from "@/hooks/useTripPlan";
import { findContentFavorite } from "@/lib/favorites";
import { QuickActions } from "./QuickActions";
import { SafeImage } from "@/components/ui/SafeImage";
import { getItemImage } from "@/lib/travel-images";
import { getCopilotPrompts } from "@/lib/place-copilot-prompts";

export interface AskAIPayload {
  title: string;
  sectionId?: string;
  sectionTitle?: string;
  description?: string;
  initialInput?: string;
}

interface SectionCardProps {
  section: CitySection;
  locale: Locale;
  countrySlug: string;
  citySlug: string;
  cityName: string;
  index?: number;
  sectionId?: string;
  onAskAI?: (payload: AskAIPayload) => void;
}

export function SectionCard({
  section,
  locale,
  countrySlug,
  citySlug,
  cityName,
  index = 0,
  sectionId,
  onAskAI,
}: SectionCardProps) {
  const t = useT();
  const title = section.title[locale];

  if (!section.items.length) return null;

  return (
    <motion.section
      id={sectionId}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-28 space-y-5"
    >
      <div className="flex items-end gap-3">
        <h3 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
          <span className="text-gradient">{title}</span>
        </h3>
        <div className="mb-1.5 h-px flex-1 bg-gradient-to-r from-accent/60 to-transparent" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {section.items.map((item, i) => {
          const imageSrc = getItemImage(citySlug, item.title.en, sectionId);
          return (
            <motion.article
              key={`${item.title[locale]}-${i}`}
              id={sectionId ? `${sectionId}-item-${i}` : undefined}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="group overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-sm transition-shadow hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="card-media relative h-44 w-full">
                <SafeImage
                  src={imageSrc}
                  alt={item.title[locale]}
                  fill
                  className="block object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
              </div>
              <CardBody
                item={item}
                locale={locale}
                countrySlug={countrySlug}
                citySlug={citySlug}
                cityName={cityName}
                sectionId={sectionId}
                sectionTitle={title}
                itemIndex={i}
                onAskAI={onAskAI}
                t={t}
              />
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}

function CardBody({
  item,
  locale,
  countrySlug,
  citySlug,
  cityName,
  sectionId,
  sectionTitle,
  itemIndex,
  onAskAI,
  t,
}: {
  item: CitySection["items"][number];
  locale: Locale;
  countrySlug: string;
  citySlug: string;
  cityName: string;
  sectionId?: string;
  sectionTitle?: string;
  itemIndex: number;
  onAskAI?: (payload: AskAIPayload) => void;
  t: (key: string, params?: Record<string, string>) => string;
}) {
  const { toast } = useToast();
  const { add, remove } = useFavorites();
  const { add: addToPlan, hasItem } = useTripPlan(citySlug);
  const [saved, setSaved] = useState(false);
  const [inPlan, setInPlan] = useState(false);

  useEffect(() => {
    if (!sectionId) return;
    setSaved(!!findContentFavorite(citySlug, sectionId, itemIndex));
    setInPlan(hasItem(sectionId, itemIndex));
  }, [citySlug, sectionId, itemIndex, hasItem]);

  const title = item.title[locale];
  const copilotPrompts = getCopilotPrompts(locale, cityName, title, sectionId);

  const toggleFavorite = () => {
    if (!sectionId) return;
    const existing = findContentFavorite(citySlug, sectionId, itemIndex);
    if (existing) {
      remove(existing.id);
      setSaved(false);
      toast(t("favorites.removed"));
      return;
    }
    add({
      type: "content",
      countrySlug,
      citySlug,
      title,
      subtitle: sectionTitle,
      body: item.description[locale],
      tab: sectionId,
      sectionKey: sectionId,
      itemIndex,
    });
    setSaved(true);
    toast(t("favorites.added"));
  };

  const togglePlan = () => {
    if (!sectionId || inPlan) return;
    addToPlan({
      countrySlug,
      citySlug,
      title,
      sectionId,
      sectionTitle,
      itemIndex,
    });
    setInPlan(true);
    toast(t("tripPlan.added"));
  };

  return (
    <div className="relative z-10 -mt-px bg-surface p-5">
      <h4 className="font-display text-base font-bold text-foreground">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-muted">{item.description[locale]}</p>
      {item.price?.[locale] && (
        <p className="mt-2 text-sm font-semibold text-accent">{item.price[locale]}</p>
      )}
      {item.tips?.[locale] && item.tips[locale].length > 0 && (
        <div className="mt-3 space-y-1.5">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
            <Lightbulb className="h-3.5 w-3.5" />
            {t("city.tips")}
          </p>
          <ul className="space-y-1">
            {item.tips[locale].map((tip, tipIndex) => (
              <li key={tipIndex} className="text-sm text-muted before:mr-2 before:content-['•']">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
      <QuickActions
        item={item}
        locale={locale}
        cityName={cityName}
        countrySlug={countrySlug}
        citySlug={citySlug}
        sectionId={sectionId}
        itemIndex={itemIndex}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={toggleFavorite}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
            saved
              ? "border-accent/40 bg-accent/15 text-accent"
              : "border-border text-muted hover:border-accent/30 hover:text-accent"
          }`}
        >
          {saved ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Heart className="h-3.5 w-3.5" />
          )}
          {saved ? t("favorites.saved") : t("favorites.save")}
        </button>
        <button
          type="button"
          onClick={togglePlan}
          disabled={inPlan}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
            inPlan
              ? "border-accent/40 bg-accent/10 text-accent"
              : "border-border text-muted hover:border-accent/30 hover:text-accent"
          } disabled:opacity-70`}
        >
          {inPlan ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <CalendarPlus className="h-3.5 w-3.5" />
          )}
          {inPlan ? t("tripPlan.inPlan") : t("tripPlan.add")}
        </button>
      </div>
      {onAskAI && copilotPrompts.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-accent">
            <Bot className="h-3.5 w-3.5" />
            {t("copilot.label")}
          </p>
          <div className="flex flex-col gap-1.5">
            {copilotPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() =>
                  onAskAI({
                    title,
                    sectionId,
                    sectionTitle,
                    description: item.description[locale],
                    initialInput: prompt,
                  })
                }
                className="rounded-xl border border-border bg-background/60 px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-accent/5"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
      {onAskAI && (
        <button
          type="button"
          onClick={() =>
            onAskAI({
              title: item.title[locale],
              sectionId,
              sectionTitle,
              description: item.description[locale],
            })
          }
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-bold text-accent transition-colors hover:bg-accent/20"
        >
          <Bot className="h-3.5 w-3.5" />
          {t("chat.askAboutPlace")}
        </button>
      )}
    </div>
  );
}
