"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Calendar,
  Map,
  MessageCircle,
  Sparkles,
} from "lucide-react";

interface CityCard {
  slug: string;
  name: string;
  tagline: string;
  bestTime: string;
  heroImage: string;
  placeCount: number;
  href: string;
  chatHref: string;
}

interface HomeCityShowcaseProps {
  title: string;
  subtitle: string;
  cities: CityCard[];
  placesLabel: string;
  openGuideLabel: string;
  aiChatLabel: string;
  mapLabel: string;
}

export function HomeCityShowcase({
  title,
  subtitle,
  cities,
  placesLabel,
  openGuideLabel,
  aiChatLabel,
  mapLabel,
}: HomeCityShowcaseProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-muted">{subtitle}</p>
        </motion.div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {cities.map((city, i) => (
          <motion.article
            key={city.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-sm"
          >
            <Link href={city.href} className="block">
              <div className="relative h-56 sm:h-64">
                <Image
                  src={city.heroImage}
                  alt={city.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-accent">
                    {city.placeCount} {placesLabel}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-black text-white sm:text-3xl">
                    {city.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-white/80">
                    {city.tagline}
                  </p>
                  <p className="mt-3 flex items-start gap-1.5 text-xs text-white/70">
                    <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span className="line-clamp-2">{city.bestTime}</span>
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex divide-x divide-border border-t border-border">
              <Link
                href={city.href}
                className="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors hover:bg-accent/10 hover:text-accent"
              >
                {openGuideLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={city.chatHref}
                className="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold text-muted transition-colors hover:bg-accent/10 hover:text-accent"
              >
                <MessageCircle className="h-4 w-4" />
                {aiChatLabel}
              </Link>
              <Link
                href={`${city.href}#map`}
                className="hidden flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold text-muted transition-colors hover:bg-accent/10 hover:text-accent sm:flex"
              >
                <Map className="h-4 w-4" />
                {mapLabel}
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

interface HomeAIPreviewProps {
  title: string;
  subtitle: string;
  prompts: { text: string; href: string }[];
}

export function HomeAIPreview({ title, subtitle, prompts }: HomeAIPreviewProps) {
  return (
    <section className="border-y border-border/60 bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/15">
            <Bot className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
              {title}
            </h2>
            <p className="mt-2 text-muted">{subtitle}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {prompts.map((prompt) => (
            <Link
              key={prompt.href + prompt.text}
              href={prompt.href}
              className="group inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium transition-all hover:border-accent/40 hover:bg-accent/5 hover:text-accent"
            >
              <Sparkles className="h-4 w-4 text-accent/70 group-hover:text-accent" />
              {prompt.text}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
