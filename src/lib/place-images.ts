/**
 * Photos matched to real places. Wikimedia filenames verified (HTTP 200).
 * Unsplash/Pexels IDs chosen for location-specific or accurate category shots.
 */

function wiki(fileName: string, width = 800): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=${width}`;
}

function unsplash(id: string, width = 800): string {
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=80&auto=format&fit=crop`;
}

function pexels(id: number, width = 800): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

/** Wikimedia Commons — filenames verified (HTTP 200) */
const WIKI = {
  poNagar: wiki("04052023_Ponagar_Hindu_temples_complex,_Nha_Trang_Vietnam_-_274.jpg"),
  vinpearl: wiki("Nha_Trang_from_Vinpearl_cable_car.JPG"),
  goldenBridge: wiki("Golden_Bridge,_Ba_Na_Hills,_Vietnam_(49056919258).jpg"),
  hoiAn: wiki("Hoi_An_Ancient_Town.jpg"),
  ladyBuddha: wiki("Linh_Ung_Pagoda.jpg"),
  haiVan: wiki("Hai_Van_Pass,_Vietnam.jpg"),
  cyclo: wiki("Xich_lo_in_Vietnam.jpg"),
} as const;

const STOCK = {
  longSon: pexels(2671074),
  oceanMuseum: pexels(1287561),
  baHoWaterfall: pexels(3225517),
  tranPhu: unsplash("1559827260-dc66d52bef19"),
  docLet: unsplash("1507525428034-b723cf961d3e"),
  honMun: pexels(1032650),
  seafood: unsplash("1414235077428-338989a2e8c0"),
  streetFood: unsplash("1555939594-58d7cb561ad1"),
  nightMarket: unsplash("1552566626-52f8b828add9"),
  market: unsplash("1488459716781-31db52582fe9"),
  mudBath: unsplash("1571896349842-33c89424de2d"),
  dalat: unsplash("1583847261026-407d42d67c84"),
  airport: unsplash("1436491865332-7a61a109cc05"),
  train: pexels(2098427),
  grab: pexels(4480501),
  scooter: pexels(1632109),
  resort: pexels(338504),
  cityStreet: unsplash("1555396273-367ea4eb4db5"),
  aquarium: pexels(1287561),
  tropicalWaterfall: pexels(1764205),
  dragonBridge: pexels(33596438),
  marbleMountains: pexels(26780443),
  myKheDaNang: pexels(3749749),
} as const;

export const PLACE_IMAGES: Record<string, Record<string, string>> = {
  "nha-trang": {
    "cam ranh international airport cxr": STOCK.airport,
    "train to nha trang": STOCK.train,
    "tran phu beach promenade": STOCK.tranPhu,
    "ninh van bay": STOCK.resort,
    "city center inland": STOCK.cityStreet,
    "po nagar cham towers": WIKI.poNagar,
    "long son pagoda": STOCK.longSon,
    "vinwonders nha trang": WIKI.vinpearl,
    "national oceanographic museum": STOCK.oceanMuseum,
    "ba ho waterfalls": STOCK.baHoWaterfall,
    "nha trang beach tran phu": STOCK.tranPhu,
    "doc let beach": STOCK.docLet,
    "hon mun island": STOCK.honMun,
    "lanterns vietnamese restaurant": STOCK.streetFood,
    "sailing club nha trang": STOCK.tranPhu,
    "nha trang seafood street": STOCK.seafood,
    "street food banh can": STOCK.streetFood,
    "dam market cho dam": STOCK.market,
    "xom moi market": STOCK.nightMarket,
    "four islands tour": STOCK.honMun,
    "mud bath hot springs": STOCK.mudBath,
    "dalat day trip": STOCK.dalat,
    "grab taxi bike": STOCK.grab,
    "electric bike xe dien no license": STOCK.scooter,
    "petrol scooter 110 125cc": STOCK.scooter,
    "scooter rental": STOCK.scooter,
    "car rental": pexels(3802510),
    "cyclo rickshaw": WIKI.cyclo,
  },
  "da-nang": {
    "da nang international airport dad": STOCK.airport,
    "da nang train station": STOCK.train,
    "my khe beach": STOCK.myKheDaNang,
    "han river city center": STOCK.dragonBridge,
    "an thuong beach area": STOCK.myKheDaNang,
    "son tra peninsula": WIKI.ladyBuddha,
    "golden bridge ba na hills": WIKI.goldenBridge,
    "marble mountains ngu hanh son": STOCK.marbleMountains,
    "dragon bridge": STOCK.dragonBridge,
    "lady buddha lin ung pagoda": WIKI.ladyBuddha,
    "hoi an ancient town": WIKI.hoiAn,
    "hai van pass": WIKI.haiVan,
    "non nuoc beach": STOCK.myKheDaNang,
    "son tra beach": WIKI.ladyBuddha,
    "madame lan": STOCK.streetFood,
    "be man": STOCK.seafood,
    "mi quang 1a": STOCK.streetFood,
    "banh mi ba lan": unsplash("1551504734-5ee1c4a1479b"),
    "helio night market": STOCK.nightMarket,
    "han market cho han": STOCK.market,
    "con market cho con": STOCK.market,
    "ba na hills golden bridge": WIKI.goldenBridge,
    "hoi an evening tour": WIKI.hoiAn,
    "hue imperial city day trip": unsplash("1544551763-46a013bb70d5"),
    "marble mountains non nuoc": STOCK.marbleMountains,
    "grab": STOCK.grab,
    "electric bike xe dien no license": STOCK.scooter,
    "petrol scooter 110 125cc": STOCK.scooter,
    "scooter rental": STOCK.scooter,
    "bus to hoi an": WIKI.hoiAn,
    "bicycle": pexels(276506),
  },
};

export function normalizePlaceKey(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function lookupPlaceImage(citySlug: string, titleEn: string): string | null {
  const key = normalizePlaceKey(titleEn);
  const cityMap = PLACE_IMAGES[citySlug];
  if (!cityMap) return null;

  if (cityMap[key]) return cityMap[key];

  for (const [placeKey, url] of Object.entries(cityMap)) {
    if (key.includes(placeKey) || placeKey.includes(key)) return url;
  }

  return null;
}
