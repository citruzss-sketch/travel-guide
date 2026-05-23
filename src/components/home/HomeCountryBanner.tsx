"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HomeCountryBannerProps {
  name: string;
  flag: string;
  description: string;
  heroImage: string;
  href: string;
  label: string;
  cta: string;
}

export function HomeCountryBanner({
  name,
  flag,
  description,
  heroImage,
  href,
  label,
  cta,
}: HomeCountryBannerProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-xs font-bold uppercase tracking-wider text-accent">
          {label}
        </p>
        <Link
          href={href}
          className="group mt-4 flex overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-sm transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
        >
          <div className="relative hidden w-2/5 min-w-[200px] sm:block lg:w-1/3">
            <Image
              src={heroImage}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="400px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/90" />
          </div>
          <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
            <span className="text-4xl">{flag}</span>
            <h2 className="mt-3 font-display text-2xl font-black sm:text-3xl">
              {name}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              {description}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-accent">
              {cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
