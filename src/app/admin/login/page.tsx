"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { loginAdmin } from "@/lib/actions/auth";
import { Alert, Card, Field, Input } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { Captcha } from "@/components/Captcha";

export default function AdminLoginPage() {
  const [state, action] = useFormState(loginAdmin, {});

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="font-display text-xl font-semibold text-white">
          Nagar<span className="text-civic-light">Setu</span>
        </Link>
        <p className="mt-1 text-sm text-white/55">City administration console</p>

        <Card className="mt-5">
          <div className="border-b border-line px-6 py-5">
            <h1 className="font-display text-xl font-semibold text-ink">Administrator sign-in</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Accounts are created by the municipal IT team. There is no public registration.
            </p>
          </div>

          <form action={action} className="space-y-4 px-6 py-6">
            {state.error && <Alert>{state.error}</Alert>}

            <Field label="Admin ID / email" htmlFor="email" required>
              <Input id="email" name="email" type="email" required defaultValue="admin@nagarsetu.gov" />
            </Field>

            <Field label="Password" htmlFor="password" required>
              <Input id="password" name="password" type="password" required />
            </Field>

            <Captcha />

            <SubmitButton pendingText="Signing in…" className="w-full">
              Sign in
            </SubmitButton>
          </form>
        </Card>

        <p className="mt-4 text-sm text-white/55">
          Seeded demo login: admin@nagarsetu.gov / Admin@123
        </p>
      </div>
    </div>
  );
}
