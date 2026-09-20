import { CATEGORY_ICON } from "@/lib/constants";

export function CategoryChart({ data }: { data: { category: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="space-y-3 px-5 py-5">
      {data.map((d) => (
        <div key={d.category} className="grid grid-cols-[150px_1fr_36px] items-center gap-3">
          <span className="truncate text-sm text-ink-soft">
            <span className="mr-2 text-ink-muted" aria-hidden>
              {CATEGORY_ICON[d.category] ?? "◌"}
            </span>
            {d.category}
          </span>
          <span className="h-2.5 rounded-full bg-paper" aria-hidden>
            <span
              className="block h-2.5 rounded-full bg-civic"
              style={{ width: `${Math.round((d.count / max) * 100)}%` }}
            />
          </span>
          <span className="text-right text-sm tabular-nums text-ink">{d.count}</span>
        </div>
      ))}
    </div>
  );
}
