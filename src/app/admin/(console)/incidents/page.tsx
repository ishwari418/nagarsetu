import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { Card, CardHead } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function IncidentsPage() {
  await requireAdmin();
  const complaints = await prisma.complaint.findMany({
    where: { status: { not: "RESOLVED" } },
    select: { category: true, ward: true, city: true, priority: true },
  });

  const groups = new Map<string, { ward: string; city: string; category: string; count: number; high: number }>();
  for (const c of complaints) {
    const key = `${c.city}|${c.ward}|${c.category}`;
    const g = groups.get(key) ?? { ward: c.ward, city: c.city, category: c.category, count: 0, high: 0 };
    g.count += 1;
    if (c.priority === "HIGH") g.high += 1;
    groups.set(key, g);
  }
  const rows = Array.from(groups.values()).filter((g) => g.count > 1).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-5">
      <Card>
        <CardHead
          title="Repeat reports by ward"
          hint="Open complaints of the same category in the same ward. Simple grouping only — AI clustering arrives in a later phase."
        />
        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-muted">
            No ward currently has more than one open complaint in the same category.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-paper text-left text-xs text-ink-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Ward</th>
                <th className="px-3 py-3 font-medium">Category</th>
                <th className="px-3 py-3 font-medium">Open reports</th>
                <th className="px-5 py-3 font-medium">High priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((g) => (
                <tr key={`${g.ward}-${g.category}`}>
                  <td className="px-5 py-3 text-ink">
                    {g.ward}, {g.city}
                  </td>
                  <td className="px-3 py-3 text-ink-soft">{g.category}</td>
                  <td className="px-3 py-3 tabular-nums text-ink">{g.count}</td>
                  <td className="px-5 py-3 tabular-nums text-clay">{g.high}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
