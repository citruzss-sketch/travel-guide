import type { ContentItem } from "@/types/content";

export interface KnownPlace {
  id: string;
  names: string[];
  lat: number;
  lng: number;
  address?: string;
  /** Verified full Google Maps URL — opens place card with photos/reviews */
  mapsUrl?: string;
  /** Google feature id, e.g. 0x31706746be30cbc5:0x46e8caa70c1f5d42 */
  featureId?: string;
  /** Google Knowledge Graph id, e.g. /g/1tdzcgq1 */
  kgId?: string;
  placeId?: string;
}

/** Build URL that opens the Google Maps place card (not empty search) */
export function googleMapsFeatureUrl(place: Pick<KnownPlace, "names" | "lat" | "lng" | "featureId" | "kgId">): string {
  const name = place.names[0];
  const { lat, lng, featureId, kgId } = place;
  let url = `https://www.google.com/maps/place/${encodeURIComponent(name)}/@${lat},${lng},17z/data=!4m6!3m5!1s${featureId}!8m2!3d${lat}!4d${lng}`;
  if (kgId) url += `!16s${encodeURIComponent(kgId)}`;
  return url;
}

export function googleMapsPlaceIdUrl(placeId: string): string {
  return `https://www.google.com/maps/search/?api=1&query=place&query_place_id=${placeId}`;
}

