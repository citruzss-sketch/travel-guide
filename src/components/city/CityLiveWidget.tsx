"use client";

import { motion } from "framer-motion";
import { CloudSun, Clock, DollarSign, Sparkles } from "lucide-react";
import type { CityContent, Locale } from "@/types/content";
import { useLiveData } from "@/hooks/useLiveData";
import { useT } from "@/components/providers/LocaleProvider";
import { formatNumber } from "@/lib/format-number";
import { CurrencyConverter } from "./CurrencyConverter";

interface CityLiveWidgetProps {
  city: CityContent;
  locale: Locale;
}

export function CityLiveWidget({ city, locale }: CityLiveWidgetProps) {
  const t = useT();
  const offset = city.timezoneOffset ?? 7;
  const { weather, usdToVnd, localTime, loading, weatherLabel } = useLiveData(
    city.coordinates,
    offset,
    locale
  );

  const tip =
    weather && weather.temperature >= 32
      ? t("live.tipHot")
      : weather && weather.weatherCode >= 61
        ? t("live.tipRain")
        : t("live.tipDefault", { city: city.name[locale] });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mt-6 rounded-2xl border border-accent/20 bg-surface/80 p-4 shadow-sm shadow-accent/5 backdrop-blur-md sm:p-5"
    >
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">
        {t("live.title")}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-start gap-3 rounded-xl bg-background/60 p-3">
          <CloudSun className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="text-xs font-semibold text-muted">{t("live.weather")}</p>
            <p className="mt-0.5 text-sm font-bold text-foreground">
              {loading && !weather
                ? "…"
                : weather
                  ? `${weather.temperature}°C · ${weatherLabel(weather.weatherCode)}`
                  : t("live.unavailable")}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl bg-background/60 p-3">
          <DollarSign className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="text-xs font-semibold text-muted">{t("live.exchange")}</p>
            <p className="mt-0.5 text-sm font-bold text-foreground">
              {usdToVnd
                ? `1 USD = ${formatNumber(usdToVnd, locale)} VND`
                : loading
                  ? "…"
                  : t("live.unavailable")}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl bg-background/60 p-3">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="text-xs font-semibold text-muted">{t("live.localTime")}</p>
            <p className="mt-0.5 text-sm font-bold text-foreground">
              {localTime} (UTC+{offset})
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl bg-accent/10 p-3 sm:col-span-2 lg:col-span-1">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="text-xs font-semibold text-muted">{t("live.tip")}</p>
            <p className="mt-0.5 text-sm leading-snug text-foreground">{tip}</p>
          </div>
        </div>
      </div>
      <CurrencyConverter usdToVnd={usdToVnd} />
    </motion.div>
  );
}
