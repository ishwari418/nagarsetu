import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { Card, CardHead, PriorityBadge, StatusBadge } from "@/components/ui";
import { CategoryChart } from "@/components/CategoryChart";
import { CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

function Stat({ label, value, tone = "text-ink" }: { label: string; value: number; tone?: string }) {
  return (
    <Card className="px-5 py-4">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className={`mt-1 font-display text-3xl font-semibold tabular-nums ${tone}`}>{value}</p>
    </Card>
  );
}

export default async function AdminDashboard() {
  await requireAdmin();
  const complaints = await prisma.complaint.findMany({
    orderBy: { createdAt: "desc" },
    include: { citizen: { select: { firstName: true, lastName: true } } },
  });

  const count = (fn: (c: (typeof complaints)[number]) => boolean) => complaints.filter(fn).length;
  const chart = CATEGORIES.filter((c) => c !== "Other").map((category) => ({
    category,
    count: count((c) => c.category === category),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">City overview</h2>
        <p className="mt-1 text-sm text-ink-muted">Every complaint filed through NagarSetu, live from the database.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Stat label="Total" value={complaints.length} />
        <Stat label="Active" value={count((c) => c.status !== "RESOLVED")} />
        <Stat label="Resolved" value={count((c) => c.status === "RESOLVED")} tone="text-civic" />
        <Stat label="High priority" value={count((c) => c.priority === "HIGH")} tone="text-clay" />
        <Stat label="Medium priority" value={count((c) => c.priority === "MEDIUM")} />
        <Stat label="Low priority" value={count((c) => c.priority === "LOW")} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHead title="Complaints by category" hint="Count of all reports received" />
          <CategoryChart data={chart} />
        </Card>

        <Card>
          <CardHead
            title="Latest reports"
            action={
              <Link href="/admin/complaints" className="text-sm font-medium text-civic hover:underline">
                Manage all
              </Link>
            }
          />
          <ul className="divide-y divide-line">
            {complaints.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/admin/complaints/${c.id}`} className="block space-y-1 px-5 py-3 hover:bg-paper">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-ink-muted">{c.complaintNumber}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-sm font-medium text-ink">{c.title}</p>
                  <p className="text-xs text-ink-muted">
                    {c.category} · {c.ward} · {c.citizen.firstName} {c.citizen.lastName}
                  </p>
                  <PriorityBadge priority={c.priority} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
