import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireCitizen } from "@/lib/session";
import { Card, CardHead, PriorityBadge, StatusBadge } from "@/components/ui";
import { StatusTimeline } from "@/components/StatusTimeline";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 px-5 py-3 text-sm">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}

export default async function ComplaintDetail({ params }: { params: { id: string } }) {
  const user = await requireCitizen();
  const complaint = await prisma.complaint.findUnique({
    where: { id: params.id },
    include: { history: { orderBy: { createdAt: "asc" } } },
  });

  if (!complaint || complaint.citizenId !== user.id) notFound();

  return (
    <div className="space-y-5">
      <div>
        <Link href="/citizen/complaints" className="text-sm text-civic hover:underline">
          ← My complaints
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl font-semibold text-ink">{complaint.title}</h2>
          <StatusBadge status={complaint.status} />
          <PriorityBadge priority={complaint.priority} />
        </div>
        <p className="mt-1 font-mono text-sm text-ink-muted">{complaint.complaintNumber}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <Card>
            <CardHead title="Complaint details" />
            <dl className="divide-y divide-line">
              <Row label="Category" value={complaint.category} />
              <Row label="Description" value={<p className="whitespace-pre-line">{complaint.description}</p>} />
              <Row label="Location" value={`${complaint.address}, ${complaint.ward}, ${complaint.city}`} />
              {complaint.latitude && complaint.longitude && (
                <Row label="Coordinates" value={`${complaint.latitude}, ${complaint.longitude}`} />
              )}
              <Row
                label="Submitted"
                value={complaint.createdAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              />
              <Row
                label="Issue started"
                value={`${complaint.issueStartDate.toLocaleDateString("en-IN", {
                  dateStyle: "medium",
                })} · ${complaint.daysAffected} day(s) affected`}
              />
              {complaint.extraInfo && <Row label="Extra notes" value={complaint.extraInfo} />}
            </dl>
          </Card>

          {complaint.imageUrl && (
            <Card>
              <CardHead title="Photo from the citizen" />
              <div className="p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={complaint.imageUrl}
                  alt={`Photo submitted with ${complaint.complaintNumber}`}
                  className="max-h-80 w-full rounded-md border border-line object-cover"
                />
              </div>
            </Card>
          )}
        </div>

        <Card className="h-fit">
          <CardHead title="Progress" hint="Updated by the ward office" />
          <div className="px-5 py-5">
            <StatusTimeline current={complaint.status} history={complaint.history} />
          </div>
        </Card>
      </div>
    </div>
  );
}
