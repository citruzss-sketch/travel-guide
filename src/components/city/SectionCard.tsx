"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import type { CitySection, Locale } from "@/types/content";
import { useT } from "@/components/providers/LocaleProvider";
import { QuickActions } from "./QuickActions";

interface SectionCardProps {
  section: CitySection;
  locale: Locale;
  cityName: string;
  index?: number;
  sectionId?: string;
}

export function SectionCard({
  section,
  locale,
  cityName,
  index = 0,
  sectionId,
}: SectionCardProps) {
  const t = useT();
  const title = section.title[locale];

  if (!section.items.length) return null;

  return (
    <motion.section
      id={sectionId}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="scroll-mt-28 space-y-4"
    >
      <h3 className="font-display text-xl font-black tracking-tight text-foreground">
        {title}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {section.items.map((item, i) => (
          <article
            key={`${item.title[locale]}-${i}`}
            id={sectionId ? `${sectionId}-item-${i}` : undefined}
            className="overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/30"
          >
            {item.image && (
              <div className="relative h-40 w-full">
                <Image
                  src={item.image}
                  alt={item.title[locale]}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
            )}
            <div className="p-5">
            <h4 className="font-display text-base font-bold text-foreground">
              {item.title[locale]}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {item.description[locale]}
            </p>
            {item.price?.[locale] && (
              <p className="mt-2 text-sm font-semibold text-accent">
                {item.price[locale]}
              </p>
            )}
            {item.tips?.[locale] && item.tips[locale].length > 0 && (
              <div className="mt-3 space-y-1.5">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
                  <Lightbulb className="h-3.5 w-3.5" />
                  {t("city.tips")}
                </p>
                <ul className="space-y-1">
                  {item.tips[locale].map((tip, tipIndex) => (
                    <li
                      key={tipIndex}
                      className="text-sm text-muted before:mr-2 before:content-['•']"
                    >
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <QuickActions item={item} locale={locale} cityName={cityName} />
            </div>
          </article>
        ))}
      </div>
    </motion.section>
  );
}
