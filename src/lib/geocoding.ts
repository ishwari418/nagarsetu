/**
 * Geocoding service. Isolated on purpose: swap the two functions below for a
 * different provider (MapMyIndia, Photon, a self-hosted Nominatim) without
 * touching any UI code.
 *
 * Default provider is OpenStreetMap Nominatim. It needs no API key, but its
 * usage policy requires an identifying User-Agent and at most ~1 request per
 * second, so every call goes through the server, never the browser.
 */

const BASE = process.env.GEOCODING_BASE_URL ?? "https://nominatim.openstreetmap.org";
const USER_AGENT = process.env.GEOCODING_USER_AGENT ?? "NagarSetu/1.0 (civic grievance platform)";
const COUNTRY_CODES = process.env.GEOCODING_COUNTRY_CODES ?? "in";

export type ResolvedPlace = {
  latitude: number;
  longitude: number;
  country: string | null;
  state: string | null;
  district: string | null;
  city: string | null;
  locality: string | null;
  ward: string | null;
  postcode: string | null;
  formattedAddress: string;
};

export class GeocodingError extends Error {}

const cache = new Map<string, ResolvedPlace>();
let lastCall = 0;

async function throttle() {
  const wait = 1100 - (Date.now() - lastCall);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCall = Date.now();
}

async function call(path: string) {
  await throttle();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { "User-Agent": USER_AGENT, "Accept-Language": "en" },
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) throw new GeocodingError(`Geocoding service returned ${res.status}`);
    return await res.json();
  } catch (e) {
    if (e instanceof GeocodingError) throw e;
    throw new GeocodingError("The location service could not be reached.");
  } finally {
    clearTimeout(timer);
  }
}

function shape(raw: any, lat: number, lon: number): ResolvedPlace {
  const a = raw?.address ?? {};
  return {
    latitude: lat,
    longitude: lon,
    country: a.country ?? null,
    state: a.state ?? a.region ?? null,
    district: a.state_district ?? a.district ?? a.county ?? null,
    city: a.city ?? a.town ?? a.village ?? a.municipality ?? a.hamlet ?? null,
    locality:
      a.suburb ?? a.neighbourhood ?? a.village ?? a.residential ?? a.road ?? a.city_district ?? null,
    ward: a.city_district ?? a.borough ?? null,
    postcode: a.postcode ?? null,
    formattedAddress: raw?.display_name ?? `${lat.toFixed(6)}, ${lon.toFixed(6)}`,
  };
}

/** Coordinates -> readable Indian address. */
export async function reverseGeocode(lat: number, lon: number): Promise<ResolvedPlace> {
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    throw new GeocodingError("Those coordinates are not valid.");
  }
  const key = `r:${lat.toFixed(5)},${lon.toFixed(5)}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const raw = await call(
    `/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
  );
  const place = shape(raw, lat, lon);
  cache.set(key, place);
  return place;
}

/** Free-text search -> candidate places (city, town, village, road, landmark). */
export async function searchPlaces(query: string, limit = 6): Promise<ResolvedPlace[]> {
  const q = query.trim();
  if (q.length < 3) return [];

  const raw = await call(
    `/search?format=jsonv2&q=${encodeURIComponent(q)}&countrycodes=${COUNTRY_CODES}&limit=${limit}&addressdetails=1`
  );
  if (!Array.isArray(raw)) return [];
  return raw.map((item: any) => shape(item, Number(item.lat), Number(item.lon)));
}
