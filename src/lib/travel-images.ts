/** Semantic stock images — category fallbacks when no place-specific photo exists */

import {
  lookupPlaceImage,
  WIKI,
  getCityHeroImage,
  getCountryHeroImage,
} from "@/lib/place-images";

export { getCityHeroImage, getCountryHeroImage };

export function unsplash(id: string, width = 800): string {
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=80&auto=format&fit=crop`;
}

function pexels(id: number, width = 800): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

export const IMAGES = {
  airport: WIKI.camRanhAirport,
  train: WIKI.gaNhaTrang,
  beach: WIKI.nhaTrangSkyline,
  beachAlt: WIKI.docLet,
  cityStreet: WIKI.vinpearl,
  temple: WIKI.poNagar,
  pagoda: WIKI.longSonBuddha,
  themePark: WIKI.vinpearl,
  museum: WIKI.oceanInstitute,
  waterfall: WIKI.thacBac,
  island: WIKI.vinpearlCable,
  restaurant: WIKI.miQuang,
  seafood: WIKI.benThanhMarket,
  streetFood: WIKI.miQuang,
  coffee: WIKI.banhMi,
  market: WIKI.benThanhMarket,
  nightMarket: WIKI.hoiAnLanterns,
  tour: WIKI.vinpearlCable,
  mudBath: WIKI.ninhVan,
  goldenBridge: WIKI.goldenBridge,
  marble: WIKI.marbleMountainPagoda,
  bridge: WIKI.dragonBridge,
  hoiAn: WIKI.hoiAn,
  mountain: WIKI.haiVan,
  scooter: WIKI.haiVanMotorbike,
  sim: pexels(442150),
  money: pexels(3943723),
  safety: WIKI.myKhe,
  phrase: WIKI.hoiAnLanterns,
  lifehack: WIKI.docLet,
  scam: WIKI.benThanhMarket,
  default: WIKI.nhaTrangSkyline,
  heroes: {
    vietnam: getCountryHeroImage(),
    nhaTrang: getCityHeroImage("nha-trang"),
    daNang: getCityHeroImage("da-nang"),
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
  return resolveItemImage(titleEn, sectionKey, citySlug);
}

export function resolveItemImage(
  titleEn: string,
  sectionKey?: string,
  citySlug?: string
): string {
  const t = titleEn.toLowerCase();

  if (t.includes("airport") || t.includes("(cxr)") || t.includes("(dad)"))
    return citySlug === "da-nang" ? WIKI.daNangAirport : WIKI.camRanhAirport;
  if (t.includes("train") || t.includes("station") || t.includes("railway"))
    return WIKI.gaNhaTrang;
  if (t.includes("golden bridge") || t.includes("bà nà") || t.includes("ba na"))
    return WIKI.goldenBridge;
  if (t.includes("dragon bridge")) return WIKI.dragonBridge;
  if (t.includes("marble mountain")) return WIKI.marbleMountainPagoda;
  if (t.includes("mud") || t.includes("hot spring") || t.includes("100 egg"))
    return WIKI.ninhVan;
  if (t.includes("waterfall") || t.includes("ba ho")) return WIKI.thacBac;
  if (t.includes("museum") || t.includes("oceanographic")) return WIKI.oceanInstitute;
  if (t.includes("vinwonder") || t.includes("theme") || t.includes("fantasy"))
    return WIKI.vinpearl;
  if (
    t.includes("tower") ||
    t.includes("pagoda") ||
    t.includes("temple") ||
    t.includes("cham") ||
    t.includes("lady buddha") ||
    t.includes("lin ung")
  )
    return t.includes("long son") ? WIKI.longSonBuddha : WIKI.poNagar;
  if (t.includes("hoi an") || t.includes("ancient town")) return WIKI.hoiAn;
  if (t.includes("hue") || t.includes("imperial") || t.includes("hai van"))
    return t.includes("hue") ? WIKI.citadelHue : WIKI.haiVan;
  if (t.includes("dalat")) return WIKI.dalat;
  if (t.includes("island") || t.includes("hon ") || t.includes("snorkel"))
    return WIKI.vinpearlCable;
  if (
    t.includes("beach") ||
    t.includes("tran phu") ||
    t.includes("my khe") ||
    t.includes("doc let")
  ) {
    if (t.includes("doc let")) return WIKI.docLet;
    if (t.includes("my khe") || citySlug === "da-nang") return WIKI.myKhe;
    return WIKI.nhaTrangSkyline;
  }
  if (t.includes("bay") || t.includes("resort") || t.includes("six senses") || t.includes("ninh van"))
    return WIKI.ninhVan;
  if (t.includes("city center") || t.includes("apartment") || t.includes("an thuong"))
    return citySlug === "da-nang" ? WIKI.dragonBridgeAlt : WIKI.vinpearl;
  if (t.includes("seafood") || t.includes("lobster") || t.includes("be man"))
    return WIKI.benThanhMarket;
  if (t.includes("banh") || t.includes("mi quang") || t.includes("street food") || t.includes("banh mi"))
    return t.includes("banh mi") ? WIKI.banhMiThit : WIKI.miQuang;
  if (t.includes("night market") || t.includes("helio")) return WIKI.hoiAnLanterns;
  if (t.includes("market") || t.includes("cho ")) return WIKI.benThanhMarket;
  if (t.includes("restaurant") || t.includes("club") || t.includes("lanterns") || t.includes("sailing"))
    return WIKI.miQuang;
  if (t.includes("four island") || t.includes("tour") || t.includes("excursion") || t.includes("day trip"))
    return WIKI.vinpearlCable;
  if (
    t.includes("xe điện") ||
    t.includes("xe dien") ||
    t.includes("electric bike") ||
    t.includes("электро")
  )
    return WIKI.cyclo;
  if (
    t.includes("grab") ||
    t.includes("scooter") ||
    t.includes("moto") ||
    t.includes("bike") ||
    t.includes("cyclo") ||
    t.includes("bus") ||
    t.includes("car rental")
  )
    return t.includes("cyclo") ? WIKI.cyclo : WIKI.haiVanMotorbike;
  if (t.includes("sim") || t.includes("internet") || t.includes("wifi") || t.includes("esim") || t.includes("coworking"))
    return IMAGES.sim;
  if (t.includes("exchange") || t.includes("atm") || t.includes("money") || t.includes("sample price"))
    return IMAGES.money;
  if (t.includes("emergency") || t.includes("safety") || t.includes("sea &") || t.includes("general"))
    return citySlug === "da-nang" ? WIKI.myKhe : WIKI.nhaTrangSkyline;
  if (t.includes("scam") || t.includes("warning") || t.includes("fake"))
    return WIKI.benThanhMarket;

  switch (sectionKey) {
    case "districts":
      return citySlug === "da-nang" ? WIKI.myKhe : WIKI.nhaTrangSkyline;
    case "airport":
      return citySlug === "da-nang" ? WIKI.daNangAirport : WIKI.camRanhAirport;
    case "sights":
      return citySlug === "da-nang" ? WIKI.goldenBridge : WIKI.poNagar;
    case "beaches":
      return citySlug === "da-nang" ? WIKI.myKhe : WIKI.docLet;
    case "food":
      return WIKI.miQuang;
    case "markets":
      return WIKI.benThanhMarket;
    case "tours":
      return WIKI.goldenBridge;
    case "transport":
      return WIKI.haiVanMotorbike;
    case "simAndInternet":
      return IMAGES.sim;
    case "money":
      return IMAGES.money;
    case "safety":
      return WIKI.myKhe;
    case "phrases":
      return WIKI.hoiAnLanterns;
    case "lifehacks":
      return WIKI.docLet;
    case "scams":
      return WIKI.benThanhMarket;
    default:
      return citySlug === "da-nang" ? WIKI.myKhe : WIKI.nhaTrangSkyline;
  }
}

export function pickSectionImage(sectionKey: string): string {
  return resolveItemImage("", sectionKey);
}
