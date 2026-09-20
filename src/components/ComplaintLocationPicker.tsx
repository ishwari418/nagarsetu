"use client";

import { useState } from "react";
import { LazyMap } from "@/components/map/LazyMap";
import { Alert, Button, Card, CardHead, Field, Input } from "@/components/ui";
import { useT } from "@/components/LanguageProvider";

type Place = {
  latitude: number;
  longitude: number;
  country: string | null;
  state: string | null;
  district: string | null;
  city: string | null;
  locality: string | null;
  ward: string | null;
  formattedAddress: string;
};

const FALLBACK_CENTER = { lat: 19.8762, lng: 74.4776 }; // Kopargaon, used only as a first map view

function geoMessage(code: number) {
  switch (code) {
    case 1:
      return "Location permission was denied. You can search for the location or tap it on the map instead.";
    case 2:
      return "Your location is unavailable right now. You can search for the location or tap it on the map instead.";
    case 3:
      return "Finding your location took too long. You can search for the location or tap it on the map instead.";
    default:
      return "Unable to automatically detect your location. You can select the complaint location manually on the map.";
  }
}

export function ComplaintLocationPicker() {
  const t = useT();
  const [stage, setStage] = useState<"intro" | "picking">("intro");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [place, setPlace] = useState<Place | null>(null);
  const [area, setArea] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);

  async function resolve(lat: number, lng: number) {
    setCoords({ lat, lng });
    setConfirmed(false);
    setBusy("Looking up the address…");
    setError(null);
    try {
      const res = await fetch(`/api/geo/reverse?lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lookup failed.");
      setPlace(data);
      setArea(data.locality ?? "");
    } catch (e) {
      setPlace(null);
      setError(
        e instanceof Error && e.message
          ? `${e.message} You can still confirm this point and describe the area yourself.`
          : "The address lookup failed. You can still confirm this point and describe the area yourself."
      );
    } finally {
      setBusy(null);
    }
  }

  function useCurrentLocation() {
    setStage("picking");
    setError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("This browser does not support location detection. Search for the location or tap it on the map.");
      if (!coords) setCoords(FALLBACK_CENTER);
      return;
    }
    setBusy("Detecting your location…");
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        setBusy(null);
        setError(geoMessage(err.code));
        if (!coords) setCoords(FALLBACK_CENTER);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }

  function enterManually() {
    setStage("picking");
    setError(null);
    if (!coords) setCoords(FALLBACK_CENTER);
  }

  async function search() {
    const q = query.trim();
    if (q.length < 3) {
      setError("Type at least three characters to search for a place.");
      return;
    }
    setBusy("Searching…");
    setError(null);
    setResults([]);
    try {
      const res = await fetch(`/api/geo/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed.");
      if (!data.results?.length) setError("No place matched that search. Try a nearby town or landmark.");
      setResults(data.results ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The location search is unavailable right now.");
    } finally {
      setBusy(null);
    }
  }

  function choose(p: Place) {
    setResults([]);
    setQuery("");
    setCoords({ lat: p.latitude, lng: p.longitude });
    setPlace(p);
    setArea(p.locality ?? "");
    setConfirmed(false);
  }

  return (
    <Card>
      <CardHead
        title={`📍 ${t("complaint.locationTitle")}`}
        hint="Where the civic problem is — not necessarily where you live."
      />

      <div className="space-y-4 px-5 py-5">
        {stage === "intro" && (
          <div className="rounded-md border border-line bg-paper px-4 py-4">
            <p className="font-medium text-ink">📍 Allow NagarSetu to access your location</p>
            <p className="mt-1 text-sm text-ink-muted">
              Your location is used to identify the area and local authority responsible for your civic
              complaint. NagarSetu does not track you — it reads your location only when you press the
              button below.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button type="button" onClick={useCurrentLocation}>
                {t("action.allowLocation")}
              </Button>
              <Button type="button" variant="outline" onClick={enterManually}>
                {t("action.enterManually")}
              </Button>
            </div>
          </div>
        )}

        {stage === "picking" && (
          <>
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={useCurrentLocation}>
                {t("action.useCurrentLocation")}
              </Button>
            </div>

            <div className="flex flex-wrap items-end gap-2">
              <div className="min-w-[220px] flex-1">
                <Field label={t("action.searchLocation")} htmlFor="placeSearch">
                  <Input
                    id="placeSearch"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        search();
                      }
                    }}
                    placeholder="Pune, Kopargaon, a village, a road, a landmark"
                  />
                </Field>
              </div>
              <Button type="button" variant="outline" onClick={search}>
                Search
              </Button>
            </div>

            {results.length > 0 && (
              <ul className="divide-y divide-line rounded-md border border-line">
                {results.map((r, i) => (
                  <li key={`${r.latitude}-${r.longitude}-${i}`}>
                    <button
                      type="button"
                      onClick={() => choose(r)}
                      className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-paper"
                    >
                      {r.formattedAddress}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {busy && <Alert tone="info">{busy}</Alert>}
            {error && <Alert>{error}</Alert>}

            {coords && (
              <>
                <LazyMap
                  lat={coords.lat}
                  lng={coords.lng}
                  onPick={(lat, lng) => resolve(lat, lng)}
                />
                <p className="text-xs text-ink-muted">
                  Drag the pin or tap the map to move the complaint location.
                </p>

                <div className="rounded-md border border-line bg-paper px-4 py-4">
                  {place ? (
                    <p className="text-sm font-medium text-civic-dark">
                      ✓ Location detected successfully
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-ink">Point selected</p>
                  )}
                  <p className="mt-1 text-sm text-ink">{place?.formattedAddress}</p>

                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <Row label={t("field.latitude")} value={coords.lat.toFixed(6)} />
                    <Row label={t("field.longitude")} value={coords.lng.toFixed(6)} />
                    <Row label={t("field.state")} value={place?.state} />
                    <Row label={t("field.district")} value={place?.district} />
                    <Row label={t("field.city")} value={place?.city} />
                    <Row label={t("field.country")} value={place?.country ?? "India"} />
                  </dl>

                  <div className="mt-3 max-w-sm">
                    <Field label={t("field.area")} htmlFor="localityInput">
                      <Input
                        id="localityInput"
                        value={area}
                        onChange={(e) => {
                          setArea(e.target.value);
                          setConfirmed(false);
                        }}
                        placeholder="Locality, colony or landmark"
                      />
                    </Field>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button type="button" onClick={() => setConfirmed(true)} disabled={confirmed}>
                      {confirmed ? "Location confirmed" : t("action.confirmLocation")}
                    </Button>
                    {confirmed && <span className="text-sm text-civic-dark">✓ Ready to submit</span>}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {confirmed && coords && (
          <>
            <input type="hidden" name="locationConfirmed" value="1" />
            <input type="hidden" name="latitude" value={coords.lat} />
            <input type="hidden" name="longitude" value={coords.lng} />
            <input type="hidden" name="country" value={place?.country ?? "India"} />
            <input type="hidden" name="state" value={place?.state ?? ""} />
            <input type="hidden" name="district" value={place?.district ?? ""} />
            <input type="hidden" name="city" value={place?.city ?? area ?? ""} />
            <input type="hidden" name="locality" value={area} />
            <input type="hidden" name="ward" value={place?.ward ?? area ?? ""} />
            <input
              type="hidden"
              name="formattedAddress"
              value={place?.formattedAddress ?? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`}
            />
          </>
        )}
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex gap-2">
      <dt className="text-ink-muted">{label}:</dt>
      <dd className="text-ink">{value || "—"}</dd>
    </div>
  );
}
