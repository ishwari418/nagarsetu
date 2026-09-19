import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireCitizen } from "@/lib/session";
import { Card, CardHead, Empty, LinkButton, PriorityBadge, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

function Stat({ label, value, tone = "" }: { label: string; value: number; tone?: string }) {
  return (
    <Card className="px-5 py-4">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className={`mt-1 font-display text-3xl font-semibold tabular-nums ${tone || "text-ink"}`}>{value}</p>
    </Card>
  );
}

export default async function CitizenDashboard() {
  const user = await requireCitizen();
  const complaints = await prisma.complaint.findMany({
    where: { citizenId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const active = complaints.filter((c) => c.status !== "RESOLVED").length;
  const resolved = complaints.filter((c) => c.status === "RESOLVED").length;
  const byPriority = (p: string) => complaints.filter((c) => c.priority === p).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Welcome, {user.firstName}</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {user.ward} · {user.city}, {user.state}
          </p>
        </div>
        <LinkButton href="/citizen/complaints/new">+ Report an issue</LinkButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="My complaints" value={complaints.length} />
        <Stat label="Active" value={active} />
        <Stat label="Resolved" value={resolved} tone="text-civic" />
        <Stat label="High priority" value={byPriority("HIGH")} tone="text-clay" />
        <Stat label="Medium / low" value={byPriority("MEDIUM") + byPriority("LOW")} />
      </div>

      <Card>
        <CardHead
          title="Recent complaints"
          hint="Your five most recent reports"
          action={
            <Link href="/citizen/complaints" className="text-sm font-medium text-civic hover:underline">
              View all
            </Link>
          }
        />
        {complaints.length === 0 ? (
          <Empty
            title="Nothing reported yet"
            body="When you report a water, road, waste or drainage problem it will appear here with its status."
            action={<LinkButton href="/citizen/complaints/new">Report an issue</LinkButton>}
          />
        ) : (
          <ul className="divide-y divide-line">
            {complaints.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/citizen/complaints/${c.id}`}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 hover:bg-paper"
                >
                  <span className="w-40 shrink-0 font-mono text-xs text-ink-muted">{c.complaintNumber}</span>
                  <span className="min-w-[180px] flex-1 text-sm font-medium text-ink">{c.title}</span>
                  <span className="text-sm text-ink-muted">{c.category}</span>
                  <PriorityBadge priority={c.priority} />
                  <StatusBadge status={c.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
