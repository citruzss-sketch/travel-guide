"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Trash2, MessageCircle, MapPin } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useLocale, useT } from "@/components/providers/LocaleProvider";
import { ChatMarkdown } from "@/components/chat/ChatMarkdown";
import { plainTextFromMarkdown } from "@/lib/chat-markdown";

interface FavoritesDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function FavoritesDrawer({ open, onClose }: FavoritesDrawerProps) {
  const t = useT();
  const { locale } = useLocale();
  const { favorites, remove, refresh } = useFavorites();

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-border bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="flex items-center gap-2 font-display text-lg font-black">
                <Heart className="h-5 w-5 fill-accent text-accent" />
                {t("favorites.title")}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-muted hover:bg-surface-hover hover:text-foreground"
                aria-label={t("favorites.close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {favorites.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted">
                  {t("favorites.empty")}
                </p>
              ) : (
                <ul className="space-y-3">
                  {favorites.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-xl border border-border bg-surface p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
                            {item.type === "chat" ? (
                              <MessageCircle className="h-3.5 w-3.5" />
                            ) : (
                              <MapPin className="h-3.5 w-3.5" />
                            )}
                            {item.citySlug}
                          </div>
                          <p className="mt-1 font-semibold text-foreground">
                            {item.title}
                          </p>
                          {item.subtitle && (
                            <p className="mt-1 line-clamp-2 text-xs text-muted">
                              {plainTextFromMarkdown(item.subtitle)}
                            </p>
                          )}
                          {item.body && item.type === "chat" && (
                            <div className="relative mt-2 max-h-40 overflow-hidden">
                              <ChatMarkdown
                                content={item.body}
                                variant="assistant"
                                compact
                              />
                              <div
                                className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-surface to-transparent"
                                aria-hidden
                              />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          className="shrink-0 rounded-lg p-2 text-muted hover:bg-red-500/10 hover:text-red-500"
                          aria-label={t("favorites.remove")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <Link
                        href={`/${locale}/${item.countrySlug}/${item.citySlug}${
                          item.type === "content" && item.sectionKey != null && item.itemIndex != null
                            ? `#${item.sectionKey}-item-${item.itemIndex}`
                            : ""
                        }`}
                        onClick={onClose}
                        className="mt-3 inline-block text-xs font-bold text-accent hover:underline"
                      >
                        {t("favorites.openCity")}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
