import type { AIMode } from "@/lib/ai-modes";
import type { Locale } from "@/types/content";

type PromptSet = Record<AIMode, string[]>;
type CityPrompts = Record<Locale, PromptSet>;

const CITY_PROMPTS: Record<string, CityPrompts> = {
  "nha-trang": {
    en: {
      guide: [
        "What to see and do on day one?",
        "Best beach for swimming — Tran Phu or Bai Dai?",
        "What to do in the evening in Nha Trang?",
      ],
      plan: [
        "3-day itinerary for a couple",
        "1-day: best beach + top sights combo",
        "Family plan with kids — safe and fun spots",
      ],
      food: [
        "Best Bun Ca (fish noodle soup) spots?",
        "Top seafood restaurants on the waterfront?",
        "Cheap and tasty street food near the beach?",
      ],
      logistics: [
        "Airport to Tran Phu beach — Grab or taxi?",
        "Renting a scooter vs. using Grab — which is better?",
        "Where to exchange USD to VND in Nha Trang?",
      ],
      safety: [
        "Common beach scams to watch out for",
        "Is it safe to swim — jellyfish or currents?",
        "Safe areas to walk at night in Nha Trang",
      ],
      sos: [
        "I was overcharged by a taxi driver",
        "I'm lost and don't speak Vietnamese",
        "I need a doctor or clinic near the beach",
      ],
    },
    ru: {
      guide: [
        "Что посмотреть и сделать в первый день?",
        "Лучший пляж: Чан Фу или Бай Дай?",
        "Чем заняться вечером в Нячанге?",
      ],
      plan: [
        "Маршрут на 3 дня для пары",
        "1 день: лучший пляж + главные достопримечательности",
        "Семейный план с детьми — безопасно и интересно",
      ],
      food: [
        "Где поесть лучший Бун Ка (рыбный суп с лапшой)?",
        "Рестораны морепродуктов на набережной",
        "Дешёвая и вкусная уличная еда у пляжа",
      ],
      logistics: [
        "Из аэропорта до пляжа Чан Фу — Grab или такси?",
        "Аренда скутера или Grab — что лучше выбрать?",
        "Где обменять доллары на донги в Нячанге?",
      ],
      safety: [
        "Типичные мошенничества на пляже",
        "Безопасно ли купаться — медузы или течения?",
        "Безопасные районы для прогулок вечером",
      ],
      sos: [
        "Меня обсчитали в такси",
        "Я потерялся и не говорю по-вьетнамски",
        "Мне нужен врач или клиника рядом с пляжем",
      ],
    },
  },

  "da-nang": {
    en: {
      guide: [
        "Best neighbourhoods to stay in Da Nang?",
        "Marble Mountains or Ba Na Hills — which to pick?",
        "Evening on Dragon Bridge — what to know?",
      ],
      plan: [
        "2-day Da Nang + Hoi An combo itinerary",
        "1 day: My Khe beach + Marble Mountains",
        "Weekend trip for a couple — highlights only",
      ],
      food: [
        "Best Mi Quang (Da Nang rice noodle soup)?",
        "Top seafood spots near My Khe beach?",
        "Budget street food areas and local dishes?",
      ],
      logistics: [
        "Da Nang airport to the beach — best route?",
        "Grab taxi vs. motorbike rental in Da Nang?",
        "Getting to Hoi An from Da Nang — options & prices?",
      ],
      safety: [
        "Scams near Marble Mountains to avoid",
        "Is Da Nang safe to walk at night?",
        "Tips for renting a motorbike safely in Da Nang",
      ],
      sos: [
        "I had a motorbike accident — what to do?",
        "I was scammed and need help",
        "Emergency contacts and hospitals in Da Nang",
      ],
    },
    ru: {
      guide: [
        "Лучшие районы для проживания в Да Нанге?",
        "Мраморные горы или Ба На Хиллс — что выбрать?",
        "Вечер у Дракона-моста — что нужно знать?",
      ],
      plan: [
        "2 дня: Да Нанг + Хой Ан — комбо-маршрут",
        "1 день: пляж Ми Кхе + Мраморные горы",
        "Маршрут выходного дня для пары",
      ],
      food: [
        "Лучший суп Ми Куанг в Да Нанге?",
        "Рестораны морепродуктов у пляжа Ми Кхе",
        "Уличная еда и местные блюда — где поесть дёшево?",
      ],
      logistics: [
        "Из аэропорта Да Нанга до пляжа — лучший маршрут?",
        "Grab такси или аренда мотобайка в Да Нанге?",
        "Как добраться из Да Нанга в Хой Ан — варианты и цены?",
      ],
      safety: [
        "Мошенники у Мраморных гор — чего избегать",
        "Безопасно ли гулять ночью в Да Нанге?",
        "Советы по безопасной аренде мотобайка",
      ],
      sos: [
        "У меня авария на мотобайке — что делать?",
        "Меня обманули, нужна помощь",
        "Экстренные контакты и больницы в Да Нанге",
      ],
    },
  },
};

/**
 * Returns city-specific quick prompts for the given city, mode, and locale.
 * Returns an empty array if no city-specific prompts exist (caller should fall back to generic).
 */
export function getCityQuickPrompts(
  citySlug: string,
  mode: AIMode,
  locale: Locale
): string[] {
  return CITY_PROMPTS[citySlug]?.[locale]?.[mode] ?? [];
}
