"use client";

import { useEffect, useState } from "react";
import { Input, Field, Placeholder } from "./ui";

function code() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function Captcha() {
  const [value, setValue] = useState("");
  useEffect(() => setValue(code()), []);

  return (
    <Field label="Verification characters" htmlFor="captcha" required>
      <div className="flex items-stretch gap-2">
        <div
          aria-hidden
          className="select-none rounded-md border border-line bg-[repeating-linear-gradient(45deg,#eef2f1,#eef2f1_6px,#e2e8e7_6px,#e2e8e7_12px)] px-4 py-2 font-display text-lg tracking-[0.35em] text-ink"
          style={{ fontStyle: "italic" }}
        >
          {value || "•••••"}
        </div>
        <button
          type="button"
          onClick={() => setValue(code())}
          className="rounded-md border border-line px-3 text-sm text-ink-soft hover:border-civic hover:text-civic"
        >
          New code
        </button>
      </div>
      <input type="hidden" name="captchaCode" value={value} />
      <Input
        id="captcha"
        name="captcha"
        autoComplete="off"
        placeholder="Type the characters above"
        required
        className="mt-2 uppercase"
      />
      <p className="text-xs text-ink-muted">
        Client-side check only <Placeholder>placeholder for a real CAPTCHA</Placeholder>
      </p>
    </Field>
  );
}
