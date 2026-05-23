import {
  Document,
  Link,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type {
  CityContent,
  CitySection,
  ContentItem,
  CountryMeta,
  Locale,
} from "@/types/content";
import { CITY_SECTION_KEYS, type CitySectionKey } from "@/lib/content";
import { PDF_BRAND, cityPageUrl, pdfSiteLabel } from "@/lib/pdf-brand";
import { registerPdfFonts } from "@/lib/pdf-fonts";
import {
  findPlaceByCoords,
  googleMapsLinkLabel,
  googleMapsUrlForKnownPlace,
  googleMapsUrlForPlace,
  resolveKnownPlace,
} from "@/lib/maps-links";

registerPdfFonts();

const c = {
  accent: "#ea580c",
  accentLight: "#fed7aa",
  accentSoft: "#fff7ed",
  accentDark: "#c2410c",
  ink: "#111827",
  body: "#374151",
  muted: "#6b7280",
  border: "#e5e7eb",
  surface: "#f9fafb",
  warnBg: "#fef2f2",
  warnBorder: "#fecaca",
  white: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 52,
    paddingHorizontal: 44,
    fontSize: 9.5,
    fontFamily: "NotoSans",
    lineHeight: 1.5,
    color: c.body,
  },
  coverPage: {
    backgroundColor: c.accent,
    fontFamily: "NotoSans",
    padding: 0,
  },
  coverTopBand: {
    backgroundColor: "#c2410c",
    paddingVertical: 14,
    paddingHorizontal: 44,
    alignItems: "center",
  },
  coverBrand: {
    fontSize: 11,
    fontWeight: 700,
    color: c.white,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  coverBrandTag: {
    fontSize: 8,
    color: "#ffedd5",
    marginTop: 4,
  },
  coverBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 48,
    paddingVertical: 40,
  },
  coverCityRu: {
    fontSize: 34,
    fontWeight: 700,
    color: c.white,
    textAlign: "center",
  },
  coverCityEn: {
    fontSize: 20,
    color: "#ffedd5",
    marginTop: 6,
    textAlign: "center",
  },
  coverCountry: {
    fontSize: 11,
    color: "#fed7aa",
    marginTop: 20,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  coverDivider: {
    width: 48,
    height: 2,
    backgroundColor: c.white,
    marginVertical: 20,
    opacity: 0.7,
  },
  coverDesc: {
    fontSize: 10,
    color: "#ffedd5",
    textAlign: "center",
    lineHeight: 1.55,
    maxWidth: 360,
  },
  coverSite: {
    fontSize: 9,
    color: c.white,
    marginTop: 24,
    fontWeight: 700,
  },
  coverFooter: {
    paddingVertical: 16,
    paddingHorizontal: 44,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
  },
  coverFooterText: {
    fontSize: 8,
    color: "#ffedd5",
    textAlign: "center",
    lineHeight: 1.45,
  },
  headerBar: {
    position: "absolute",
    top: 18,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  headerBrand: {
    fontSize: 7.5,
    fontWeight: 700,
    color: c.accent,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  headerMeta: {
    fontSize: 7.5,
    color: c.muted,
  },
  langTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: c.ink,
    marginBottom: 4,
  },
  langSubtitle: {
    fontSize: 10,
    color: c.muted,
    marginBottom: 14,
  },
  overview: {
    fontSize: 9.5,
    lineHeight: 1.55,
    marginBottom: 14,
    color: c.body,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  metaCard: {
    width: "48%",
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 6,
    padding: 9,
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: c.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 9,
    lineHeight: 1.4,
    color: c.ink,
  },
  tocBox: {
    backgroundColor: c.accentSoft,
    borderWidth: 1,
    borderColor: c.accentLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  tocTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: c.accentDark,
    marginBottom: 8,
  },
  tocRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  tocNum: {
    width: 16,
    fontSize: 8.5,
    fontWeight: 700,
    color: c.accent,
  },
  tocText: {
    flex: 1,
    fontSize: 8.5,
    color: c.body,
  },
  checklistBox: {
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  checklistTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: c.ink,
    marginBottom: 8,
  },
  checklistRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  checklistMark: {
    width: 12,
    fontSize: 9,
    color: c.accent,
  },
  checklistText: {
    flex: 1,
    fontSize: 8.5,
    lineHeight: 1.4,
  },
  ctaBox: {
    backgroundColor: c.accent,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 14,
  },
  ctaTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: c.white,
    marginBottom: 4,
  },
  ctaBody: {
    fontSize: 8.5,
    color: "#ffedd5",
    lineHeight: 1.45,
    marginBottom: 6,
  },
  ctaLink: {
    fontSize: 9,
    fontWeight: 700,
    color: c.white,
    textDecoration: "underline",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: c.accent,
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: c.accentLight,
  },
  sectionTitleWarn: {
    fontSize: 12,
    fontWeight: 700,
    color: "#b91c1c",
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: c.warnBorder,
  },
  itemCard: {
    marginBottom: 10,
    paddingLeft: 10,
    paddingVertical: 6,
    borderLeftWidth: 3,
    borderLeftColor: c.accent,
  },
  itemCardWarn: {
    marginBottom: 10,
    paddingLeft: 10,
    paddingVertical: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#ef4444",
    backgroundColor: c.warnBg,
  },
  itemCardPhrase: {
    marginBottom: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: c.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: c.border,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: c.ink,
    marginBottom: 2,
  },
  itemBody: {
    fontSize: 9,
    lineHeight: 1.5,
    color: c.body,
  },
  itemPronunciation: {
    fontSize: 8,
    color: c.muted,
    marginTop: 1,
  },
  priceTag: {
    fontSize: 9,
    fontWeight: 700,
    color: c.accentDark,
    marginTop: 3,
  },
  address: {
    fontSize: 8,
    color: c.muted,
    marginTop: 2,
  },
  tipRow: {
    flexDirection: "row",
    marginTop: 2,
    paddingLeft: 2,
  },
  tipBullet: {
    width: 10,
    fontSize: 8,
    color: c.accent,
  },
  tipText: {
    flex: 1,
    fontSize: 8,
    color: c.muted,
    lineHeight: 1.4,
  },
  mapLink: {
    fontSize: 8,
    color: c.accent,
    marginTop: 3,
    fontWeight: 700,
  },
  mapRefBlock: {
    marginBottom: 14,
    padding: 10,
    backgroundColor: c.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: c.border,
  },
  mapRefTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: c.ink,
    marginBottom: 6,
  },
  mapRefRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  mapRefDot: {
    width: 10,
    fontSize: 8,
    color: c.accent,
  },
  mapRefText: {
    flex: 1,
    fontSize: 8,
    color: c.body,
  },
  backPage: {
    backgroundColor: c.ink,
    fontFamily: "NotoSans",
    padding: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  backBrand: {
    fontSize: 18,
    fontWeight: 700,
    color: c.white,
    marginBottom: 6,
  },
  backTag: {
    fontSize: 10,
    color: "#9ca3af",
    marginBottom: 24,
    textAlign: "center",
  },
  backFeature: {
    fontSize: 9,
    color: "#d1d5db",
    marginBottom: 5,
    textAlign: "center",
  },
  backLink: {
    fontSize: 11,
    fontWeight: 700,
    color: c.accent,
    marginTop: 20,
    textDecoration: "underline",
  },
  backMuted: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 16,
    textAlign: "center",
    lineHeight: 1.45,
  },
  pageFooter: {
    position: "absolute",
    bottom: 22,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: c.border,
    paddingTop: 6,
  },
  footerLeft: {
    fontSize: 7,
    color: c.muted,
    maxWidth: "70%",
  },
  footerLink: {
    fontSize: 7,
    color: c.accent,
  },
  footerPage: {
    fontSize: 7,
    color: c.muted,
  },
});

