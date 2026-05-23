import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Map, Sparkles, FileDown } from "lucide-react";
import { notFound } from "next/navigation";
import { getAllCountries, getCitiesForCountry } from "@/lib/content";
import { getMessages, isValidLocale, t } from "@/lib/i18n";
import type { Locale } from "@/types/content";

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

  const featuredCities = countries.flatMap((country) =>
    getCitiesForCountry(country.slug).map((city) => ({
      country,
      city,
    }))
  );

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
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80"
            alt=""
            fill
            priority
            className="scale-[1.03] object-cover opacity-30 dark:opacity-20"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/90 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <h1 className="max-w-3xl font-display text-4xl font-black leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-gradient">{t(messages, "home.heroTitle")}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted sm:text-xl">
            {t(messages, "home.heroSubtitle")}
          </p>
          <Link
            href={`/${locale}/${countries[0]?.slug ?? "vietnam"}`}
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-accent/30"
          >
            {t(messages, "home.exploreCountries")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
          {t(messages, "nav.countries")}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {countries.map((country) => (
            <Link
              key={country.slug}
              href={`/${locale}/${country.slug}`}
              className="group card-shine overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-sm transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10"
            >
              <div className="card-media relative h-48">
                <Image
                  src={country.heroImage}
                  alt={country.name[locale]}
                  fill
                  className="block object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-surface/25 to-transparent" />
                <span className="absolute bottom-4 left-4 z-10 text-3xl drop-shadow-md">
                  {country.flag}
                </span>
              </div>
              <div className="relative z-10 -mt-px bg-surface p-5">
                <h3 className="font-display text-xl font-black">
                  {country.name[locale]}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted">
                  {country.description[locale]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
            {t(messages, "home.featuredDestinations")}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCities.map(({ country, city }) => (
              <Link
                key={city.slug}
                href={`/${locale}/${country.slug}/${city.slug}`}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent/30"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={city.heroImage}
                    alt={city.name[locale]}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <p className="font-display font-bold">{city.name[locale]}</p>
                  <p className="text-xs text-muted">{country.name[locale]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
          {t(messages, "home.whyUs")}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15">
                <Icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
