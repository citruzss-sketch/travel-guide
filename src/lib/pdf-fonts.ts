import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Font } from "@react-pdf/renderer";

let registered = false;

function resolveFontPath(filename: string): string {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.join(moduleDir, "fonts", filename),
    path.join(process.cwd(), "src/lib/fonts", filename),
    path.join(process.cwd(), "public/fonts", filename),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  throw new Error(
    `PDF font "${filename}" not found. Install Noto Sans into src/lib/fonts.`
  );
}

export function registerPdfFonts() {
  if (registered) return;

  Font.register({
    family: "NotoSans",
    fonts: [
      { src: resolveFontPath("NotoSans-Regular.ttf"), fontWeight: 400 },
      { src: resolveFontPath("NotoSans-Bold.ttf"), fontWeight: 700 },
    ],
  });

  registered = true;
}
