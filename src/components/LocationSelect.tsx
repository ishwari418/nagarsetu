"use client";

import { useState } from "react";
import { COUNTRIES, statesOf, districtsOf, citiesOf, wardsOf } from "@/lib/location";
import { Field, Select } from "./ui";

export function LocationSelect({ compact = false }: { compact?: boolean }) {
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("Maharashtra");
  const [district, setDistrict] = useState("Ahilyanagar");
  const [city, setCity] = useState("Kopargaon");

  const states = statesOf(country);
  const districts = districtsOf(country, state);
  const cities = citiesOf(country, state, district);
  const wards = wardsOf(country, state, district, city);

  return (
    <>
      {!compact && (
        <>
          <Field label="Country" htmlFor="country" required>
            <Select
              id="country"
              name="country"
              value={country}
              onChange={(e) => {
                const v = e.target.value;
                setCountry(v);
                const s = statesOf(v)[0] ?? "";
                setState(s);
                const d = districtsOf(v, s)[0] ?? "";
                setDistrict(d);
                setCity(citiesOf(v, s, d)[0] ?? "");
              }}
            >
              {COUNTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </Field>

          <Field label="State" htmlFor="state" required>
            <Select
              id="state"
              name="state"
              value={state}
              onChange={(e) => {
                const v = e.target.value;
                setState(v);
                const d = districtsOf(country, v)[0] ?? "";
                setDistrict(d);
                setCity(citiesOf(country, v, d)[0] ?? "");
              }}
            >
              {states.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>

          <Field label="District" htmlFor="district" required>
            <Select
              id="district"
              name="district"
              value={district}
              onChange={(e) => {
                const v = e.target.value;
                setDistrict(v);
                setCity(citiesOf(country, state, v)[0] ?? "");
              }}
            >
              {districts.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
          </Field>
        </>
      )}

      <Field label="City" htmlFor="city" required>
        <Select id="city" name="city" value={city} onChange={(e) => setCity(e.target.value)}>
          {cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </Field>

      <Field label="Ward / area" htmlFor="ward" required>
        <Select id="ward" name="ward" defaultValue={wards[0]}>
          {wards.map((w) => (
            <option key={w}>{w}</option>
          ))}
        </Select>
      </Field>

      {compact && (
        <>
          <input type="hidden" name="state" value={state} />
          <input type="hidden" name="district" value={district} />
          <input type="hidden" name="country" value={country} />
        </>
      )}
    </>
  );
}
