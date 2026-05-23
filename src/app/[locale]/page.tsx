import { notFound } from "next/navigation";
import { Map, Sparkles, FileDown } from "lucide-react";
import { getAllCountries, getCitiesForCountry } from "@/lib/content";
import { getMessages, isValidLocale, t } from "@/lib/i18n";
import { getCountryHeroImage } from "@/lib/travel-images";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeCountryBanner } from "@/components/home/HomeCountryBanner";
import { HomeCityShowcase, HomeAIPreview } from "@/components/home/HomeCityShowcase";
import { HomeComingSoon } from "@/components/home/HomeComingSoon";
import { CityCompare } from "@/components/city/CityCompare";
import type { CityContent, Locale } from "@/types/content";

function countGuidePlaces(city: CityContent): number {
  return (
    city.sights.items.length +
    city.beaches.items.length +
    city.food.items.length +
    city.markets.items.length +
    city.tours.items.length
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const messages = await getMessages(locale);
  const countries = getAllCountries();
  const primaryCountry = countries[0];
  const cities = primaryCountry
    ? getCitiesForCountry(primaryCountry.slug)
    : [];
  const totalPlaces = cities.reduce((n, c) => n + countGuidePlaces(c), 0);

  const cityLinks = cities.map((city) => ({
    name: city.name[locale],
    href: `/${locale}/${primaryCountry!.slug}/${city.slug}`,
  }));

  const stats = [
    {
      icon: "cities" as const,
      value: String(cities.length),
      label: t(messages, "home.statCities"),
    },
    {
      icon: "places" as const,
      value: `${totalPlaces}+`,
      label: t(messages, "home.statPlaces"),
    },
    {
      icon: "ai" as const,
      value: "AI",
      label: t(messages, "home.statAI"),
    },
    {
      icon: "pdf" as const,
      value: "PDF",
      label: t(messages, "home.statOffline"),
    },
  ];

  const aiPrompts = [
    {
      text: t(messages, "home.aiPrompt1"),
      href: `/${locale}/vietnam/nha-trang`,
    },
    {
      text: t(messages, "home.aiPrompt2"),
      href: `/${locale}/vietnam/da-nang`,
    },
    {
      text: t(messages, "home.aiPrompt3"),
      href: `/${locale}/vietnam/nha-trang`,
    },
  ];

  const features = [
    {
      icon: Map,
      title: t(messages, "home.feature1Title"),
      desc: t(messages, "home.feature1Desc"),
    },
    {
      icon: Sparkles,
      title: t(messages, "home.feature2Title"),
      desc: t(messages, "home.feature2Desc"),
    },
    {
      icon: FileDown,
      title: t(messages, "home.feature3Title"),
      desc: t(messages, "home.feature3Desc"),
    },
  ];

  return (
    <>
      <HomeHero
        heroImage={getCountryHeroImage()}
        badge={t(messages, "home.heroBadge")}
        title={t(messages, "home.heroTitle")}
        subtitle={t(messages, "home.heroSubtitle")}
        exploreLabel={t(messages, "home.exploreCountries")}
        exploreHref={`/${locale}/${primaryCountry?.slug ?? "vietnam"}`}
        quickPickLabel={t(messages, "home.quickPick")}
        stats={stats}
        cityLinks={cityLinks}
      />

      {primaryCountry && (
        <HomeCountryBanner
          name={primaryCountry.name[locale]}
          flag={primaryCountry.flag}
          description={primaryCountry.description[locale]}
          heroImage={primaryCountry.heroImage}
          href={`/${locale}/${primaryCountry.slug}`}
          label={t(messages, "home.startWith")}
          cta={t(messages, "home.openGuide")}
        />
      )}

      <HomeCityShowcase
        title={t(messages, "home.featuredDestinations")}
        subtitle={t(messages, "home.citiesSubtitle")}
        placesLabel={t(messages, "home.placesInGuide")}
        openGuideLabel={t(messages, "country.exploreCity")}
        aiChatLabel={t(messages, "city.chat")}
        mapLabel={t(messages, "city.map")}
        cities={cities.map((city) => ({
          slug: city.slug,
          name: city.name[locale],
          tagline: city.tagline[locale],
          bestTime: city.bestTime[locale],
          heroImage: city.heroImage,
          placeCount: countGuidePlaces(city),
          href: `/${locale}/${primaryCountry!.slug}/${city.slug}`,
          chatHref: `/${locale}/${primaryCountry!.slug}/${city.slug}`,
        }))}
      />

      <HomeAIPreview
        title={t(messages, "home.aiSectionTitle")}
        subtitle={t(messages, "home.aiSectionDesc")}
        prompts={aiPrompts}
      />

      {primaryCountry && cities.length >= 2 && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
            {t(messages, "home.compareSection")}
          </h2>
          <p className="mt-2 text-muted">{t(messages, "home.compareSubtitle")}</p>
          <div className="mt-8">
            <CityCompare cities={cities} countrySlug={primaryCountry.slug} />
          </div>
        </section>
      )}

      <section className="border-t border-border bg-surface/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
            {t(messages, "home.whyUs")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-border/80 bg-surface p-6 transition-colors hover:border-accent/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeComingSoon
        title={t(messages, "home.comingSoon")}
        subtitle={t(messages, "home.comingSoonDesc")}
        items={[
          t(messages, "home.comingSoon1"),
          t(messages, "home.comingSoon2"),
          t(messages, "home.comingSoon3"),
        ]}
      />
    </>
  );
}
