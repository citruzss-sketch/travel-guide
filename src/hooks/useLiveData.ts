"use client";

import { useEffect, useState } from "react";
import type { Coordinates } from "@/types/content";

interface WeatherData {
  temperature: number;
  weatherCode: number;
  humidity: number;
}

interface LiveData {
  weather: WeatherData | null;
  usdToVnd: number | null;
  localTime: string;
  loading: boolean;
  error: string | null;
}

function formatLocalTime(offsetHours: number): string {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
  const local = new Date(utc + offsetHours * 3_600_000);
  return local.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function weatherLabel(code: number, locale: string): string {
  const ru: Record<number, string> = {
    0: "Ясно",
    1: "Преимущественно ясно",
    2: "Переменная облачность",
    3: "Пасмурно",
    45: "Туман",
    48: "Изморозь",
    51: "Морось",
    61: "Дождь",
    63: "Дождь",
    65: "Ливень",
    80: "Ливни",
    95: "Гроза",
  };
  const en: Record<number, string> = {
    0: "Clear",
    1: "Mostly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Drizzle",
    61: "Rain",
    63: "Rain",
    65: "Heavy rain",
    80: "Showers",
    95: "Thunderstorm",
  };
  const map = locale === "ru" ? ru : en;
  return map[code] ?? (locale === "ru" ? "Облачно" : "Cloudy");
}

export function useLiveData(
  coordinates: Coordinates | undefined,
  timezoneOffset: number,
  locale: string
) {
  const [data, setData] = useState<LiveData>({
    weather: null,
    usdToVnd: null,
    localTime: formatLocalTime(timezoneOffset),
    loading: true,
    error: null,
  });

  useEffect(() => {
    const tick = setInterval(() => {
      setData((prev) => ({
        ...prev,
        localTime: formatLocalTime(timezoneOffset),
      }));
    }, 30_000);
    return () => clearInterval(tick);
  }, [timezoneOffset]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const tasks: Promise<void>[] = [];

        const next: Partial<LiveData> = {
          localTime: formatLocalTime(timezoneOffset),
        };

        tasks.push(
          fetch("https://api.frankfurter.app/latest?from=USD&to=VND")
            .then((r) => r.json())
            .then((json: { rates?: { VND?: number } }) => {
              if (json.rates?.VND) next.usdToVnd = Math.round(json.rates.VND);
            })
            .catch(() => {
              next.usdToVnd = 25_000;
            })
        );

        if (coordinates) {
          const { lat, lng } = coordinates;
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`;
          tasks.push(
            fetch(url)
              .then((r) => r.json())
              .then(
                (json: {
                  current?: {
                    temperature_2m: number;
                    relative_humidity_2m: number;
                    weather_code: number;
                  };
                }) => {
                  if (json.current) {
                    next.weather = {
                      temperature: Math.round(json.current.temperature_2m),
                      humidity: json.current.relative_humidity_2m,
                      weatherCode: json.current.weather_code,
                    };
                  }
                }
              )
              .catch(() => {})
          );
        }

        await Promise.all(tasks);

        if (!cancelled) {
          setData({
            weather: next.weather ?? null,
            usdToVnd: next.usdToVnd ?? null,
            localTime: next.localTime ?? formatLocalTime(timezoneOffset),
            loading: false,
            error: null,
          });
        }
      } catch {
        if (!cancelled) {
          setData((prev) => ({
            ...prev,
            loading: false,
            error: "fetch_failed",
          }));
        }
      }
    }

    load();
    const refresh = setInterval(load, 15 * 60_000);
    return () => {
      cancelled = true;
      clearInterval(refresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- using primitive coords to avoid re-runs on object reference change
  }, [coordinates?.lat, coordinates?.lng, timezoneOffset]);

  return {
    ...data,
    weatherLabel: (code: number) => weatherLabel(code, locale),
  };
}
