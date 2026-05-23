import type { Locale } from "@/types/content";
import type { TravelProfile } from "@/lib/ai-modes";
import type { TripPlanItem } from "@/lib/trip-plan";

const PROFILE_HINT: Record<TravelProfile, { ru: string; en: string }> = {
  any: { ru: "", en: "" },
  family: {
    ru: "Профиль: семья с детьми — без спешки, тень, туалеты, безопасные места.",
    en: "Profile: family with kids — no rush, shade, restrooms, safe spots.",
  },
  couple: {
    ru: "Профиль: пара — романтика, закаты, спокойный темп.",
    en: "Profile: couple — scenic, sunsets, relaxed pace.",
  },
  budget: {
    ru: "Профиль: эконом — минимум трат, street food, GrabBike.",
    en: "Profile: budget — low cost, street food, GrabBike.",
  },
  active: {
    ru: "Профиль: активный отдых — больше движения, ранний старт.",
    en: "Profile: active — more movement, early start.",
  },
};

export function buildTripDayPrompt(
  locale: Locale,
  cityName: string,
  day: number,
  items: TripPlanItem[],
  profile: TravelProfile = "any"
): string {
  const ru = locale === "ru";
  const list = items.map((i) => `- ${i.title}`).join("\n");
  const hint = PROFILE_HINT[profile][locale === "ru" ? "ru" : "en"];

  if (ru) {
    return [
      `Собери оптимальный маршрут на **день ${day}** в ${cityName}.`,
      `Места из моего списка (обязательно включи все, можно добавить 1 перекус между ними):`,
      list,
      hint,
      `Формат: **Утро / День / Вечер** с временем, порядком посещения, временем в дороге (Grab ~цена), бюджетом в VND и 1 Maps-ссылкой на главную точку блока.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  return [
    `Build the best **day ${day}** itinerary in ${cityName}.`,
    `Places from my list (include all; you may add one food stop between them):`,
    list,
    hint,
    `Format: **Morning / Afternoon / Evening** with times, visit order, travel time (Grab ~price), VND budget, and 1 Maps link for the main stop per block.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}
