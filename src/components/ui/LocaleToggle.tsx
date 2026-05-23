"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/types/content";
import { locales } from "@/lib/i18n";

export function LocaleToggle() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = (segments[0] as Locale) || "ru";
  const restPath = segments.slice(1).join("/");

  return (
    <div className="flex rounded-full border border-border bg-surface p-0.5">
      {locales.map((locale) => {
        const href = restPath ? `/${locale}/${restPath}` : `/${locale}`;
        const isActive = locale === currentLocale;
        return (
          <Link
            key={locale}
            href={href}
            className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              isActive
                ? "bg-accent text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
}
