"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

const UPDATE_LABELS: Record<string, { msg: string; btn: string }> = {
  en: { msg: "A new version is available", btn: "Update" },
  ru: { msg: "Доступна новая версия", btn: "Обновить" },
};

export function PWARegister() {
  const { locale } = useLocale();
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {

        // New SW waiting right away (e.g. hard reload)
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
        }

        // SW found during page session
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              setWaitingWorker(newWorker);
            }
          });
        });
      })
      .catch(() => {
        /* registration optional */
      });

    // After the new SW activates, reload to pick up fresh assets
    const onControllerChange = () => {
      if (!updating) window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyUpdate = useCallback(() => {
    if (!waitingWorker) return;
    setUpdating(true);
    waitingWorker.postMessage("SKIP_WAITING");
  }, [waitingWorker]);

  if (!waitingWorker) return null;

  const labels = UPDATE_LABELS[locale] ?? UPDATE_LABELS.en;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold shadow-xl shadow-black/30 md:bottom-6"
    >
      <RefreshCw className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
      <span className="text-foreground">{labels.msg}</span>
      <button
        onClick={applyUpdate}
        disabled={updating}
        className="rounded-lg bg-accent px-3 py-1 text-xs font-bold text-white transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {labels.btn}
      </button>
    </div>
  );
}
