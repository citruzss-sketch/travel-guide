"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Square } from "lucide-react";
import type { ChecklistItem, Locale } from "@/types/content";
import { useT } from "@/components/providers/LocaleProvider";

function storageKey(citySlug: string) {
  return `travel-checklist-${citySlug}`;
}

interface TripChecklistProps {
  citySlug: string;
  items: ChecklistItem[];
  locale: Locale;
}

export function TripChecklist({ citySlug, items, locale }: TripChecklistProps) {
  const t = useT();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(citySlug));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setChecked(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [citySlug]);

  const persist = useCallback(
    (next: Record<string, boolean>) => {
      setChecked(next);
      localStorage.setItem(storageKey(citySlug), JSON.stringify(next));
    },
    [citySlug]
  );

  const toggle = (id: string) => {
    persist({ ...checked, [id]: !checked[id] });
  };

  if (!items.length) return null;

  const doneCount = items.filter((i) => checked[i.id]).length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-surface p-5 sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="font-display text-lg font-black text-foreground">
          {t("checklist.title")}
        </h3>
        {ready && (
          <span className="text-xs font-semibold text-muted">
            {t("checklist.progress", {
              done: String(doneCount),
              total: String(items.length),
            })}
          </span>
        )}
      </div>
      <ul className="space-y-2">
        {items.map((item) => {
          const isDone = !!checked[item.id];
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  isDone
                    ? "bg-accent/10 text-muted line-through"
                    : "bg-background hover:bg-surface-hover text-foreground"
                }`}
              >
                {isDone ? (
                  <CheckSquare className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                ) : (
                  <Square className="mt-0.5 h-5 w-5 shrink-0 text-muted" />
                )}
                <span>{item.label[locale]}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
}
