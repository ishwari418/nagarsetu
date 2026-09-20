import { STATUSES, STATUS_LABEL } from "@/lib/constants";

type Entry = { status: string; note: string | null; updatedBy: string; createdAt: Date };

export function StatusTimeline({ current, history }: { current: string; history: Entry[] }) {
  const currentIndex = STATUSES.indexOf(current as any);

  return (
    <ol className="relative space-y-6 pl-7">
      <span className="absolute left-[9px] top-2 bottom-2 w-px bg-line" aria-hidden />
      {STATUSES.map((status, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const entry = [...history].reverse().find((h) => h.status === status);
        return (
          <li key={status} className="relative">
            <span
              aria-hidden
              className={`absolute -left-7 top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 text-[10px] ${
                done
                  ? "border-civic bg-civic text-white"
                  : active
                  ? "border-civic bg-white text-civic"
                  : "border-line bg-white text-transparent"
              }`}
            >
              {done ? "✓" : active ? "●" : "○"}
            </span>
            <p className={`text-sm font-medium ${done || active ? "text-ink" : "text-ink-muted"}`}>
              {STATUS_LABEL[status]}
            </p>
            {entry ? (
              <p className="mt-0.5 text-xs text-ink-muted">
                {new Date(entry.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} ·{" "}
                {entry.updatedBy}
                {entry.note ? ` — ${entry.note}` : ""}
              </p>
            ) : (
              <p className="mt-0.5 text-xs text-ink-muted">Not reached yet</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
