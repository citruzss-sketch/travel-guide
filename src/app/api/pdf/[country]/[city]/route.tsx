import { renderToBuffer } from "@react-pdf/renderer";
import { getCity } from "@/lib/content";
import { CityPdfDocument } from "@/lib/pdf-document";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ country: string; city: string }> }
) {
  const { country, city: citySlug } = await params;
  const city = getCity(country, citySlug);

  if (!city) {
    return new Response("City not found", { status: 404 });
  }

  const buffer = await renderToBuffer(<CityPdfDocument city={city} />);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${citySlug}-travel-guide.pdf"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
