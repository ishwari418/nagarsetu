"use client";

import { logout } from "@/lib/actions/auth";

export function LogoutButton({ label = "Sign out" }: { label?: string }) {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="w-full rounded-md px-3 py-2 text-left text-sm text-white/65 hover:bg-white/5 hover:text-white"
      >
        {label}
      </button>
    </form>
  );
}
