"use client";

import { Compass } from "lucide-react";
import { useT } from "@/components/providers/LocaleProvider";

export function Footer() {
  const t = useT();

  return (
    <footer className="mt-auto border-t border-border/60 bg-surface/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center sm:px-6">
        <div className="flex items-center gap-2 text-muted">
          <Compass className="h-4 w-4 text-accent" />
          <span className="text-sm">{t("footer.madeWith")}</span>
        </div>
        <p className="max-w-md text-xs text-muted">{t("footer.comingSoon")}</p>
      </div>
    </footer>
  );
}
