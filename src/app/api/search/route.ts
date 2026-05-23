import { NextRequest, NextResponse } from "next/server";
import { searchDestinations } from "@/lib/content";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const results = searchDestinations(q);
  return NextResponse.json({ results });
}
