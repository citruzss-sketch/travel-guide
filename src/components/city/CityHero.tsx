"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Coins, Globe2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { CityContent, Locale } from "@/types/content";
import { useT } from "@/components/providers/LocaleProvider";
import { CityLiveWidget } from "./CityLiveWidget";
import { SafeImage } from "@/components/ui/SafeImage";

interface CityHeroProps {
  city: CityContent;
  locale: Locale;
  countrySlug: string;
}

export function CityHero({ city, locale, countrySlug }: CityHeroProps) {
  const t = useT();

  const facts = [
    { icon: Calendar, label: t("city.bestTime"), value: city.bestTime[locale] },
    { icon: Coins, label: t("city.currency"), value: city.currency[locale] },
    { icon: Globe2, label: t("city.language"), value: city.language[locale] },
    { icon: Clock, label: t("city.timezone"), value: city.timezone[locale] },
  ];

  return (
    <section className="relative -mt-px">
      <div className="relative h-[44vh] min-h-[300px] max-h-[520px] w-full sm:h-[50vh]">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <SafeImage
              src={city.heroImage}
              alt=""
              fill
              priority
              className="scale-[1.04] object-cover object-center"
              sizes="100vw"
            />
          </motion.div>
        </div>
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-background via-background/55 to-background/10" />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2]"
          style={{ height: 8, background: "var(--background)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="-mt-28 sm:-mt-36"
        >
          <Link
            href={`/${locale}/${countrySlug}`}
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-sm font-medium text-muted backdrop-blur transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("nav.back")}
          </Link>

          <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-gradient">{city.name[locale]}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-muted">{city.tagline[locale]}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="card-shine rounded-xl border border-border/80 bg-surface/80 p-4 shadow-sm backdrop-blur-md transition-all hover:border-accent/30 hover:shadow-md hover:shadow-accent/5"
              >
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </div>
                <p className="mt-1.5 text-sm leading-snug text-foreground">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <CityLiveWidget city={city} locale={locale} />
        </motion.div>
      </div>
    </section>
  );
}
