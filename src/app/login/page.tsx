"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";
import { loginCitizen } from "@/lib/actions/auth";
import { Alert, Card, Field, Input, Placeholder } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { Captcha } from "@/components/Captcha";

export default function LoginPage() {
  const [state, action] = useFormState(loginCitizen, {});
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="font-display text-xl font-semibold text-ink">
          Nagar<span className="text-civic">Setu</span>
        </Link>

        <Card className="mt-5">
          <div className="border-b border-line px-6 py-5">
            <h1 className="font-display text-xl font-semibold text-ink">Sign in</h1>
            <p className="mt-1 text-sm text-ink-muted">Use the email or mobile number you registered with.</p>
          </div>

          <form action={action} className="space-y-4 px-6 py-6">
            {state.error && <Alert>{state.error}</Alert>}
            {notice && <Alert tone="info">{notice}</Alert>}

            <Field label="Email or mobile number" htmlFor="identifier" required>
              <Input id="identifier" name="identifier" required autoComplete="username" />
            </Field>

            <Field label="Password" htmlFor="password" required>
              <Input id="password" name="password" type="password" required autoComplete="current-password" />
            </Field>

            <Captcha />

            <SubmitButton pendingText="Signing in…" className="w-full">
              Sign in
            </SubmitButton>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => setNotice("Password reset arrives in a later phase. Register a new account to test.")}
                className="text-civic hover:underline"
              >
                Forgot password?
              </button>
              <Link href="/register" className="text-civic hover:underline">
                Create account
              </Link>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="h-px flex-1 bg-line" />
              <span className="text-xs text-ink-muted">or</span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <button
              type="button"
              onClick={() => setNotice("Google sign-in is not wired up in Phase 1. Use email and password.")}
              className="w-full rounded-md border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-civic"
            >
              Continue with Google <Placeholder>placeholder</Placeholder>
            </button>
          </form>
        </Card>

        <p className="mt-4 text-center text-sm text-ink-muted">
          City staff sign in at{" "}
          <Link href="/admin/login" className="text-civic hover:underline">
            /admin/login
          </Link>
        </p>
      </div>
    </div>
  );
}
