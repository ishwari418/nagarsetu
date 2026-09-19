"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { createComplaint } from "@/lib/actions/complaints";
import { Alert, Card, CardHead, Field, Input, Placeholder, Select, Textarea } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { LocationSelect } from "@/components/LocationSelect";
import { CATEGORIES } from "@/lib/constants";

export function ComplaintForm({ defaultAddress }: { defaultAddress: string }) {
  const [state, action] = useFormState(createComplaint, {});
  const [coords, setCoords] = useState({ lat: "", lng: "" });
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="space-y-5">
      {state.error && <Alert>{state.error}</Alert>}

      <Card>
        <CardHead title="Where is the problem?" />
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
          <LocationSelect compact />
          <div className="sm:col-span-2">
            <Field label="Address or landmark" htmlFor="address" required>
              <Textarea id="address" name="address" rows={2} defaultValue={defaultAddress} required />
            </Field>
          </div>
          <Field label="Latitude" htmlFor="latitude">
            <Input
              id="latitude"
              name="latitude"
              value={coords.lat}
              onChange={(e) => setCoords({ ...coords, lat: e.target.value })}
              placeholder="19.8762"
            />
          </Field>
          <Field label="Longitude" htmlFor="longitude">
            <Input
              id="longitude"
              name="longitude"
              value={coords.lng}
              onChange={(e) => setCoords({ ...coords, lng: e.target.value })}
              placeholder="74.4776"
            />
          </Field>
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={() => setCoords({ lat: "19.8762", lng: "74.4776" })}
              className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink hover:border-civic"
            >
              Use current location
            </button>
            <Placeholder>fills sample coordinates — real GPS comes later</Placeholder>
          </div>
        </div>
      </Card>

      <Card>
        <CardHead title="What is the issue?" />
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
          <Field label="Category" htmlFor="category" required>
            <Select id="category" name="category" required defaultValue="">
              <option value="" disabled>
                Select a category
              </option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label="Issue title" htmlFor="title" required>
            <Input id="title" name="title" required placeholder="No water supply since Monday" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description" htmlFor="description" required hint="What is happening, and who is affected?">
              <Textarea id="description" name="description" rows={4} required />
            </Field>
          </div>
          <Field label="Date the issue started" htmlFor="issueStartDate" required>
            <Input id="issueStartDate" name="issueStartDate" type="date" max={today} required />
          </Field>
          <Field label="Days affected" htmlFor="daysAffected" required hint="Used to set the priority automatically.">
            <Input id="daysAffected" name="daysAffected" type="number" min={0} defaultValue={1} required />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Photo" htmlFor="image" hint="Optional. JPG or PNG, up to about 5 MB.">
              <Input id="image" name="image" type="file" accept="image/*" className="py-1.5" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Anything else the ward office should know?" htmlFor="extraInfo">
              <Textarea id="extraInfo" name="extraInfo" rows={2} />
            </Field>
          </div>
        </div>
      </Card>

      <label className="flex items-start gap-2 text-sm text-ink-soft">
        <input type="checkbox" name="consent" className="mt-0.5 h-4 w-4 accent-[#0F5E5C]" />
        <span>
          I confirm this report is accurate and allow the ward office to contact me about it.
        </span>
      </label>

      <SubmitButton pendingText="Submitting…">Submit complaint</SubmitButton>
    </form>
  );
}
