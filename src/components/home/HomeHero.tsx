"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, FileDown, MapPin, Sparkles } from "lucide-react";

interface Stat {
  icon: "cities" | "ai" | "pdf" | "places";
  value: string;
  label: string;
}

interface CityLink {
  name: string;
  href: string;
}

interface HomeHeroProps {
  heroImage: string;
  badge: string;
  title: string;
  subtitle: string;
  exploreLabel: string;
  exploreHref: string;
  quickPickLabel: string;
  stats: Stat[];
  cityLinks: CityLink[];
}

const STAT_ICONS = {
  cities: MapPin,
  ai: Bot,
  pdf: FileDown,
  places: Sparkles,
};

export function HomeHero({
  heroImage,
  badge,
  title,
  subtitle,
  exploreLabel,
  exploreHref,
  quickPickLabel,
  stats,
  cityLinks,
}: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          className="scale-105 object-cover opacity-40 dark:opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/75 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(249,115,22,0.15),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {badge}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-6 max-w-4xl font-display text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
        >
          <span className="text-gradient">{title}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Link
            href={exploreHref}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-accent/30"
          >
            {exploreLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {cityLinks.map((city) => (
            <Link
              key={city.href}
              href={city.href}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-surface/80 px-4 py-3 text-sm font-semibold backdrop-blur transition-colors hover:border-accent/40 hover:text-accent"
            >
              {city.name}
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
        >
          {stats.map(({ icon, value, label }) => {
            const Icon = STAT_ICONS[icon];
            return (
              <div
                key={label}
                className="rounded-2xl border border-border/60 bg-surface/60 p-4 backdrop-blur-sm"
              >
                <Icon className="h-5 w-5 text-accent" />
                <p className="mt-2 font-display text-2xl font-black">{value}</p>
                <p className="text-xs text-muted">{label}</p>
              </div>
            );
          })}
        </motion.div>

        {cityLinks.length > 0 && (
          <p className="mt-8 text-xs font-bold uppercase tracking-wider text-muted">
            {quickPickLabel}
          </p>
        )}
      </div>
    </section>
  );
}
