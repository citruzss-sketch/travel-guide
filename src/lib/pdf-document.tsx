import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CityContent, CitySection, Locale } from "@/types/content";
import { CITY_SECTION_KEYS, type CitySectionKey } from "@/lib/content";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  coverTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 24,
  },
  langBadge: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginTop: 32,
    marginBottom: 16,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: "#ea580c",
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#ea580c",
  },
  itemTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 8,
    marginBottom: 4,
  },
  body: {
    fontSize: 10,
    marginBottom: 4,
    color: "#333",
  },
  price: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#c2410c",
    marginBottom: 4,
  },
  tip: {
    fontSize: 9,
    marginLeft: 8,
    color: "#555",
  },
  metaRow: {
    marginBottom: 6,
  },
  metaLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
});

function renderSection(section: CitySection, locale: Locale) {
  if (!section.items.length) return null;
  return (
    <View key={section.title[locale]} wrap={false}>
      <Text style={styles.sectionTitle}>{section.title[locale]}</Text>
      {section.items.map((item, i) => (
        <View key={`${item.title[locale]}-${i}`}>
          <Text style={styles.itemTitle}>{item.title[locale]}</Text>
          <Text style={styles.body}>{item.description[locale]}</Text>
          {item.price?.[locale] && (
            <Text style={styles.price}>{item.price[locale]}</Text>
          )}
          {item.tips?.[locale]?.map((tip, tipIndex) => (
            <Text key={tipIndex} style={styles.tip}>
              • {tip}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function CityLanguageSection({
  city,
  locale,
  label,
}: {
  city: CityContent;
  locale: Locale;
  label: string;
}) {
  const metaFields = [
    { label: locale === "ru" ? "Лучшее время" : "Best time", value: city.bestTime[locale] },
    { label: locale === "ru" ? "Валюта" : "Currency", value: city.currency[locale] },
    { label: locale === "ru" ? "Язык" : "Language", value: city.language[locale] },
    { label: locale === "ru" ? "Часовой пояс" : "Timezone", value: city.timezone[locale] },
  ];

  return (
    <Page size="A4" style={styles.page} wrap>
      <Text style={styles.langBadge}>{label}</Text>
      <Text style={styles.coverTitle}>{city.name[locale]}</Text>
      <Text style={styles.coverSubtitle}>{city.tagline[locale]}</Text>
      <Text style={styles.body}>{city.overview[locale]}</Text>

      {metaFields.map((field) => (
        <View key={field.label} style={styles.metaRow}>
          <Text style={styles.metaLabel}>{field.label}</Text>
          <Text style={styles.body}>{field.value}</Text>
        </View>
      ))}

      {CITY_SECTION_KEYS.map((key: CitySectionKey) =>
        renderSection(city[key], locale)
      )}
    </Page>
  );
}

export function CityPdfDocument({ city }: { city: CityContent }) {
  return (
    <Document
      title={`${city.name.en} / ${city.name.ru} — Travel Guide`}
      author="Online Travel Guide"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.coverTitle}>{city.name.ru}</Text>
        <Text style={styles.coverSubtitle}>{city.name.en}</Text>
        <Text style={styles.body}>
          Bilingual travel guide — Русский / English
        </Text>
      </Page>
      <CityLanguageSection city={city} locale="ru" label="Русский" />
      <CityLanguageSection city={city} locale="en" label="English" />
    </Document>
  );
}
