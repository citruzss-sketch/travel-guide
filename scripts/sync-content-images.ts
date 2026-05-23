/**
 * Sync content JSON "image" fields with place-images registry.
 * Run: npx tsx scripts/sync-content-images.ts
 */
import fs from "fs";
import path from "path";
import { CITY_SECTION_KEYS } from "../src/lib/city-sections";
import { getItemImage } from "../src/lib/travel-images";
import type { CityContent } from "../src/types/content";

const citiesDir = path.join(process.cwd(), "content/countries/vietnam/cities");

for (const file of fs.readdirSync(citiesDir)) {
  if (!file.endsWith(".json") || file.includes(".extras")) continue;

  const filePath = path.join(citiesDir, file);
  const city = JSON.parse(fs.readFileSync(filePath, "utf-8")) as CityContent;
  let updated = 0;

  for (const key of CITY_SECTION_KEYS) {
    const section = city[key];
    for (const item of section.items) {
      const next = getItemImage(city.slug, item.title.en, key);
      if (item.image !== next) {
        item.image = next;
        updated++;
      }
    }
  }

  if (updated > 0) {
    fs.writeFileSync(filePath, `${JSON.stringify(city, null, 2)}\n`, "utf-8");
    console.log(`${file}: updated ${updated} images`);
  } else {
    console.log(`${file}: no changes`);
  }
}