const WARN_SECTIONS: CitySectionKey[] = ["safety", "scams"];
const PHRASE_SECTION: CitySectionKey = "phrases";

function t(locale: Locale, ru: string, en: string) {
  return locale === "ru" ? ru : en;
}

function getMapsUrl(
  item: ContentItem,
  city: CityContent,
  locale: Locale
): string | null {
  if (item.coordinates) {
    const known = findPlaceByCoords(
      item.coordinates.lat,
      item.coordinates.lng,
      city.slug
    );
    if (known) return googleMapsUrlForKnownPlace(known);
  }

  const byTitle =
    resolveKnownPlace(item.title.en, city.slug) ??
    resolveKnownPlace(item.title.ru, city.slug);
  if (byTitle) return googleMapsUrlForKnownPlace(byTitle);

  if (item.coordinates || item.address || item.googlePlaceId) {
    return googleMapsUrlForPlace(item, city.name[locale], locale);
  }

  return null;
}

function PageHeader({
  locale,
  cityName,
  sectionLabel,
}: {
  locale: Locale;
  cityName: string;
  sectionLabel?: string;
}) {
  return (
    <View style={styles.headerBar} fixed>
      <Text style={styles.headerBrand}>{PDF_BRAND.name[locale]}</Text>
      <Text style={styles.headerMeta}>
        {cityName}
        {sectionLabel ? ` · ${sectionLabel}` : ""}
      </Text>
    </View>
  );
}

