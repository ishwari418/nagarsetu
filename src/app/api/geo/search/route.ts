import { NextResponse } from "next/server";
import { searchPlaces, GeocodingError } from "@/lib/geocoding";
import { readSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!readSession()) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const q = new URL(request.url).searchParams.get("q") ?? "";

  try {
    return NextResponse.json({ results: await searchPlaces(q) });
  } catch (e) {
    const message =
      e instanceof GeocodingError ? e.message : "The location service is unavailable right now.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
