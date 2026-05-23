import fs from "fs";
import path from "path";

const IMAGES = {
  airport: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
  train: "https://images.unsplash.com/photo-1474487548417-781cbccd1b7c?w=800&q=80",
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  temple: "https://images.unsplash.com/photo-1528183429752-a97d0bf99f05?w=800&q=80",
  food: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
  market: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80",
  city: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
  resort: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
  bridge: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
  mountain: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
};

const SECTIONS = [
  "airport",
  "districts",
  "sights",
  "beaches",
  "food",
  "markets",
  "tours",
  "transport",
  "simAndInternet",
  "money",
  "safety",
  "phrases",
  "lifehacks",
  "scams",
];

function pickImage(item, section) {
  const t = `${item.title?.en ?? ""} ${item.title?.ru ?? ""}`.toLowerCase();
  if (section === "airport" || t.includes("airport")) return IMAGES.airport;
  if (section === "beaches" || t.includes("beach") || t.includes("пляж"))
    return IMAGES.beach;
  if (t.includes("train") || t.includes("поезд")) return IMAGES.train;
  if (t.includes("temple") || t.includes("pagoda") || t.includes("храм"))
    return IMAGES.temple;
  if (section === "food" || t.includes("restaurant") || t.includes("phở"))
    return IMAGES.food;
  if (section === "markets") return IMAGES.market;
  if (t.includes("bridge") || t.includes("мост")) return IMAGES.bridge;
  if (t.includes("mountain") || t.includes("marble") || t.includes("ba na"))
    return IMAGES.mountain;
  if (section === "districts") return IMAGES.resort;
  return IMAGES.city;
}

function patchFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  let added = 0;

  for (const section of SECTIONS) {
    const sec = data[section];
    if (!sec?.items) continue;
    sec.items.forEach((item, i) => {
      if (item.image) return;
      if (i < 3) {
        item.image = pickImage(item, section);
        added++;
      }
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
  console.log(`${path.basename(filePath)}: added ${added} images`);
}

const citiesDir = path.join(
  process.cwd(),
  "content/countries/vietnam/cities"
);
patchFile(path.join(citiesDir, "nha-trang.json"));
patchFile(path.join(citiesDir, "da-nang.json"));