function PageFooterBar({
  locale,
  cityName,
  siteUrl,
  countrySlug,
  citySlug,
}: {
  locale: Locale;
  cityName: string;
  siteUrl: string;
  countrySlug: string;
  citySlug: string;
}) {
  const url = cityPageUrl(siteUrl, locale, countrySlug, citySlug);
  const host = pdfSiteLabel(siteUrl);

  return (
    <View style={styles.pageFooter} fixed>
      <Text style={styles.footerLeft}>
        {PDF_BRAND.name[locale]} · {cityName} · {host}
      </Text>
      <Link src={url} style={styles.footerLink}>
        {t(locale, "Открыть на сайте", "Open on website")}
      </Link>
      <Text
        style={styles.footerPage}
        render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
      />
    </View>
  );
}

function SiteCta({
  locale,
  siteUrl,
  countrySlug,
  citySlug,
}: {
  locale: Locale;
  siteUrl: string;
  countrySlug: string;
  citySlug: string;
}) {
  const url = cityPageUrl(siteUrl, locale, countrySlug, citySlug);
  return (
    <View style={styles.ctaBox}>
      <Text style={styles.ctaTitle}>
        {t(locale, "Полная версия на сайте", "Full guide on the website")}
      </Text>
      <Text style={styles.ctaBody}>
        {t(
          locale,
          "Интерактивная карта, AI-ассистент по городу, избранное и актуальные советы — бесплатно на",
          "Interactive map, city AI assistant, favorites and up-to-date tips — free at"
        )}{" "}
        {pdfSiteLabel(siteUrl)}
      </Text>
      <Link src={url} style={styles.ctaLink}>
        {url}
      </Link>
    </View>
  );
}

function renderItem(
  item: ContentItem,
  city: CityContent,
  locale: Locale,
  sectionKey: CitySectionKey,
  index: number
) {
  const isWarn = WARN_SECTIONS.includes(sectionKey);
  const isPhrase = sectionKey === PHRASE_SECTION;
  const mapsUrl = getMapsUrl(item, city, locale);
  const address = item.address?.[locale];

  if (isPhrase) {
    return (
      <View key={index} style={styles.itemCardPhrase}>
        <Text style={styles.itemTitle}>{item.title[locale]}</Text>
        <Text style={styles.itemPronunciation}>{item.description[locale]}</Text>
      </View>
    );
  }

  const cardStyle = isWarn ? styles.itemCardWarn : styles.itemCard;

  return (
    <View key={index} style={cardStyle}>
      <Text style={styles.itemTitle}>{item.title[locale]}</Text>
      <Text style={styles.itemBody}>{item.description[locale]}</Text>
      {address ? <Text style={styles.address}>{address}</Text> : null}
      {item.price?.[locale] ? (
        <Text style={styles.priceTag}>{item.price[locale]}</Text>
      ) : null}
      {item.tips?.[locale]?.map((tip, tipIndex) => (
        <View key={tipIndex} style={styles.tipRow}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      ))}
      {mapsUrl ? (
        <Link src={mapsUrl} style={styles.mapLink}>
          {googleMapsLinkLabel(locale)}
        </Link>
      ) : null}
    </View>
  );
}

function renderSection(
  section: CitySection,
  sectionKey: CitySectionKey,
  city: CityContent,
  locale: Locale
) {
  if (!section.items.length) return null;
  const isWarn = WARN_SECTIONS.includes(sectionKey);
  return (
    <View key={sectionKey}>
      <Text style={isWarn ? styles.sectionTitleWarn : styles.sectionTitle}>
        {section.title[locale]}
      </Text>
      {section.items.map((item, i) =>
        renderItem(item, city, locale, sectionKey, i)
      )}
    </View>
  );
}

function TableOfContents({ city, locale }: { city: CityContent; locale: Locale }) {
  return (
    <View style={styles.tocBox}>
      <Text style={styles.tocTitle}>
        {t(locale, "Содержание", "Contents")}
      </Text>
      {CITY_SECTION_KEYS.map((key, i) => {
        const section = city[key];
        if (!section.items.length) return null;
        return (
          <View key={key} style={styles.tocRow}>
            <Text style={styles.tocNum}>{i + 1}.</Text>
            <Text style={styles.tocText}>{section.title[locale]}</Text>
          </View>
        );
      })}
    </View>
  );
}

