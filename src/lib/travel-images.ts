/** Semantic stock images — category fallbacks when no place-specific photo exists */

import { lookupPlaceImage } from "@/lib/place-images";

export function unsplash(id: string, width = 800): string {
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=80&auto=format&fit=crop`;
}

function pexels(id: number, width = 800): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

export const IMAGES = {
  airport: unsplash("1436491865332-7a61a109cc05"),
  train: pexels(2098427),
  beach: unsplash("1559827260-dc66d52bef19"),
  beachAlt: unsplash("1507525428034-b723cf961d3e"),
  resort: pexels(338504),
  cityStreet: unsplash("1555396273-367ea4eb4db5"),
  temple: unsplash("1544551763-46a013bb70d5"),
  pagoda: pexels(2671074),
  themePark: unsplash("1555881400-74d7acaacd8b"),
  museum: pexels(1287561),
  waterfall: pexels(3225517),
  island: pexels(1032650),
  restaurant: unsplash("1559339352-11d035aa65de"),
  seafood: unsplash("1414235077428-338989a2e8c0"),
  streetFood: unsplash("1555939594-58d7cb561ad1"),
  coffee: unsplash("1504674900247-0877df9cc836"),
  market: unsplash("1488459716781-31db52582fe9"),
  nightMarket: unsplash("1552566626-52f8b828add9"),
  tour: pexels(1032650),
  mudBath: unsplash("1571896349842-33c89424de2d"),
  goldenBridge: unsplash("1544551763-46a013bb70d5"),
  marble: pexels(26780443),
  bridge: unsplash("1544551763-46a013bb70d5"),
  hoiAn: unsplash("1528127269322-539801943592"),
  mountain: unsplash("1583847261026-407d42d67c84"),
  scooter: pexels(1632109),
  sim: pexels(442150),
  money: pexels(3943723),
  safety: unsplash("1504674900247-0877df9cc836"),
  phrase: unsplash("1555396273-367ea4eb4db5"),
  lifehack: unsplash("1507525428034-b723cf961d3e"),
  scam: unsplash("1555396273-367ea4eb4db5"),
  default: unsplash("1559827260-dc66d52bef19"),
  heroes: {
    vietnam: unsplash("1528127269322-539801943592", 1920),
    nhaTrang: unsplash("1559827260-dc66d52bef19", 1920),
    daNang: unsplash("1544551763-46a013bb70d5", 1920),
  },
} as const;

export const TRAVEL_IMAGES = { ...IMAGES, default: IMAGES.default };

/** Preferred image for a card: place registry → keyword rules → section default */
export function getItemImage(
  citySlug: string,
  titleEn: string,
  sectionKey?: string
): string {
  const place = lookupPlaceImage(citySlug, titleEn);
  if (place) return place;
  return resolveItemImage(titleEn, sectionKey);
}

export function resolveItemImage(titleEn: string, sectionKey?: string): string {
  const t = titleEn.toLowerCase();

  if (t.includes("airport") || t.includes("(cxr)") || t.includes("(dad)"))
    return IMAGES.airport;
  if (t.includes("train") || t.includes("station") || t.includes("railway"))
    return IMAGES.train;
  if (t.includes("golden bridge") || t.includes("bà nà") || t.includes("ba na"))
    return IMAGES.goldenBridge;
  if (t.includes("dragon bridge")) return IMAGES.bridge;
  if (t.includes("marble mountain")) return IMAGES.marble;
  if (t.includes("mud") || t.includes("hot spring") || t.includes("100 egg"))
    return IMAGES.mudBath;
  if (t.includes("waterfall") || t.includes("ba ho")) return IMAGES.waterfall;
  if (t.includes("museum") || t.includes("oceanographic")) return IMAGES.museum;
  if (t.includes("vinwonder") || t.includes("theme") || t.includes("fantasy"))
    return IMAGES.themePark;
  if (
    t.includes("tower") ||
    t.includes("pagoda") ||
    t.includes("temple") ||
    t.includes("cham") ||
    t.includes("lady buddha") ||
    t.includes("lin ung")
  )
    return IMAGES.pagoda;
  if (t.includes("hoi an") || t.includes("ancient town")) return IMAGES.hoiAn;
  if (t.includes("hue") || t.includes("imperial") || t.includes("hai van"))
    return IMAGES.mountain;
  if (t.includes("dalat")) return IMAGES.mountain;
  if (t.includes("island") || t.includes("hon ") || t.includes("snorkel"))
    return IMAGES.island;
  if (
    t.includes("beach") ||
    t.includes("tran phu") ||
    t.includes("my khe") ||
    t.includes("doc let")
  )
    return IMAGES.beach;
  if (t.includes("bay") || t.includes("resort") || t.includes("six senses") || t.includes("ninh van"))
    return IMAGES.resort;
  if (t.includes("city center") || t.includes("apartment") || t.includes("an thuong"))
    return IMAGES.cityStreet;
  if (t.includes("seafood") || t.includes("lobster") || t.includes("be man"))
    return IMAGES.seafood;
  if (t.includes("banh") || t.includes("mi quang") || t.includes("street food") || t.includes("banh mi"))
    return IMAGES.streetFood;
  if (t.includes("night market") || t.includes("helio")) return IMAGES.nightMarket;
  if (t.includes("market") || t.includes("cho ")) return IMAGES.market;
  if (t.includes("restaurant") || t.includes("club") || t.includes("lanterns") || t.includes("sailing"))
    return IMAGES.restaurant;
  if (t.includes("four island") || t.includes("tour") || t.includes("excursion") || t.includes("day trip"))
    return IMAGES.tour;
  if (
    t.includes("xe điện") ||
    t.includes("xe dien") ||
    t.includes("electric bike") ||
    t.includes("электро")
  )
    return IMAGES.scooter;
  if (
    t.includes("grab") ||
    t.includes("scooter") ||
    t.includes("moto") ||
    t.includes("bike") ||
    t.includes("cyclo") ||
    t.includes("bus") ||
    t.includes("car rental")
  )
    return IMAGES.scooter;
  if (t.includes("sim") || t.includes("internet") || t.includes("wifi") || t.includes("esim") || t.includes("coworking"))
    return IMAGES.sim;
  if (t.includes("exchange") || t.includes("atm") || t.includes("money") || t.includes("sample price"))
    return IMAGES.money;
  if (t.includes("emergency") || t.includes("safety") || t.includes("sea &") || t.includes("general"))
    return IMAGES.safety;
  if (t.includes("scam") || t.includes("warning") || t.includes("fake"))
    return IMAGES.scam;

  switch (sectionKey) {
    case "districts":
      return IMAGES.beach;
    case "airport":
      return IMAGES.airport;
    case "sights":
      return IMAGES.temple;
    case "beaches":
      return IMAGES.beach;
    case "food":
      return IMAGES.restaurant;
    case "markets":
      return IMAGES.market;
    case "tours":
      return IMAGES.tour;
    case "transport":
      return IMAGES.scooter;
    case "simAndInternet":
      return IMAGES.sim;
    case "money":
      return IMAGES.money;
    case "safety":
      return IMAGES.safety;
    case "phrases":
      return IMAGES.phrase;
    case "lifehacks":
      return IMAGES.lifehack;
    case "scams":
      return IMAGES.scam;
    default:
      return IMAGES.default;
  }
}

export function pickSectionImage(sectionKey: string, _index: number): string {
  return resolveItemImage("", sectionKey);
}
