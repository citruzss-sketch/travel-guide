"use client";

import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";

interface HomeComingSoonProps {
  title: string;
  subtitle: string;
  items: string[];
}

export function HomeComingSoon({ title, subtitle, items }: HomeComingSoonProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="rounded-3xl border border-dashed border-border/80 bg-surface/30 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Globe2 className="h-5 w-5 text-muted" />
          <h2 className="font-display text-lg font-black text-muted">{title}</h2>
        </div>
        <p className="mt-2 text-sm text-muted">{subtitle}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {items.map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-full border border-border/60 bg-background/50 px-4 py-2 text-sm font-medium text-muted/80"
            >
              {item}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
