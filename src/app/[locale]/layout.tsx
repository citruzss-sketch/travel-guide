import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { PWARegister } from "@/components/PWARegister";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { getMessages, isValidLocale } from "@/lib/i18n";
import type { Locale } from "@/types/content";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale as Locale);

  return (
    <LocaleProvider locale={locale as Locale} messages={messages}>
      <ToastProvider>
        <AmbientBackground />
        <PWARegister />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </ToastProvider>
    </LocaleProvider>
  );
}
