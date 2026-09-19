"use client";

import { useFormState } from "react-dom";
import { updateProfile } from "@/lib/actions/auth";
import { Alert, Card, CardHead, Field, Input, Select, Textarea } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { GENDERS } from "@/lib/location";

type UserView = Record<string, string>;

export function ProfileForm({ user }: { user: UserView }) {
  const [state, action] = useFormState(updateProfile, {});

  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardHead title="Profile" hint="Kept with your complaints so the ward office can reach you." />
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

          <SubmitButton pendingText="Saving…">Save changes</SubmitButton>
        </form>
      </Card>
    </div>
  );
}
