"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { registerCitizen } from "@/lib/actions/auth";
import { Alert, Card, Field, Input, Select, Textarea } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { LocationSelect } from "@/components/LocationSelect";
import { GENDERS } from "@/lib/location";

export default function RegisterPage() {
  const [state, action] = useFormState(registerCitizen, {});

  return (
    <div className="min-h-screen bg-paper py-10">
      <div className="mx-auto max-w-3xl px-5">
        <Link href="/" className="font-display text-xl font-semibold text-ink">
          Nagar<span className="text-civic">Setu</span>
        </Link>

        <Card className="mt-6">
          <div className="border-b border-line px-6 py-5">
            <h1 className="font-display text-2xl font-semibold text-ink">Create your citizen account</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Your ward and address decide which office receives your complaints.
            </p>
          </div>

          <form action={action} className="space-y-6 px-6 py-6">
            {state.error && <Alert>{state.error}</Alert>}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" htmlFor="firstName" required>
                <Input id="firstName" name="firstName" required autoComplete="given-name" />
              </Field>
              <Field label="Last name" htmlFor="lastName" required>
                <Input id="lastName" name="lastName" required autoComplete="family-name" />
              </Field>
              <Field label="Mobile number" htmlFor="phone" required hint="10 digits, no country code">
                <Input id="phone" name="phone" inputMode="numeric" maxLength={10} required />
              </Field>
              <Field label="Email" htmlFor="email" required>
                <Input id="email" name="email" type="email" required autoComplete="email" />
              </Field>
              <Field label="Gender" htmlFor="gender">
                <Select id="gender" name="gender" defaultValue="">
                  <option value="">Select</option>
                  {GENDERS.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
              <LocationSelect />
              <Field label="PIN code" htmlFor="pinCode" required>
                <Input id="pinCode" name="pinCode" inputMode="numeric" maxLength={6} required />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Address" htmlFor="address" required>
                  <Textarea id="address" name="address" rows={2} required placeholder="House / street / landmark" />
                </Field>
              </div>
            </div>

            <div className="grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
              <Field label="Password" htmlFor="password" required hint="At least 8 characters">
                <Input id="password" name="password" type="password" required />
              </Field>
              <Field label="Confirm password" htmlFor="confirmPassword" required>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
              </Field>
            </div>

            <label className="flex items-start gap-2 text-sm text-ink-soft">
              <input type="checkbox" name="terms" className="mt-0.5 h-4 w-4 accent-[#0F5E5C]" />
              <span>
                I agree to the terms of use and allow the city administration to contact me about my
                complaints.
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
              <SubmitButton pendingText="Creating account…">Create account</SubmitButton>
              <p className="text-sm text-ink-muted">
                Already registered?{" "}
                <Link href="/login" className="font-medium text-civic hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
