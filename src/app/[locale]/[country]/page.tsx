import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getCountry, getCitiesForCountry } from "@/lib/content";
import { CityCompare } from "@/components/city/CityCompare";
import { getMessages, isValidLocale, t } from "@/lib/i18n";
import type { Locale } from "@/types/content";

export default async function CountryPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale: localeParam, country: countrySlug } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const country = getCountry(countrySlug);
  if (!country) notFound();

  const cities = getCitiesForCountry(countrySlug);
  const messages = await getMessages(locale);

  return (
    <div className="bg-background">
      <section
        className="relative h-[40vh] min-h-[240px] max-h-[400px]"
      >
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={country.heroImage}
            alt={country.name[locale]}
            fill
            priority
            className="scale-[1.06] object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-background via-background/90 to-transparent" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 z-[2]"
          style={{ bottom: 0, height: 8, background: "var(--background)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 z-[3] mx-auto max-w-6xl px-4 pb-8 sm:px-6">
          <Link
            href={`/${locale}`}
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-sm text-muted backdrop-blur hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t(messages, "nav.back")}
          </Link>
          <span className="text-4xl">{country.flag}</span>
          <h1 className="mt-2 font-display text-4xl font-black tracking-tight sm:text-5xl">
            {country.name[locale]}
          </h1>
          <p className="mt-2 max-w-2xl text-muted">{country.description[locale]}</p>
        </div>
      </section>

      <section className="relative -mt-3 bg-background pt-3 mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-2xl font-black">
          {t(messages, "country.cities")}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${locale}/${countrySlug}/${city.slug}`}
              className="group overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:border-accent/40"
            >
              <div className="card-media relative h-52">
                <Image
                  src={city.heroImage}
                  alt={city.name[locale]}
                  fill
                  className="block object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-surface/25 to-transparent" />
              </div>
              <div className="relative z-10 -mt-px flex items-center justify-between bg-surface p-5">
                <div>
                  <h3 className="font-display text-xl font-black">
                    {city.name[locale]}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">
                    {city.tagline[locale]}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-sm font-bold text-accent">
                  {t(messages, "country.exploreCity")}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {cities.length >= 2 && (
          <CityCompare cities={cities} countrySlug={countrySlug} />
        )}
      </section>
    </div>
  );
}
