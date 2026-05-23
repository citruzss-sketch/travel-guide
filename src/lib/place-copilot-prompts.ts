import type { Locale } from "@/types/content";

/** Three contextual quick prompts per place card (RU/EN). */
export function getCopilotPrompts(
  locale: Locale,
  cityName: string,
  placeTitle: string,
  sectionId?: string
): string[] {
  const ru = locale === "ru";
  const p = placeTitle;
  const c = cityName;

  switch (sectionId) {
    case "food":
    case "markets":
      return ru
        ? [
            `Что обязательно заказать в «${p}» и сколько это стоит?`,
            `В какое время лучше прийти в «${p}» и сколько занимает по времени?`,
            `Как добраться до «${p}» от центра ${c} (Grab, пешком)?`,
          ]
        : [
            `What should I order at ${p} and how much does it cost?`,
            `Best time to visit ${p} and how long to stay?`,
            `How to get to ${p} from ${c} center (Grab or walk)?`,
          ];
    case "beaches":
      return ru
        ? [
            `Подходит ли пляж «${p}» для купания сегодня и когда меньше людей?`,
            `Где рядом с «${p}» поесть недорого после пляжа?`,
            `Как добраться до «${p}» и есть ли шезлонги/душ?`,
          ]
        : [
            `Is ${p} good for swimming today and when is it least crowded?`,
            `Where to eat cheaply near ${p} after the beach?`,
            `How to get to ${p} and are there loungers/showers?`,
          ];
    case "sights":
    case "tours":
      return ru
        ? [
            `Сколько времени заложить на «${p}» и что не пропустить?`,
            `Сколько стоит вход/билет в «${p}» и как сэкономить?`,
            `Лучший порядок: «${p}» утром или вечером и как добраться?`,
          ]
        : [
            `How much time for ${p} and what not to miss?`,
            `Ticket price for ${p} and how to save money?`,
            `Visit ${p} morning or evening — and how to get there?`,
          ];
    case "airport":
    case "transport":
      return ru
        ? [
            `Пошагово: как из «${p}» добраться до центра ${c} с ценами?`,
            `Grab или такси до «${p}» — сколько ждать и типичные разводы?`,
            `Можно ли на электробайке (xe điện) доехать до «${p}» без прав?`,
          ]
        : [
            `Step-by-step: ${p} to ${c} center with prices?`,
            `Grab vs taxi to ${p} — wait time and common scams?`,
            `Can I reach ${p} on an e-bike (xe điện) without a license?`,
          ];
    case "districts":
      return ru
        ? [
            `Стоит ли жить в районе «${p}» в ${c} — плюсы и минусы?`,
            `Где рядом с «${p}» поесть и что посмотреть пешком?`,
            `Примерная цена Grab из «${p}» до пляжа и аэропорта?`,
          ]
        : [
            `Is ${p} a good area to stay in ${c} — pros and cons?`,
            `What to eat and see on foot near ${p}?`,
            `Typical Grab price from ${p} to beach and airport?`,
          ];
    case "scams":
    case "safety":
      return ru
        ? [
            `Как распознать схему «${p}» и что сказать, чтобы отказаться?`,
            `Что делать, если уже попал на «${p}» — пошагово?`,
            `Фраза на вьетнамском, чтобы вежливо уйти от «${p}»?`,
          ]
        : [
            `How to spot the "${p}" scam and what to say to refuse?`,
            `What to do if I already fell for "${p}" — step by step?`,
            `Vietnamese phrase to politely walk away from "${p}"?`,
          ];
    case "simAndInternet":
    case "money":
      return ru
        ? [
            `Пошагово: «${p}» в ${c} — где, документы, цена?`,
            `Типичные ошибки туристов с «${p}» и как их избежать?`,
            `«${p}» vs отель/аэропорт — где выгоднее и безопаснее?`,
          ]
        : [
            `Step-by-step: ${p} in ${c} — where, documents, price?`,
            `Common tourist mistakes with ${p} and how to avoid them?`,
            `${p} vs hotel/airport — where is cheaper and safer?`,
          ];
    case "phrases":
      return ru
        ? [
            `Когда именно использовать фразу «${p}» в ${c}?`,
            `Как произносится «${p}» и что ответят местные?`,
            `Ещё 2 похожие фразы для такси и рынка в ${c}?`,
          ]
        : [
            `When to use the phrase "${p}" in ${c}?`,
            `How to pronounce "${p}" and what locals might reply?`,
            `Two similar phrases for taxi and market in ${c}?`,
          ];
    case "lifehacks":
      return ru
        ? [
            `Как применить совет «${p}» в первый день в ${c}?`,
            `Сколько это сэкономит/упростит и где ошибаются туристы?`,
            `Что сделать до/после «${p}», чтобы сработало наверняка?`,
          ]
        : [
            `How to apply "${p}" on my first day in ${c}?`,
            `How much does it save and where do tourists go wrong?`,
            `What to do before/after "${p}" to make it work?`,
          ];
    default:
      return ru
        ? [
            `Расскажи подробнее про «${p}» в ${c} — цены и нюансы?`,
            `Стоит ли ехать в «${p}» с детьми / парой / без прав на байк?`,
            `Что рядом с «${p}» посмотреть или поесть за один заезд?`,
          ]
        : [
            `Tell me more about ${p} in ${c} — prices and local tips?`,
            `Is ${p} worth it with kids / as a couple / without a bike license?`,
            `What to see or eat nearby ${p} in one trip?`,
          ];
  }
}
