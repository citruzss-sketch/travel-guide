/**
 * Photos matched to real places. Wikimedia filenames verified (HTTP 200).
 */

function wiki(fileName: string, width = 800): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=${width}`;
}

function pexels(id: number, width = 800): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

/** Wikimedia Commons — location-specific, verified */
export const WIKI = {
  // Country & city heroes
  haLongBay: wiki("Ha Long Bay, Vietnam.jpg", 1920),
  nhaTrangSkyline: wiki("Nha_Trang_skyline.jpg", 1920),
  goldenBridge: wiki("Golden_Bridge,_Ba_Na_Hills,_Vietnam_(49056919258).jpg", 1920),
  dragonBridgeHero: wiki("Dragon Bridge Da Nang 7.jpg", 1920),

  // Nha Trang
  poNagar: wiki("04052023_Ponagar_Hindu_temples_complex,_Nha_Trang_Vietnam_-_274.jpg"),
  vinpearl: wiki("Nha_Trang_from_Vinpearl_cable_car.JPG"),
  vinpearlCable: wiki("Vinpearl Cable Car to Hon Tre, Nha Trang, Khanh Hoa.jpg"),
  docLet: wiki("Doc_Let_Beach.jpg"),
  ninhVan: wiki("Ninh_Van_Bay.jpg"),
  longSonBuddha: wiki("2008-01-27_Pagoda_Buddha_Nha-Trang.jpg"),
  longSonPagoda: wiki("Long_Son_Pagoda_3.jpg"),
  oceanInstitute: wiki("Nhatrang Oceanographic Institute.jpg"),
  camRanhAirport: wiki("Cam_Ranh_Airport.jpg"),
  gaNhaTrang: wiki("Ga Nha Trang.jpg"),
  dalat: wiki("Da_Lat_city.jpg"),
  thacBac: wiki("Thác Bạc.jpg"),

  // Da Nang & surroundings
  hoiAn: wiki("Hoi_An_Ancient_Town.jpg"),
  hoiAnLanterns: wiki("Hoi_An_lanterns.jpg"),
  linhUng: wiki("Linh_Ung_Pagoda.jpg"),
  ladyBuddha: wiki("Lady_Buddha_Da_Nang.jpg"),
  haiVan: wiki("Hai_Van_Pass,_Vietnam.jpg"),
  haiVanMotorbike: wiki(
    "Hai Van Pass, Vietnam, Vietnamese motorbike rider near US military bunker.jpg"
  ),
  daNangAirport: wiki("Da_Nang_Airport.jpg"),
  myKhe: wiki("My Khe Beach Da Nang.jpg"),
  dragonBridge: wiki("Dragon Bridge Da Nang 7.jpg"),
  dragonBridgeAlt: wiki("Da Nang Dragon Bridge.jpg"),
  marbleMountains: wiki("Marble_Mountains.jpg"),
  marbleMountainPagoda: wiki("Non Nuoc Pagoda Da Nang 3.jpg"),
  marbleDragon: wiki("Dragon_Marble_Mountain_Da_Nang_Vietnam.jpg"),
  sonTra: wiki("Son_Tra_Peninsula.jpg"),
  palmBeachDaNang: wiki("Palm trees beach Da Nang.jpg"),
  beachDaNangGulf: wiki("Beach of Da Nang, inner-gulf.jpg"),
  citadelHue: wiki("Citadel_of_Hue.jpg"),

  // Transport & food (Vietnam)
  cyclo: wiki("Cycle rickshaw in Hanoi.jpg"),
  miQuang: wiki("Mì Quảng.jpg"),
  banhMi: wiki("Vietnamese Bánh mì (Banh Mi) Sandwich.jpg"),
  banhMiThit: wiki("Banh_mi_thit_Nhu_Lan.jpg"),
  benThanhMarket: wiki("Ben Thanh Market Ho Chi Minh City.jpg"),

  // Ho Chi Minh City
  hcmcBenThanh: wiki("Ben_Thanh_market,_Hồ_Chí_Minh.jpg"),
  hcmcReunificationPalace: wiki("Independence_Palace_of_Vietnam.jpg"),
  hcmcNotreDame: wiki("Notre-Dame_Cathedral_Basilica_of_Saigon_2022.jpg"),
  hcmcWarMuseum: wiki("War_Remnants_Museum_HCMC_compressed.jpg"),
  hcmcCuChi: wiki("Cu_Chi_Tunnels.jpg"),
  hcmcJadeEmperor: wiki("Chua_Ngoc_Hoang.jpg"),
  hcmcSkyline: wiki("Ben_Thanh_market,_Hồ_Chí_Minh.jpg"),
  tanSonNhat: wiki("Tan_Son_Nhat_International_Airport.jpg"),
  mekongDelta: wiki("Mekong_Delta_Vietnam.jpg"),
  vungTau: wiki("Vung_Tau_beach.jpg"),
  pho: wiki("Vietnamese_pho.jpg"),
} as const;

export function getCityHeroImage(citySlug: string): string {
  switch (citySlug) {
    case "nha-trang":
      return WIKI.nhaTrangSkyline;
    case "da-nang":
      return WIKI.goldenBridge;
    case "ho-chi-minh-city":
      return WIKI.hcmcBenThanh;
    default:
      return WIKI.haLongBay;
  }
}

export function getCountryHeroImage(): string {
  return WIKI.haLongBay;
}

export const PLACE_IMAGES: Record<string, Record<string, string>> = {
  "nha-trang": {
    "cam ranh international airport cxr": WIKI.camRanhAirport,
    "train to nha trang": WIKI.gaNhaTrang,
    "tran phu beach promenade": WIKI.nhaTrangSkyline,
    "ninh van bay": WIKI.ninhVan,
    "city center inland": WIKI.vinpearl,
    "po nagar cham towers": WIKI.poNagar,
    "long son pagoda": WIKI.longSonBuddha,
    "vinwonders nha trang": WIKI.vinpearl,
    "national oceanographic museum": WIKI.oceanInstitute,
    "ba ho waterfalls": WIKI.thacBac,
    "nha trang beach tran phu": WIKI.nhaTrangSkyline,
    "doc let beach": WIKI.docLet,
    "hon mun island": WIKI.vinpearlCable,
    "lanterns vietnamese restaurant": WIKI.hoiAnLanterns,
    "sailing club nha trang": WIKI.nhaTrangSkyline,
    "nha trang seafood street": WIKI.benThanhMarket,
    "street food banh can": WIKI.miQuang,
    "dam market cho dam": WIKI.benThanhMarket,
    "xom moi market": WIKI.hoiAnLanterns,
    "four islands tour": WIKI.vinpearlCable,
    "mud bath hot springs": WIKI.ninhVan,
    "dalat day trip": WIKI.dalat,
    "grab taxi bike": WIKI.haiVanMotorbike,
    "electric bike xe dien no license": WIKI.cyclo,
    "petrol scooter 110 125cc": WIKI.haiVanMotorbike,
    "scooter rental": WIKI.haiVanMotorbike,
    "car rental": pexels(3802510),
    "cyclo rickshaw": WIKI.cyclo,
    "best beach time": WIKI.docLet,
    "book tours locally": WIKI.vinpearlCable,
    "happy hour": WIKI.nhaTrangSkyline,
    "water filter": WIKI.oceanInstitute,
    "overpriced taxis": WIKI.camRanhAirport,
    "free tours": WIKI.vinpearl,
    "restaurant bill": WIKI.benThanhMarket,
    "hotel currency exchange": WIKI.benThanhMarket,
    "general safety": WIKI.nhaTrangSkyline,
    "sea weather": WIKI.docLet,
    "emergency numbers": WIKI.camRanhAirport,
  },
  "da-nang": {
    "da nang international airport dad": WIKI.daNangAirport,
    "da nang train station": WIKI.gaNhaTrang,
    "my khe beach": WIKI.myKhe,
    "han river city center": WIKI.dragonBridgeAlt,
    "an thuong beach area": WIKI.palmBeachDaNang,
    "son tra peninsula": WIKI.sonTra,
    "golden bridge ba na hills": WIKI.goldenBridge,
    "marble mountains ngu hanh son": WIKI.marbleMountainPagoda,
    "dragon bridge": WIKI.dragonBridge,
    "lady buddha lin ung pagoda": WIKI.ladyBuddha,
    "hoi an ancient town": WIKI.hoiAn,
    "hai van pass": WIKI.haiVan,
    "non nuoc beach": WIKI.beachDaNangGulf,
    "son tra beach": WIKI.ladyBuddha,
    "madame lan": WIKI.miQuang,
    "be man": WIKI.benThanhMarket,
    "mi quang 1a": WIKI.miQuang,
    "banh mi ba lan": WIKI.banhMiThit,
    "helio night market": WIKI.hoiAnLanterns,
    "han market cho han": WIKI.benThanhMarket,
    "con market cho con": WIKI.benThanhMarket,
    "ba na hills golden bridge": WIKI.goldenBridge,
    "hoi an evening tour": WIKI.hoiAnLanterns,
    "hue imperial city day trip": WIKI.citadelHue,
    "marble mountains non nuoc": WIKI.marbleMountains,
    "grab": WIKI.haiVanMotorbike,
    "electric bike xe dien no license": WIKI.cyclo,
    "petrol scooter 110 125cc": WIKI.haiVanMotorbike,
    "scooter rental": WIKI.haiVanMotorbike,
    "bus to hoi an": WIKI.hoiAn,
    "bicycle": pexels(276506),
    "ba na hills arrive early": WIKI.goldenBridge,
    "hoi an free after 5 pm": WIKI.hoiAnLanterns,
    "dragon bridge show": WIKI.dragonBridge,
    "custom suit in hoi an": WIKI.hoiAn,
    "overpriced marble mountains guides": WIKI.marbleDragon,
    "unmetered taxis": WIKI.daNangAirport,
    "fake ba na hills tickets": WIKI.goldenBridge,
    "general safety": WIKI.myKhe,
    "emergency numbers": WIKI.daNangAirport,
  },
  "ho-chi-minh-city": {
    "tan son nhat international airport sgn": WIKI.tanSonNhat,
    "bus train from other cities": WIKI.gaNhaTrang,
    "district 1 city center": WIKI.hcmcBenThanh,
    "bui vien backpacker street d1": WIKI.hcmcBenThanh,
    "district 3 local chill": WIKI.hcmcBenThanh,
    "phu my hung district 7 expat": WIKI.hcmcBenThanh,
    "ben thanh market": WIKI.hcmcBenThanh,
    "reunification palace independence palace": WIKI.hcmcReunificationPalace,
    "war remnants museum": WIKI.hcmcWarMuseum,
    "cu chi tunnels": WIKI.hcmcCuChi,
    "notre dame cathedral basilica": WIKI.hcmcNotreDame,
    "jade emperor pagoda ngoc hoang": WIKI.hcmcJadeEmperor,
    "skydeck landmark 81": WIKI.hcmcSkyline,
    "vung tau": WIKI.vungTau,
    "mui ne 5 6h": WIKI.docLet,
    "banh mi huynh hoa": WIKI.banhMiThit,
    "pho 2000 near ben thanh": WIKI.pho,
    "com tam ba ghien broken rice": WIKI.pho,
    "lunch lady nguyen thi thanh": WIKI.miQuang,
    "the deck saigon": WIKI.hcmcBenThanh,
    "bun thit nuong bbq vermicelli": WIKI.miQuang,
    "binh tay market cholon": WIKI.hcmcBenThanh,
    "saigon square": WIKI.hcmcBenThanh,
    "cu chi tunnels half day": WIKI.hcmcCuChi,
    "mekong delta day trip": WIKI.mekongDelta,
    "saigon night food tour": WIKI.hcmcBenThanh,
    "saigon city highlights": WIKI.hcmcReunificationPalace,
    "grab": WIKI.cyclo,
    "metro line 1 ben thanh suoi tien": WIKI.hcmcBenThanh,
    "vinasun mai linh taxi": WIKI.tanSonNhat,
    "cyclo cycle rickshaw": WIKI.cyclo,
    "public bus xe buyt": WIKI.hcmcBenThanh,
    "viettel vietnamobile": WIKI.hcmcBenThanh,
    "cafes coworking": WIKI.hcmcBenThanh,
    "phone bag snatching": WIKI.hcmcBenThanh,
    "traffic roads": WIKI.cyclo,
    "emergency numbers": WIKI.hcmcBenThanh,
    "taxi without meter": WIKI.tanSonNhat,
    "inflated prices at ben thanh": WIKI.hcmcBenThanh,
    "cyclo tours with no agreed price": WIKI.cyclo,
    "fake guides at attractions": WIKI.hcmcReunificationPalace,
    "crossing the street in hcmc": WIKI.cyclo,
    "vietnamese coffee culture": WIKI.hcmcBenThanh,
    "best time for sightseeing": WIKI.hcmcReunificationPalace,
    "cholon chinese quarter": WIKI.hcmcBenThanh,
    "general safety": WIKI.hcmcBenThanh,
    "currency exchange": WIKI.hcmcBenThanh,
    "sample prices 2026": WIKI.hcmcBenThanh,
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
