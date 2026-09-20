import Link from "next/link";
import { LinkButton } from "@/components/ui";
import { CATEGORIES, CATEGORY_ICON } from "@/lib/constants";

export default function Home() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <span className="font-display text-xl font-semibold text-ink">
            Nagar<span className="text-civic">Setu</span>
          </span>
          <nav className="flex items-center gap-2">
            <Link href="/login" className="rounded-md px-3 py-2 text-sm text-ink-soft hover:text-civic">
              Sign in
            </Link>
            <LinkButton href="/register">Create account</LinkButton>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <p className="text-sm text-civic">Phase 1 preview build</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          Report a civic problem once. Follow it until the ward office closes it.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
          NagarSetu connects residents with the city administration. Log a water, road, waste or
          drainage issue with a photo and your ward, and track every status change on one page.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/register">Report an issue</LinkButton>
          <LinkButton href="/admin/login" variant="outline">
            City administration sign-in
          </LinkButton>
        </div>

        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.filter((c) => c !== "Other").map((c) => (
            <div key={c} className="rounded-lg border border-line bg-white px-4 py-5">
              <span className="text-lg text-civic" aria-hidden>
                {CATEGORY_ICON[c]}
              </span>
              <p className="mt-2 text-sm font-medium text-ink">{c}</p>
            </div>
          ))}
        </div>

        <ol className="mt-16 grid gap-6 border-t border-line pt-10 sm:grid-cols-4">
          {[
            ["Register", "Give your ward and address once."],
            ["Report", "Add a photo, category and how long it has been going on."],
            ["Track", "See the complaint move through review and repair."],
            ["Close", "The ward office marks it resolved and you see the record."],
          ].map(([step, body], i) => (
            <li key={step}>
              <span className="text-sm tabular-nums text-civic">{i + 1}</span>
              <p className="mt-1 font-display font-semibold text-ink">{step}</p>
              <p className="mt-1 text-sm text-ink-muted">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto max-w-5xl px-5 py-6 text-sm text-ink-muted">
          NagarSetu · Phase 1 MVP · Demo data only
        </div>
      </footer>
    </div>
  );
}
