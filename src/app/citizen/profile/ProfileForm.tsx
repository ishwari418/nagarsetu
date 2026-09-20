"use client";

import { useFormState } from "react-dom";
import { updateProfile } from "@/lib/actions/auth";
import { Alert, Card, CardHead, Field, Input, Select, Textarea } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { GENDERS } from "@/lib/location";
import { LANGUAGES } from "@/lib/i18n";
import { setLanguage } from "@/lib/actions/language";
import { useT } from "@/components/LanguageProvider";

type UserView = Record<string, string>;

export function ProfileForm({ user, language }: { user: UserView; language: string }) {
  const [state, action] = useFormState(updateProfile, {});
  const [langState, langAction] = useFormState(setLanguage, {});
  const t = useT();

  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardHead title={t("nav.profile")} hint="Kept with your complaints so the ward office can reach you." />
        <form action={action} className="space-y-5 px-5 py-5">
          {state.error && <Alert>{state.error}</Alert>}
          {state.ok && <Alert tone="success">Profile updated.</Alert>}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" htmlFor="firstName" required>
              <Input id="firstName" name="firstName" defaultValue={user.firstName} required />
            </Field>
            <Field label="Last name" htmlFor="lastName" required>
              <Input id="lastName" name="lastName" defaultValue={user.lastName} required />
            </Field>
            <Field label="Email" htmlFor="email" hint="Email changes are not available in Phase 1.">
              <Input id="email" defaultValue={user.email} disabled />
            </Field>
            <Field label="Mobile number" htmlFor="phone" required>
              <Input id="phone" name="phone" defaultValue={user.phone} maxLength={10} required />
            </Field>
            <Field label="Gender" htmlFor="gender">
              <Select id="gender" name="gender" defaultValue={user.gender}>
                <option value="">Select</option>
                {GENDERS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </Select>
            </Field>
            <Field label="PIN code" htmlFor="pinCode">
              <Input id="pinCode" name="pinCode" defaultValue={user.pinCode} maxLength={6} />
            </Field>
            <Field label="City" htmlFor="city">
              <Input id="city" name="city" defaultValue={user.city} />
            </Field>
            <Field label="State" htmlFor="state">
              <Input id="state" name="state" defaultValue={user.state} />
            </Field>
            <Field label="Ward / area" htmlFor="ward">
              <Input id="ward" name="ward" defaultValue={user.ward} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Address" htmlFor="address">
                <Textarea id="address" name="address" rows={2} defaultValue={user.address} />
              </Field>
            </div>
          </div>

          <SubmitButton pendingText="Saving…">{t("action.save")}</SubmitButton>
        </form>
      </Card>

      <Card>
        <CardHead
          title={t("language.preference")}
          hint="NagarSetu screens are shown in this language. Complaint text is never translated."
        />
        <form action={langAction} className="space-y-4 px-5 py-5">
          {langState.error && <Alert>{langState.error}</Alert>}
          {langState.ok && <Alert tone="success">Language updated.</Alert>}

          <div className="max-w-xs">
            <Field label={t("language.preference")} htmlFor="language">
              <Select id="language" name="language" defaultValue={language}>
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.native}
                    {l.code === "en" ? "" : ` — ${l.label}`}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <SubmitButton pendingText="Saving…">{t("action.save")}</SubmitButton>
        </form>
      </Card>
    </div>
  );
}
