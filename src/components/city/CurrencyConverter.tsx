"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { useT, useLocale } from "@/components/providers/LocaleProvider";
import { formatNumber } from "@/lib/format-number";

interface CurrencyConverterProps {
  usdToVnd: number | null;
}

export function CurrencyConverter({ usdToVnd }: CurrencyConverterProps) {
  const t = useT();
  const { locale } = useLocale();
  const rate = usdToVnd ?? 25_000;
  const [amount, setAmount] = useState("100");
  const [direction, setDirection] = useState<"usd-vnd" | "vnd-usd">("usd-vnd");

  const result = useMemo(() => {
    const value = parseFloat(amount.replace(",", "."));
    if (!Number.isFinite(value) || value < 0) return "—";
    if (direction === "usd-vnd") {
      return `${formatNumber(Math.round(value * rate), locale)} VND`;
    }
    return `$${(value / rate).toFixed(2)}`;
  }, [amount, direction, rate]);

  const swap = () => {
    setDirection((d) => (d === "usd-vnd" ? "vnd-usd" : "usd-vnd"));
    setAmount("");
  };

  return (
    <div className="mt-4 rounded-xl border border-border/60 bg-background/60 p-3">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">
        {t("live.converterTitle")}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="number"
          min="0"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-28 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-semibold outline-none focus:border-accent"
          aria-label={t("live.converterInput")}
        />
        <span className="text-sm font-bold text-muted">
          {direction === "usd-vnd" ? "USD" : "VND"}
        </span>
        <button
          type="button"
          onClick={swap}
          className="rounded-lg border border-border p-2 text-muted hover:text-accent"
          aria-label={t("live.converterSwap")}
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>
        <span className="text-sm font-bold text-foreground">= {result}</span>
      </div>
    </div>
  );
}
