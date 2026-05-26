import type { AIMode } from "@/lib/ai-modes";

type ModePrompts = [string, string, string];
type CityModePrompts = Partial<Record<AIMode, ModePrompts>>;
type LocalizedCityPrompts = Partial<Record<"ru" | "en", CityModePrompts>>;

const CITY_PROMPTS: Record<string, LocalizedCityPrompts> = {
  "nha-trang": {
    en: {
      guide: [
        "Best beaches in Nha Trang?",
        "Island hopping — how to book?",
        "Best time to visit Nha Trang?",
      ],
      plan: [
        "2-day Nha Trang itinerary",
        "Day trip to Vinpearl Island",
        "Nha Trang with kids — plan",
      ],
      food: [
        "Best seafood restaurants in Nha Trang?",
        "Cheap local food near the beach?",
        "Night market tips",
      ],
      logistics: [
        "Cam Ranh Airport to city — options?",
        "How to rent a scooter here?",
        "Best SIM card in Vietnam?",
      ],
      safety: [
        "Common scams in Nha Trang?",
        "Is Nha Trang safe for solo travel?",
        "Beach safety — what to watch for?",
      ],
      sos: [
        "Being scammed on a boat tour",
        "Medical help near Tran Phu beach",
        "Scooter accident — what to do?",
      ],
    },
    ru: {
      guide: [
        "Лучшие пляжи Нячанга?",
        "Как съездить на острова?",
        "Когда лучше ехать в Нячанг?",
      ],
      plan: [
        "Маршрут на 2 дня в Нячанге",
        "Поездка на Vinpearl Island",
        "Нячанг с детьми — план",
      ],
      food: [
        "Лучшие рестораны морепродуктов?",
        "Дешёвая местная еда у пляжа?",
        "Ночной рынок — что попробовать?",
      ],
      logistics: [
        "Из аэропорта Камрань до центра",
        "Как арендовать скутер в Нячанге?",
        "Лучшая SIM-карта для Вьетнама?",
      ],
      safety: [
        "Популярные разводы в Нячанге?",
        "Нячанг безопасен для соло-путешественника?",
        "Безопасность на пляже — что важно?",
      ],
      sos: [
        "Развели на морской экскурсии",
        "Медицинская помощь у пляжа Чан Фу",
        "Авария на скутере — что делать?",
      ],
    },
  },

  "da-nang": {
    en: {
      guide: [
        "Best beaches near Da Nang?",
        "Day trip to Hoi An — how?",
        "Are Marble Mountains worth visiting?",
      ],
      plan: [
        "2 days: Da Nang + Hoi An plan",
        "Half-day hike at Marble Mountains",
        "Ba Na Hills — full day trip",
      ],
      food: [
        "Best mi quang noodle spots?",
        "Seafood on My Khe beach?",
        "Street food near Dragon Bridge?",
      ],
      logistics: [
        "Da Nang airport to city center?",
        "How to get from Da Nang to Hoi An?",
        "Renting a bike in Da Nang — tips",
      ],
      safety: [
        "Taxi scams at Da Nang airport?",
        "Safe swimming at My Khe beach?",
        "Tourist traps to avoid in Da Nang",
      ],
      sos: [
        "Accident near My Khe beach",
        "Medical help needed in Da Nang",
        "Overcharged at a restaurant here",
      ],
    },
    ru: {
      guide: [
        "Лучшие пляжи рядом с Дананом?",
        "Поездка в Хойан на день — как?",
        "Стоит ли ехать на Мраморные горы?",
      ],
      plan: [
        "2 дня: Дананг + Хойан",
        "Полдня на Мраморных горах",
        "Ba Na Hills — поездка на день",
      ],
      food: [
        "Лучшие заведения с ми куанг?",
        "Морепродукты на пляже My Khe?",
        "Уличная еда у Dragon Bridge?",
      ],
      logistics: [
        "Из аэропорта Дананга до центра",
        "Как добраться из Дананга в Хойан?",
        "Аренда байка в Дананге — советы",
      ],
      safety: [
        "Мошенники в такси у аэропорта?",
        "Безопасно ли купаться на My Khe?",
        "Туристические ловушки в Дананге",
      ],
      sos: [
        "Несчастный случай у пляжа My Khe",
        "Нужна медицинская помощь в Дананге",
        "Обсчитали в ресторане Дананга",
      ],
    },
  },

  "ho-chi-minh": {
    en: {
      guide: [
        "Best districts to explore in Saigon?",
        "Top things to do in Ho Chi Minh City?",
        "War Remnants Museum — worth it?",
      ],
      plan: [
        "2-day Ho Chi Minh City itinerary",
        "Day trip from HCMC to Mekong Delta",
        "Saigon highlights in one day",
      ],
      food: [
        "Best street food near Ben Thanh?",
        "Where to find the best pho in Saigon?",
        "Rooftop restaurants in District 1?",
      ],
      logistics: [
        "Tan Son Nhat airport to city center?",
        "Is Grab reliable in Saigon?",
        "How to get around Ho Chi Minh City?",
      ],
      safety: [
        "Scams to watch for in HCMC?",
        "Is Ho Chi Minh City safe at night?",
        "Motorbike snatch theft — how to avoid?",
      ],
      sos: [
        "Phone snatched by a motorbike rider",
        "Medical help needed in District 1",
        "Being scammed by a street vendor",
      ],
    },
    ru: {
      guide: [
        "Лучшие районы Сайгона для прогулок?",
        "Главные достопримечательности Хошимина?",
        "Музей войны — стоит посетить?",
      ],
      plan: [
        "Маршрут на 2 дня в Хошимине",
        "Поездка из Хошимина в дельту Меконга",
        "Сайгон за один день",
      ],
      food: [
        "Лучшая уличная еда у рынка Бен Тхань?",
        "Где попробовать лучшее фо в Сайгоне?",
        "Рестораны на крышах в Районе 1?",
      ],
      logistics: [
        "Из аэропорта Тан Сон Нят до центра",
        "Grab в Сайгоне — надёжно ли?",
        "Как передвигаться по Хошимину?",
      ],
      safety: [
        "Схемы обмана в Хошимине?",
        "Хошимин ночью — безопасно?",
        "Как не стать жертвой мотоциклистов-воров?",
      ],
      sos: [
        "Мотоциклист вырвал телефон",
        "Нужна медицинская помощь в Районе 1",
        "Обманул уличный торговец",
      ],
    },
  },
};

/**
 * Returns city-specific quick prompts for the given city, mode, and locale.
 * Returns null if no city-specific prompts are configured — caller should
 * fall back to generic i18n prompts.
 */
export function getCityQuickPrompts(
  citySlug: string,
  mode: AIMode,
  locale: "ru" | "en"
): string[] | null {
  const city = CITY_PROMPTS[citySlug];
  if (!city) return null;
  const localePrompts = city[locale] ?? city["en"];
  if (!localePrompts) return null;
  const modePrompts = localePrompts[mode];
  if (!modePrompts) return null;
  return [...modePrompts];
}
