"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { setLanguage } from "@/lib/actions/language";
import { LANGUAGES } from "@/lib/i18n";
import { Alert } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";

export function LanguageModal() {
  const [state, action] = useFormState(setLanguage, {});
  const [choice, setChoice] = useState("en");

  if (state.ok) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 py-8">
      <div className="max-h-full w-full max-w-lg overflow-y-auto rounded-lg border border-line bg-white shadow-card">
        <div className="border-b border-line px-6 py-5">
          <h2 className="font-display text-xl font-semibold text-ink">Choose your preferred language</h2>
          <p className="mt-1 text-sm text-ink-muted">
            आप इसे बाद में प्रोफ़ाइल से बदल सकते हैं · You can change this later from your profile.
          </p>
        </div>

        <form action={action} className="space-y-5 px-6 py-5">
          {state.error && <Alert>{state.error}</Alert>}

          <div className="grid gap-2 sm:grid-cols-2">
            {LANGUAGES.map((l) => (
              <label
                key={l.code}
                className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 text-sm ${
                  choice === l.code ? "border-civic bg-civic-light" : "border-line bg-white hover:border-civic/50"
                }`}
              >
                <input
                  type="radio"
                  name="language"
                  value={l.code}
                  checked={choice === l.code}
                  onChange={() => setChoice(l.code)}
                  className="h-4 w-4 accent-[#0F5E5C]"
                />
                <span className="text-ink">{l.native}</span>
                {l.code !== "en" && <span className="text-xs text-ink-muted">{l.label}</span>}
              </label>
            ))}
          </div>

          <SubmitButton pendingText="Saving…">Continue</SubmitButton>
        </form>
      </div>
    </div>
  );
}
