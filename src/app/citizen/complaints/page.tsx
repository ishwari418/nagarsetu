import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireCitizen } from "@/lib/session";
import { Card, CardHead, Empty, LinkButton, PriorityBadge, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function MyComplaints() {
  const user = await requireCitizen();
  const complaints = await prisma.complaint.findMany({
    where: { citizenId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Card>
      <CardHead
        title="My complaints"
        hint={`${complaints.length} report${complaints.length === 1 ? "" : "s"}`}
        action={<LinkButton href="/citizen/complaints/new">+ Report an issue</LinkButton>}
      />

      {complaints.length === 0 ? (
        <Empty
          title="No complaints yet"
          body="Report a problem in your ward and it will be listed here with its live status."
          action={<LinkButton href="/citizen/complaints/new">Report an issue</LinkButton>}
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead className="bg-paper text-left text-xs text-ink-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Complaint ID</th>
                  <th className="px-3 py-3 font-medium">Category</th>
                  <th className="px-3 py-3 font-medium">Title</th>
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
                      <Link href={`/citizen/complaints/${c.id}`} className="font-mono text-xs text-civic hover:underline">
                        {c.complaintNumber}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-ink-soft">{c.category}</td>
                    <td className="px-3 py-3 font-medium text-ink">{c.title}</td>
                    <td className="px-3 py-3 text-ink-muted">{c.ward}, {c.city}</td>
                    <td className="px-3 py-3 text-ink-muted">
                      {c.createdAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </td>
                    <td className="px-3 py-3"><PriorityBadge priority={c.priority} /></td>
                    <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-line md:hidden">
            {complaints.map((c) => (
              <li key={c.id} className="px-5 py-4">
                <Link href={`/citizen/complaints/${c.id}`} className="block space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-ink-muted">{c.complaintNumber}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="font-medium text-ink">{c.title}</p>
                  <p className="text-sm text-ink-muted">
                    {c.category} · {c.ward}, {c.city} ·{" "}
                    {c.createdAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </p>
                  <PriorityBadge priority={c.priority} />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
