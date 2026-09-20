"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export type NavItem = { href: string; label: string };

export function Shell({
  nav,
  title,
  subtitle,
  children,
  onLogout,
  tone = "citizen",
}: {
  nav: NavItem[];
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onLogout: React.ReactNode;
  tone?: "citizen" | "admin";
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const bar = tone === "admin" ? "bg-ink" : "bg-ink";

  return (
    <div className="min-h-screen bg-paper">
      <aside
        className={`${bar} fixed inset-y-0 left-0 z-40 w-64 transform transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 px-5 py-5">
            <Link href="/" className="font-display text-xl font-semibold text-white">
              Nagar<span className="text-civic-light">Setu</span>
            </Link>
            <p className="mt-1 text-xs text-white/55">{subtitle}</p>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                    active ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-white/10 p-3">{onLogout}</div>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
          <button
            onClick={() => setOpen(true)}
            className="rounded-md border border-line px-2.5 py-1.5 text-sm text-ink-soft lg:hidden"
            aria-label="Open navigation"
          >
            ☰
          </button>
          <h1 className="font-display text-lg font-semibold text-ink">{title}</h1>
        </header>
        <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
