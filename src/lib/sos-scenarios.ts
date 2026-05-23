import type { Locale } from "@/types/content";

export interface SOSScenario {
  id: string;
  icon: "passport" | "hospital" | "scam" | "sim" | "bike" | "police";
}

export const SOS_SCENARIOS: SOSScenario[] = [
  { id: "passport", icon: "passport" },
  { id: "hospital", icon: "hospital" },
  { id: "scam", icon: "scam" },
  { id: "sim", icon: "sim" },
  { id: "bike", icon: "bike" },
  { id: "police", icon: "police" },
];

export function getSOSPrompt(
  scenarioId: string,
  locale: Locale,
  cityName: string
): string {
  const ru = locale === "ru";
  const c = cityName;

  const prompts: Record<string, { ru: string; en: string }> = {
    passport: {
      ru: `SOS: потерял или украли паспорт в ${c}. Дай чеклист на ближайшие 24 часа: полиция, заявление, посольство, временные документы, что НЕ делать. Номера 113 и контакты. Короткие фразы на вьетнамском.`,
      en: `SOS: lost or stolen passport in ${c}. 24-hour checklist: police report, embassy, temp documents, what NOT to do. Emergency numbers and Vietnamese phrases.`,
    },
    hospital: {
      ru: `SOS: нужна срочная медпомощь / отравление / травма в ${c}. Куда ехать, как вызвать скорую (115), страховка, средняя цена приёма. Фразы для такси/Grab «больница срочно».`,
      en: `SOS: need urgent medical help / food poisoning / injury in ${c}. Where to go, ambulance (115), insurance, typical costs. Phrases for taxi/Grab "hospital urgent".`,
    },
    scam: {
      ru: `SOS: меня сейчас разводят в ${c} (такси, мотобайк, цена, «бесплатный» тур). Что сказать и сделать прямо сейчас, как безопасно уйти, нужно ли в полицию. Фразы «нет / дорого / стоп».`,
      en: `SOS: being scammed right now in ${c} (taxi, bike, price, "free" tour). What to say and do now, leave safely, police or not. Phrases: no / too expensive / stop.`,
    },
    sim: {
      ru: `SOS: SIM/internet не работает в ${c} после покупки. Пошаговая диагностика: APN, баланс, перерегистрация, куда вернуться в официальный магазин. Что сказать продавцу на вьетнамском.`,
      en: `SOS: SIM/internet not working in ${c} after purchase. Step-by-step: APN, balance, re-register, official store. What to tell the seller in Vietnamese.`,
    },
    bike: {
      ru: `SOS: авария или спор при аренде байка/электробайка (xe điện) в ${c}. Депозит, полиция, фото до аренды, страховка. Разница e-bike vs бензин если без прав. Что делать в первые 30 минут.`,
      en: `SOS: accident or rental dispute (e-bike xe điện or scooter) in ${c}. Deposit, police, photos, insurance. E-bike vs petrol if no license. First 30 minutes.`,
    },
    police: {
      ru: `SOS: остановила полиция / штраф / конфликт в ${c}. Как вести себя, какие документы показывать, типичные суммы, когда платить/не платить. Номер 113. Фразы на вьетнамском.`,
      en: `SOS: stopped by police / fine / conflict in ${c}. How to behave, documents, typical fines, pay or not. 113. Vietnamese phrases.`,
    },
  };

  const entry = prompts[scenarioId];
  if (!entry) return ru ? `SOS в ${c}: срочная помощь туристу.` : `SOS in ${c}: urgent tourist help.`;
  return ru ? entry.ru : entry.en;
}