function TripChecklist({
  city,
  locale,
}: {
  city: CityContent;
  locale: Locale;
}) {
  if (!city.checklist?.length) return null;
  return (
    <View style={styles.checklistBox}>
      <Text style={styles.checklistTitle}>
        {t(locale, "Чеклист перед поездкой", "Pre-trip checklist")}
      </Text>
      {city.checklist.map((item) => (
        <View key={item.id} style={styles.checklistRow}>
          <Text style={styles.checklistMark}>☐</Text>
          <Text style={styles.checklistText}>{item.label[locale]}</Text>
        </View>
      ))}
    </View>
  );
}

function MapQuickReference({
  city,
  locale,
}: {
  city: CityContent;
  locale: Locale;
}) {
  const markers = city.mapMarkers?.slice(0, 8);
  if (!markers?.length) return null;

  return (
    <View style={styles.mapRefBlock}>
      <Text style={styles.mapRefTitle}>
        {t(locale, "Ключевые точки на карте", "Key map locations")}
      </Text>
      {markers.map((m) => (
        <View key={m.id} style={styles.mapRefRow}>
          <Text style={styles.mapRefDot}>•</Text>
          <Text style={styles.mapRefText}>
            {m.title[locale]}
            {m.description?.[locale] ? ` — ${m.description[locale]}` : ""}
          </Text>
        </View>
      ))}
      <Text style={{ fontSize: 7.5, color: c.muted, marginTop: 4 }}>
        {t(
          locale,
          "Откройте интерактивную карту на сайте — все метки с координатами.",
          "Open the interactive map on the website for all pins with coordinates."
        )}
      </Text>
    </View>
  );
}

function CityIntroPage({
  city,
  locale,
  country,
  siteUrl,
}: {
  city: CityContent;
  locale: Locale;
  country: CountryMeta;
  siteUrl: string;
}) {
  const metaFields = [
    {
      label: t(locale, "Лучшее время", "Best time"),
      value: city.bestTime[locale],
    },
    {
      label: t(locale, "Валюта", "Currency"),
      value: city.currency[locale],
    },
    {
      label: t(locale, "Язык", "Language"),
      value: city.language[locale],
    },
    {
      label: t(locale, "Часовой пояс", "Timezone"),
      value: city.timezone[locale],
    },
  ];

  return (
    <Page size="A4" style={styles.page} wrap>
      <PageHeader
        locale={locale}
        cityName={city.name[locale]}
        sectionLabel={t(locale, "Обзор", "Overview")}
      />

      <Text style={styles.langTitle}>{city.name[locale]}</Text>
      <Text style={styles.langSubtitle}>
        {country.name[locale]} · {city.tagline[locale]}
      </Text>
      <Text style={styles.overview}>{city.overview[locale]}</Text>

      <View style={styles.metaRow}>
        {metaFields.map((field) => (
          <View key={field.label} style={styles.metaCard}>
            <Text style={styles.metaLabel}>{field.label}</Text>
            <Text style={styles.metaValue}>{field.value}</Text>
          </View>
        ))}
      </View>

      <TableOfContents city={city} locale={locale} />
      <TripChecklist city={city} locale={locale} />
      <MapQuickReference city={city} locale={locale} />
      <SiteCta
        locale={locale}
        siteUrl={siteUrl}
        countrySlug={country.slug}
        citySlug={city.slug}
      />

      <PageFooterBar
        locale={locale}
        cityName={city.name[locale]}
        siteUrl={siteUrl}
        countrySlug={country.slug}
        citySlug={city.slug}
      />
    </Page>
  );
}

function CityContentPages({
  city,
  locale,
  country,
  siteUrl,
}: {
  city: CityContent;
  locale: Locale;
  country: CountryMeta;
  siteUrl: string;
}) {
  return (
    <Page size="A4" style={styles.page} wrap>
      <PageHeader locale={locale} cityName={city.name[locale]} />

      {CITY_SECTION_KEYS.map((key) =>
        renderSection(city[key], key, city, locale)
      )}

      <SiteCta
        locale={locale}
        siteUrl={siteUrl}
        countrySlug={country.slug}
        citySlug={city.slug}
      />

      <PageFooterBar
        locale={locale}
        cityName={city.name[locale]}
        siteUrl={siteUrl}
        countrySlug={country.slug}
        citySlug={city.slug}
      />
    </Page>
  );
}

