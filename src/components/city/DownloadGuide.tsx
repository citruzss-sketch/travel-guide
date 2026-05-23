"use client";

import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useT } from "@/components/providers/LocaleProvider";

interface DownloadGuideProps {
  countrySlug: string;
  citySlug: string;
  cityName: string;
}

export function DownloadGuide({
  countrySlug,
  citySlug,
  cityName,
}: DownloadGuideProps) {
  const t = useT();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pdf/${countrySlug}/${citySlug}`);
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${citySlug}-travel-guide.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert(t("chat.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-lg rounded-3xl border border-border bg-surface p-8 text-center accent-glow"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15">
        <FileText className="h-8 w-8 text-accent" />
      </div>
      <h3 className="mt-6 font-display text-2xl font-black tracking-tight">
        {t("city.downloadGuide")}
      </h3>
      <p className="mt-2 text-sm text-muted">{t("city.downloadDesc")}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{cityName}</p>
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {t("city.downloading")}
          </>
        ) : (
          <>
            <Download className="h-5 w-5" />
            {t("city.download")}
          </>
        )}
      </button>
    </motion.div>
  );
}
