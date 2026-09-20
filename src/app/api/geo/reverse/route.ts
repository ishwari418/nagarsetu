import { NextResponse } from "next/server";
import { reverseGeocode, GeocodingError } from "@/lib/geocoding";
import { readSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!readSession()) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  try {
    return NextResponse.json(await reverseGeocode(lat, lon));
  } catch (e) {
    const message =
      e instanceof GeocodingError ? e.message : "The location service is unavailable right now.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
