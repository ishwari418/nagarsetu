"use client";

import { useFormState } from "react-dom";
import { createComplaint } from "@/lib/actions/complaints";
import { Alert, Card, CardHead, Field, Input, Select, Textarea } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { ComplaintLocationPicker } from "@/components/ComplaintLocationPicker";
import { useT } from "@/components/LanguageProvider";
import { CATEGORIES } from "@/lib/constants";

export function ComplaintForm() {
  const [state, action] = useFormState(createComplaint, {});
  const t = useT();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="space-y-5">
      {state.error && <Alert>{state.error}</Alert>}

      <ComplaintLocationPicker />

      <Card>
        <CardHead title="What is the issue?" />
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
          <Field label={t("field.category")} htmlFor="category" required>
            <Select id="category" name="category" required defaultValue="">
              <option value="" disabled>
                Select a category
              </option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label={t("field.title")} htmlFor="title" required>
            <Input id="title" name="title" required placeholder="No water supply since Monday" />
          </Field>
          <div className="sm:col-span-2">
            <Field
              label={t("field.description")}
              htmlFor="description"
              required
              hint="What is happening, and who is affected?"
            >
              <Textarea id="description" name="description" rows={4} required />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field
              label={t("field.address")}
              htmlFor="address"
              required
              hint="Street, landmark or house number at the complaint location."
            >
              <Textarea id="address" name="address" rows={2} required />
            </Field>
          </div>
          <Field label={t("field.issueStartDate")} htmlFor="issueStartDate" required>
            <Input id="issueStartDate" name="issueStartDate" type="date" max={today} required />
          </Field>
          <Field
            label={t("field.daysAffected")}
            htmlFor="daysAffected"
            required
            hint="Used to set the priority automatically."
          >
            <Input id="daysAffected" name="daysAffected" type="number" min={0} defaultValue={1} required />
          </Field>
          <div className="sm:col-span-2">
            <Field label={t("field.photo")} htmlFor="image" hint="Optional. JPG or PNG, up to about 5 MB.">
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
        <span>I confirm this report is accurate and allow the ward office to contact me about it.</span>
      </label>

      <SubmitButton pendingText="Submitting…">{t("action.submitComplaint")}</SubmitButton>
    </form>
  );
}
