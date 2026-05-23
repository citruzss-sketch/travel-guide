"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Coins, Globe2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { CityContent, Locale } from "@/types/content";
import { useT } from "@/components/providers/LocaleProvider";
import { CityLiveWidget } from "./CityLiveWidget";

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
    <section className="relative -mt-px overflow-hidden">
      <div className="relative h-[42vh] min-h-[280px] max-h-[480px] w-full sm:h-[48vh]">
        <Image
          src={city.heroImage}
          alt={city.name[locale]}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="-mt-24 sm:-mt-32"
        >
          <Link
            href={`/${locale}/${countrySlug}`}
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-sm font-medium text-muted backdrop-blur transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("nav.back")}
          </Link>

          <h1 className="font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {city.name[locale]}
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-muted">{city.tagline[locale]}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-xl border border-border bg-surface/90 p-4 backdrop-blur"
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