function CoverPage({
  city,
  country,
  siteUrl,
}: {
  city: CityContent;
  country: CountryMeta;
  siteUrl: string;
}) {
  const host = pdfSiteLabel(siteUrl);
  const ruUrl = cityPageUrl(siteUrl, "ru", country.slug, city.slug);
  const enUrl = cityPageUrl(siteUrl, "en", country.slug, city.slug);

  return (
    <Page size="A4" style={styles.coverPage}>
      <View style={styles.coverTopBand}>
        <Text style={styles.coverBrand}>{PDF_BRAND.name.ru}</Text>
        <Text style={styles.coverBrandTag}>{PDF_BRAND.tagline.ru}</Text>
      </View>

      <View style={styles.coverBody}>
        <Text style={styles.coverCountry}>{country.name.ru} · Vietnam</Text>
        <Text style={styles.coverCityRu}>{city.name.ru}</Text>
        <Text style={styles.coverCityEn}>{city.name.en}</Text>
        <View style={styles.coverDivider} />
        <Text style={styles.coverDesc}>
          Практический оффлайн-гид: транспорт, районы, еда, пляжи, безопасность
          и лайфхаки.{"\n"}
          Practical offline guide: transport, districts, food, beaches, safety
          and tips.
        </Text>
        <Link src={ruUrl} style={styles.coverSite}>
          {host}/ru/{country.slug}/{city.slug}
        </Link>
      </View>

      <View style={styles.coverFooter}>
        <Text style={styles.coverFooterText}>
          {PDF_BRAND.name.en} · {PDF_BRAND.tagline.en}
          {"\n"}
          <Link src={enUrl} style={{ color: "#ffedd5" }}>
            {host}/en/{country.slug}/{city.slug}
          </Link>
          {"\n\n"}
          {t("ru", "Скачано с", "Downloaded from")} {host} ·{" "}
          {new Date().toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
      </View>
    </Page>
  );
}

function BackCoverPage({
  locale,
  siteUrl,
  countrySlug,
  citySlug,
}: {
  locale: Locale;
  siteUrl: string;
  countrySlug: string;
  citySlug: string;
}) {
  const url = cityPageUrl(siteUrl, locale, countrySlug, citySlug);

  return (
    <Page size="A4" style={styles.backPage}>
      <Text style={styles.backBrand}>{PDF_BRAND.name[locale]}</Text>
      <Text style={styles.backTag}>{PDF_BRAND.tagline[locale]}</Text>
      {PDF_BRAND.features[locale].map((line) => (
        <Text key={line} style={styles.backFeature}>
          ✓ {line}
        </Text>
      ))}
      <Link src={url} style={styles.backLink}>
        {url}
      </Link>
      <Text style={styles.backMuted}>
        {t(
          locale,
          "Этот PDF — оффлайн-версия путеводителя. На сайте доступны карта, AI-чат и обновления контента.",
          "This PDF is the offline edition. Visit the website for the map, AI chat, and content updates."
        )}
      </Text>
    </Page>
  );
}

export function CityPdfDocument({
  city,
  country,
  siteUrl,
}: {
  city: CityContent;
  country: CountryMeta;
  siteUrl: string;
}) {
  const host = pdfSiteLabel(siteUrl);

  return (
    <Document
      title={`${city.name.ru} / ${city.name.en} — ${PDF_BRAND.name.en}`}
      author={PDF_BRAND.name.en}
      subject={`${city.name.en}, ${country.name.en} — travel guide`}
      keywords={`${city.slug}, ${country.slug}, travel, vietnam, ${host}`}
    >
      <CoverPage city={city} country={country} siteUrl={siteUrl} />

      <CityIntroPage
        city={city}
        locale="ru"
        country={country}
        siteUrl={siteUrl}
      />
      <CityContentPages
        city={city}
        locale="ru"
        country={country}
        siteUrl={siteUrl}
      />

      <CityIntroPage
        city={city}
        locale="en"
        country={country}
        siteUrl={siteUrl}
      />
      <CityContentPages
        city={city}
        locale="en"
        country={country}
        siteUrl={siteUrl}
      />

      <BackCoverPage
        locale="ru"
        siteUrl={siteUrl}
        countrySlug={country.slug}
        citySlug={city.slug}
      />
    </Document>
  );
}
