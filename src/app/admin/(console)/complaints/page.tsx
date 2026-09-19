import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { Card, CardHead, Empty, PriorityBadge, StatusBadge } from "@/components/ui";
import { CATEGORIES, PRIORITIES, STATUSES, STATUS_LABEL, PRIORITY_LABEL } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Search = { category?: string; priority?: string; status?: string };

function FilterLinks({
  label,
  name,
  options,
  current,
  search,
  labels,
}: {
  label: string;
  name: keyof Search;
  options: readonly string[];
  current: Search;
  search: Search;
  labels?: Record<string, string>;
}) {
  const href = (value?: string) => {
    const next = new URLSearchParams();
    Object.entries({ ...search, [name]: value }).forEach(([k, v]) => {
      if (v) next.set(k, v);
    });
    const qs = next.toString();
    return `/admin/complaints${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-ink-muted">{label}</span>
      <Link
        href={href(undefined)}
        className={`rounded-full border px-3 py-1 text-xs ${
          !current[name] ? "border-civic bg-civic-light text-civic-dark" : "border-line bg-white text-ink-soft"
        }`}
      >
        All
      </Link>
      {options.map((o) => (
        <Link
          key={o}
          href={href(o)}
          className={`rounded-full border px-3 py-1 text-xs ${
            current[name] === o ? "border-civic bg-civic-light text-civic-dark" : "border-line bg-white text-ink-soft"
          }`}
        >
          {labels?.[o] ?? o}
        </Link>
      ))}
    </div>
  );
}

export default async function AdminComplaints({ searchParams }: { searchParams: Search }) {
  await requireAdmin();
  const { category, priority, status } = searchParams;

  const complaints = await prisma.complaint.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(priority ? { priority } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { citizen: { select: { firstName: true, lastName: true, phone: true } } },
  });

  return (
    <Card>
      <CardHead title="All complaints" hint={`${complaints.length} matching report(s)`} />

      <div className="space-y-3 border-b border-line bg-paper px-5 py-4">
        <FilterLinks label="Category" name="category" options={CATEGORIES} current={searchParams} search={searchParams} />
        <FilterLinks
          label="Priority"
          name="priority"
          options={PRIORITIES}
          current={searchParams}
          search={searchParams}
          labels={PRIORITY_LABEL}
        />
        <FilterLinks
          label="Status"
          name="status"
          options={STATUSES}
          current={searchParams}
          search={searchParams}
          labels={STATUS_LABEL}
        />
      </div>

      {complaints.length === 0 ? (
        <Empty title="No complaints match these filters" body="Clear a filter to widen the list." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-white text-left text-xs text-ink-muted">
              <tr className="border-b border-line">
                <th className="px-5 py-3 font-medium">Complaint ID</th>
                <th className="px-3 py-3 font-medium">Citizen</th>
                <th className="px-3 py-3 font-medium">Category</th>
                <th className="px-3 py-3 font-medium">Location</th>
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="px-3 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {complaints.map((c) => (
                <tr key={c.id} className="hover:bg-paper">
                  <td className="px-5 py-3">
                    <Link href={`/admin/complaints/${c.id}`} className="font-mono text-xs text-civic hover:underline">
                      {c.complaintNumber}
                    </Link>
                    <p className="mt-0.5 max-w-[220px] truncate text-ink">{c.title}</p>
                  </td>
                  <td className="px-3 py-3 text-ink-soft">
                    {c.citizen.firstName} {c.citizen.lastName}
                    <p className="text-xs text-ink-muted">{c.citizen.phone}</p>
                  </td>
                  <td className="px-3 py-3 text-ink-soft">{c.category}</td>
                  <td className="px-3 py-3 text-ink-muted">
                    {c.ward}, {c.city}
                  </td>
                  <td className="px-3 py-3 text-ink-muted">
                    {c.createdAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </td>
                  <td className="px-3 py-3">
                    <PriorityBadge priority={c.priority} />
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
