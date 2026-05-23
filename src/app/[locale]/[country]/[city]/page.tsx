import { notFound } from "next/navigation";
import { getCity } from "@/lib/content";
import { isValidLocale } from "@/lib/i18n";
import type { Locale } from "@/types/content";
import { CityHero } from "@/components/city/CityHero";
import { CityTabs } from "@/components/city/CityTabs";

export default async function CityPage({
  params,
}: {
  params: Promise<{ locale: string; country: string; city: string }>;
}) {
  const { locale: localeParam, country, city: citySlug } = await params;

  if (!isValidLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const city = getCity(country, citySlug);
  if (!city) notFound();

  return (
    <div className="pb-8">
      <CityHero city={city} locale={locale} countrySlug={country} />
      <CityTabs city={city} locale={locale} countrySlug={country} />
    </div>
  );
}
