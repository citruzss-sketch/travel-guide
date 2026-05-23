import { renderToBuffer } from "@react-pdf/renderer";
import { getCity, getCountry } from "@/lib/content";
import { registerPdfFonts } from "@/lib/pdf-fonts";
import { CityPdfDocument } from "@/lib/pdf-document";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ country: string; city: string }> }
) {
  const { country: countrySlug, city: citySlug } = await params;
  const city = getCity(countrySlug, citySlug);
  const country = getCountry(countrySlug);

  if (!city || !country) {
    return new Response("City not found", { status: 404 });
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    new URL(request.url).origin;

  registerPdfFonts();
  const buffer = await renderToBuffer(
    <CityPdfDocument city={city} country={country} siteUrl={siteUrl} />
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${citySlug}-travel-guide.pdf"`,
      "Cache-Control": "no-store",
      "X-PDF-Fonts": "noto-sans-embedded",
      "X-PDF-Version": "3",
    },
  });
}