export function googleMapsUrlForKnownPlace(place: KnownPlace): string {
  if (place.mapsUrl) return place.mapsUrl;
  if (place.placeId) return googleMapsPlaceIdUrl(place.placeId);
  if (place.featureId) return googleMapsFeatureUrl(place);
  const label = place.address ? `${place.names[0]}, ${place.address}` : place.names[0];
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(label)}`;
}

export function googleMapsUrlForPlace(
  item: Pick<ContentItem, "title" | "address" | "coordinates" | "googlePlaceId">,
  cityName: string,
  locale: "ru" | "en" = "en"
): string {
  if (item.googlePlaceId) return googleMapsPlaceIdUrl(item.googlePlaceId);

  const title = item.title[locale];
  const address = item.address?.[locale];
  const query = address ? `${title}, ${address}, ${cityName}, Vietnam` : `${title}, ${cityName}, Vietnam`;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function googleMapsLinkLabel(locale: string): string {
  return locale === "ru" ? "📍 Google Maps" : "📍 Google Maps";
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findPlaceByCoords(
  lat: number,
  lng: number,
  citySlug: string,
  tolerance = 0.003
): KnownPlace | null {
  const places = KNOWN_PLACES[citySlug] ?? [];
  let best: KnownPlace | null = null;
  let bestDist = Infinity;

  for (const place of places) {
    const dist = Math.hypot(place.lat - lat, place.lng - lng);
    if (dist <= tolerance && dist < bestDist) {
      best = place;
      bestDist = dist;
    }
  }

  return best;
}

export function resolveKnownPlace(query: string, citySlug: string): KnownPlace | null {
  const places = KNOWN_PLACES[citySlug] ?? [];
  const q = normalize(query);
  if (q === "") return null;

  let best: KnownPlace | null = null;
  let bestScore = 0;

  for (const place of places) {
    for (const name of place.names) {
      const n = normalize(name);
      if (q === n || q.includes(n) || n.includes(q)) {
        const score = n.length;
        if (score > bestScore) {
          best = place;
          bestScore = score;
        }
      }
    }
    if (place.address) {
      const a = normalize(place.address);
      if (q.includes(a) || a.includes(q)) {
        const score = a.length;
        if (score > bestScore) {
          best = place;
          bestScore = score;
        }
      }
    }
  }

  return best;
}

function upgradeMapsUrl(url: string, citySlug: string): string {
  const brokenCoords = url.match(
    /https:\/\/www\.google\.com\/maps\/place\/(?:[^/@]*\/)?@(-?\d+\.?\d*),(-?\d+\.?\d*)/i
  );
  if (brokenCoords) {
    const lat = parseFloat(brokenCoords[1]);
    const lng = parseFloat(brokenCoords[2]);
    if (!url.includes("1s0x")) {
      const byCoords = findPlaceByCoords(lat, lng, citySlug);
      if (byCoords) return googleMapsUrlForKnownPlace(byCoords);
    }
  }

  const searchMatch = url.match(
    /https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=([^)\]"'\s]+)/i
  );
  if (searchMatch) {
    const query = decodeURIComponent(searchMatch[1].replace(/\+/g, " "));
    const place = resolveKnownPlace(query, citySlug);
    if (place) return googleMapsUrlForKnownPlace(place);
  }

  return url;
}

/** Upgrade broken or generic Maps URLs to verified place-card links */
export function enrichMapsLinksInText(text: string, citySlug: string): string {
  return text.replace(
    /https:\/\/www\.google\.com\/maps\/[^\s)\]"']+/gi,
    (match) => upgradeMapsUrl(match, citySlug)
  );
}

/** Verified Google Maps URLs — open place card with photos, hours, reviews */
export const KNOWN_PLACES: Record<string, KnownPlace[]> = {
  "nha-trang": [
    {
      id: "yen-garden-bistro",
      names: ["Yen Garden Bistro", "Yen Garden", "Yen Garden Bistro Nha Trang"],
      lat: 12.2302509,
      lng: 109.1969144,
      address: "51/19/8 Tue Tinh, Loc Tho, Nha Trang",
      featureId: "0x3170671bf819a9bb:0x630b3d07dc6fa0ab",
      kgId: "/g/11mvn6phjl",
      mapsUrl:
        "https://www.google.com/maps/place/Yen+Garden+Bistro/@12.2302509,109.1969144,17z/data=!4m6!3m5!1s0x3170671bf819a9bb:0x630b3d07dc6fa0ab!8m2!3d12.2302509!4d109.1969144!16s%2Fg%2F11mvn6phjl",
    },
    {
      id: "sweet-secret",
      names: ["Sweet Secret", "Sweet Secret Nha Trang"],
      lat: 12.2402943,
      lng: 109.1940787,
      address: "35/97 Nguyen Thien Thuat, Loc Tho, Nha Trang",
      featureId: "0x317067049d65a5fb:0xfd569cea328d29ce",
      kgId: "/g/11mw8hcj0m",
      mapsUrl:
        "https://www.google.com/maps/place/Sweet+Secret/@12.2402943,109.1940787,17z/data=!4m6!3m5!1s0x317067049d65a5fb:0xfd569cea328d29ce!8m2!3d12.2402943!4d109.1940787!16s%2Fg%2F11mw8hcj0m",
    },
    {
      id: "lanterns",
      names: ["Lanterns Vietnamese Restaurant", "Lanterns", "Lanterns Restaurant"],
      lat: 12.2378816,
      lng: 109.1935681,
      address: "34/6 Nguyen Thien Thuat, Nha Trang",
      featureId: "0x3170676499eb5e65:0xe31f77a1ddecac1f",
      kgId: "/g/1thxsq7q",
      mapsUrl:
        "https://www.google.com/maps/place/Lanterns/@12.2378816,109.1935681,17z/data=!4m6!3m5!1s0x3170676499eb5e65:0xe31f77a1ddecac1f!8m2!3d12.2378816!4d109.1935681!16s%2Fg%2F1thxsq7q",
    },
    {
      id: "sailing-club",
      names: ["Sailing Club Nha Trang", "Sailing Club"],
      lat: 12.2340918,
      lng: 109.1980213,
      address: "72-74 Tran Phu, Nha Trang",
      featureId: "0x3170676518181f8b:0xb87e85ceb9dd568c",
      kgId: "/g/1tcwj14j",
      mapsUrl:
        "https://www.google.com/maps/place/Sailing+Club+Nha+Trang/@12.2340918,109.1980213,17z/data=!4m6!3m5!1s0x3170676518181f8b:0xb87e85ceb9dd568c!8m2!3d12.2340918!4d109.1980213!16s%2Fg%2F1tcwj14j",
    },
    {
      id: "louisiane-brewhouse",
      names: ["Louisiane Brewhouse", "Louisiane Nha Trang", "Louisiane", "Lousiane Brewhouse"],
      lat: 12.2310188,
      lng: 109.1988028,
      address: "Lo 29 Tran Phu, Loc Tho, Nha Trang",
      featureId: "0x31706746be30cbc5:0x46e8caa70c1f5d42",
      kgId: "/g/1tdzcgq1",
      mapsUrl:
        "https://www.google.com/maps/place/Louisiane+Brewhouse/@12.2310188,109.1988028,17z/data=!4m6!3m5!1s0x31706746be30cbc5:0x46e8caa70c1f5d42!8m2!3d12.2310188!4d109.1988028!16s%2Fg%2F1tdzcgq1",
    },
    {
      id: "po-nagar",
      names: ["Po Nagar Cham Towers", "Po Nagar", "Thap Po Nagar", "Ponagar"],
      lat: 12.2653665,
      lng: 109.1953678,
      featureId: "0x3170678c61b8f251:0x115f6f97f1af1d7c",
      kgId: "/m/02x5pgr",
      mapsUrl:
        "https://www.google.com/maps/place/Po+Nagar+Cham+Towers/@12.2653665,109.1953678,17z/data=!4m6!3m5!1s0x3170678c61b8f251:0x115f6f97f1af1d7c!8m2!3d12.2653665!4d109.1953678!16s%2Fm%2F02x5pgr",
    },
    {
      id: "ivegan-supershop",
      names: ["iVegan Supershop", "iVegan", "iVegan Supershop Nha Trang"],
      lat: 12.2404675,
      lng: 109.1949361,
      address: "92/20 Hung Vuong, Loc Tho, Nha Trang",
    },
    {
      id: "cxr-airport",
      names: ["Cam Ranh International Airport", "Cam Ranh Airport", "CXR"],
      lat: 11.998251,
      lng: 109.2173774,
    },
    {
      id: "long-son",
      names: ["Long Son Pagoda", "Chua Long Son"],
      lat: 12.2513064,
      lng: 109.1806381,
    },
    {
      id: "vinwonders",
      names: ["VinWonders Hon Tre", "VinWonders", "Vin Wonders Nha Trang"],
      lat: 12.2034861,
      lng: 109.2168274,
    },
    {
      id: "dam-market",
      names: ["Dam Market", "Cho Dam"],
      lat: 12.2549685,
      lng: 109.1917922,
    },
    {
      id: "train-station",
      names: ["Nha Trang Railway Station", "Nha Trang Station", "Train to Nha Trang"],
      lat: 12.2491,
      lng: 109.1843,
    },
    {
      id: "tran-phu-beach",
      names: ["Tran Phu Beach", "Nha Trang Beach", "Tran Phu"],
      lat: 12.2381,
      lng: 109.1963,
    },
    {
      id: "hon-mun",
      names: ["Hon Mun Island", "Hon Mun"],
      lat: 12.1667,
      lng: 109.2833,
    },
    {
      id: "seafood-street",
      names: ["Nha Trang Seafood Street", "Nguyen Thi Minh Khai seafood"],
      lat: 12.2482,
      lng: 109.1941,
    },
  ],
  "ho-chi-minh": [
    {
      id: "war-remnants-museum",
      names: ["War Remnants Museum", "Bao Tang Chung Tich Chien Tranh"],
      lat: 10.7794,
      lng: 106.6925,
      address: "28 Vo Van Tan, District 3, Ho Chi Minh City",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=War+Remnants+Museum+Ho+Chi+Minh+City",
    },
    {
      id: "reunification-palace",
      names: ["Reunification Palace", "Dinh Thong Nhat", "Independence Palace"],
      lat: 10.7765,
      lng: 106.6958,
      address: "135 Nam Ky Khoi Nghia, District 1, Ho Chi Minh City",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Reunification+Palace+Ho+Chi+Minh+City",
    },
    {
      id: "ben-thanh-market",
      names: ["Ben Thanh Market", "Cho Ben Thanh"],
      lat: 10.7726,
      lng: 106.6980,
      address: "Le Loi, District 1, Ho Chi Minh City",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Ben+Thanh+Market+Ho+Chi+Minh+City",
    },
    {
      id: "jade-emperor-pagoda",
      names: ["Jade Emperor Pagoda", "Phuoc Hai Tu", "Chua Ngoc Hoang"],
      lat: 10.7892,
      lng: 106.6911,
      address: "73 Mai Thi Luu, District 1, Ho Chi Minh City",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Jade+Emperor+Pagoda+Ho+Chi+Minh+City",
    },
    {
      id: "landmark-81",
      names: ["Landmark 81", "Landmark 81 Skydeck"],
      lat: 10.7949,
      lng: 106.7218,
      address: "720A Dien Bien Phu, Binh Thanh, Ho Chi Minh City",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Landmark+81+Ho+Chi+Minh+City",
    },
    {
      id: "pho-hoa-pasteur",
      names: ["Pho Hoa Pasteur", "Pho Hoa"],
      lat: 10.7785,
      lng: 106.6944,
      address: "260C Pasteur, District 3, Ho Chi Minh City",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Pho+Hoa+Pasteur+Ho+Chi+Minh+City",
    },
    {
      id: "banh-mi-huynh-hoa",
      names: ["Banh Mi Huynh Hoa", "Huynh Hoa"],
      lat: 10.7666,
      lng: 106.6946,
      address: "26 Le Thi Rieng, District 1, Ho Chi Minh City",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Banh+Mi+Huynh+Hoa+Ho+Chi+Minh+City",
    },
    {
      id: "the-workshop-coffee",
      names: ["The Workshop Coffee", "Workshop Coffee"],
      lat: 10.7776,
      lng: 106.7038,
      address: "27 Ngo Duc Ke, District 1, Ho Chi Minh City",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=The+Workshop+Coffee+Ho+Chi+Minh+City",
    },
    {
      id: "sgn-airport",
      names: ["Tan Son Nhat Airport", "SGN Airport", "Tan Son Nhat International Airport"],
      lat: 10.8188,
      lng: 106.6519,
    },
    {
      id: "bui-vien",
      names: ["Bui Vien Walking Street", "Bui Vien Street", "Bui Vien"],
      lat: 10.7668,
      lng: 106.6938,
      address: "Bui Vien, District 1, Ho Chi Minh City",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Bui+Vien+Walking+Street+Ho+Chi+Minh+City",
    },
    {
      id: "binh-tay-market",
      names: ["Binh Tay Market", "Cho Binh Tay", "Cholon Market"],
      lat: 10.7483,
      lng: 106.6495,
      address: "57 Thap Muoi, District 6, Ho Chi Minh City",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Binh+Tay+Market+Ho+Chi+Minh+City",
    },
    {
      id: "cu-chi-tunnels",
      names: ["Cu Chi Tunnels", "Ben Duoc Tunnels", "Ben Dinh Tunnels"],
      lat: 11.0782,
      lng: 106.4634,
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Cu+Chi+Tunnels+Vietnam",
    },
  ],
  "da-nang": [
    {
      id: "rainbowl-poke",
      names: ["Rainbowl Poke", "Rainbowl Poke Da Nang"],
      lat: 16.0398,
      lng: 108.2435,
      address: "95 Mai Thuc Lan, Ngu Hanh Son, Da Nang",
    },
    {
      id: "frumi",
      names: ["Frumi", "Frumi Da Nang"],
      lat: 16.0512,
      lng: 108.2435,
      address: "An Thuong 38, Da Nang",
    },
    {
      id: "dad-airport",
      names: ["Da Nang International Airport", "DAD Airport"],
      lat: 16.0439,
      lng: 108.199,
    },
    {
      id: "my-khe",
      names: ["My Khe Beach", "My Khe"],
      lat: 16.0471,
      lng: 108.2468,
    },
    {
      id: "marble-mountains",
      names: ["Marble Mountains", "Ngu Hanh Son"],
      lat: 15.9794,
      lng: 108.2614,
    },
    {
      id: "dragon-bridge",
      names: ["Dragon Bridge", "Cau Rong"],
      lat: 16.0614,
      lng: 108.2275,
    },
    {
      id: "ba-na",
      names: ["Ba Na Hills", "Golden Bridge", "Ba Na Hills Golden Bridge"],
      lat: 15.995,
      lng: 107.9892,
    },
    {
      id: "han-market",
      names: ["Han Market", "Cho Han"],
      lat: 16.0682,
      lng: 108.2231,
    },
    {
      id: "an-thuong",
      names: ["An Thuong", "An Thuong district"],
      lat: 16.0512,
      lng: 108.2435,
    },
    {
      id: "mi-quang-1a",
      names: ["Mi Quang 1A", "Mi Quang"],
      lat: 16.0628,
      lng: 108.2145,
    },
    {
      id: "madame-lan",
      names: ["Madame Lan", "Madame Lan Restaurant"],
      lat: 16.068,
      lng: 108.223,
    },
    {
      id: "be-man",
      names: ["Be Man", "Be Man seafood"],
      lat: 16.047,
      lng: 108.247,
    },
  ],
};
