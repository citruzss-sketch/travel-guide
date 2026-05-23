export const AI_MODES = [
  "guide",
  "plan",
  "food",
  "logistics",
  "safety",
  "sos",
] as const;

export type AIMode = (typeof AI_MODES)[number];

export const TRAVEL_PROFILES = [
  "any",
  "family",
  "couple",
  "budget",
  "active",
] as const;

export type TravelProfile = (typeof TRAVEL_PROFILES)[number];

export interface PlaceContext {
  title: string;
  section?: string;
  description?: string;
}

const MODE_INSTRUCTIONS: Record<AIMode, string> = {
  guide: `MODE: General city expert.
Answer travel questions with concrete places, prices, and practical tips. Maps links only for specific venues worth visiting.`,

  plan: `MODE: Trip planner.
Build realistic day-by-day itineraries (morning / afternoon / evening).
Include travel time between spots and rough budget in VND/USD.
Add Maps links only for the main stop of each time block (max 1 link per block), not every mention.
If user did not say how many days, ask once — or suggest a 1-day and 3-day option.
Format as numbered days with bullet points under each.`,

  food: `MODE: Food & places expert.
Focus on where to eat, what to order, price ranges, best time to go, and atmosphere.
Recommend specific venues from the guide first. Mention 1–2 dishes to try at each place.
Add ONE Maps link per restaurant you recommend (after the address), not after every sentence.`,

  logistics: `MODE: Transport & money expert.
Focus on airport/train transfers, Grab/taxi prices, SIM cards, ATMs, exchange, hotel areas, and practical arrival steps.
Give step-by-step instructions with prices in VND.
**Rentals:** always explain electric bike (xe điện, no license, slower, city/beach) vs petrol scooter (license legally required, longer range). Mention deposit habits, helmet, photo bike before ride, fuel «Xăng» for petrol.
Maps link only for airport/station/hotel area if helpful — skip links for SIM, ATM, or general tips.`,

  safety: `MODE: Safety & communication expert.
Focus on common scams, what to avoid, emergency numbers, useful Vietnamese phrases (with pronunciation hint), and first-24-hours checklist.
Do NOT add Google Maps links unless the user asks for a specific place. No maps for phrases, scams, or general advice.`,

  sos: `MODE: SOS / EMERGENCY (urgent).
The user may need help NOW. Structure every reply as:
1) **Сейчас (3 шага)** — what to do in the next 15–30 minutes
2) **Номера** — 113 police, 115 ambulance, 114 fire (Vietnam)
3) **Фразы** — 2–3 Vietnamese phrases with simple pronunciation
4) **Не делай** — one common mistake to avoid
Stay calm, short blocks, no filler. Maps link ONLY if user needs a hospital/police station address.
For xe điện (e-bike): no license; petrol scooter — mention IDP honestly. For SIM: Viettel official store.`,
};

const PROFILE_INSTRUCTIONS: Record<TravelProfile, string> = {
  any: "",
  family: `TRAVELER PROFILE: Family with children.
Prefer kid-friendly, safe, not too loud places; mention shade, restrooms, and realistic timing with kids.`,
  couple: `TRAVELER PROFILE: Couple / romantic trip.
Prefer scenic, quieter, special-occasion spots; sunset views and relaxed pace.`,
  budget: `TRAVELER PROFILE: Budget traveler.
Prioritize best value: street food, local transport, free/low-cost sights; give realistic daily spend.`,
  active: `TRAVELER PROFILE: Active / adventure traveler.
Prioritize diving, hiking, islands, sports, early starts; physical activity level when relevant.`,
};

export function getModeInstructions(mode: AIMode): string {
  return MODE_INSTRUCTIONS[mode] ?? MODE_INSTRUCTIONS.guide;
}

export function getProfileInstructions(profile: TravelProfile): string {
  return PROFILE_INSTRUCTIONS[profile] ?? "";
}

export function buildPlaceContextBlock(ctx: PlaceContext): string {
  const lines = [`The user opened chat while viewing this place in the guide:`];
  lines.push(`- Place: ${ctx.title}`);
  if (ctx.section) lines.push(`- Section: ${ctx.section}`);
  if (ctx.description) lines.push(`- Summary: ${ctx.description}`);
  lines.push(`Tailor your answer to this place unless the user asks something else.`);
  return lines.join("\n");
}

export function inferModeFromSection(sectionId?: string): AIMode {
  if (!sectionId) return "guide";
  if (["food", "markets"].includes(sectionId)) return "food";
  if (["airport", "transport", "districts"].includes(sectionId)) return "logistics";
  if (["scams", "safety", "phrases", "simAndInternet", "money"].includes(sectionId))
    return "safety";
  if (["sights", "beaches", "tours"].includes(sectionId)) return "plan";
  return "guide";
}
