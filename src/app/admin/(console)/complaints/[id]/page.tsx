import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { Card, CardHead, PriorityBadge, StatusBadge } from "@/components/ui";
import { StatusTimeline } from "@/components/StatusTimeline";
import { ComplaintMap } from "@/components/map/ComplaintMap";
import { UpdateComplaintForm } from "./UpdateComplaintForm";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 px-5 py-3 text-sm">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}

export default async function AdminComplaintDetail({ params }: { params: { id: string } }) {
  await requireAdmin();
  const complaint = await prisma.complaint.findUnique({
    where: { id: params.id },
    include: { citizen: true, history: { orderBy: { createdAt: "asc" } } },
  });

  if (!complaint) notFound();

  return (
    <div className="space-y-5">
      <div>
        <Link href="/admin/complaints" className="text-sm text-civic hover:underline">
          ← All complaints
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
            <CardHead title="Report" />
            <dl className="divide-y divide-line">
              <Row label="Category" value={complaint.category} />
              <Row label="Description" value={<p className="whitespace-pre-line">{complaint.description}</p>} />
              <Row
                label="Submitted"
                value={complaint.createdAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              />
              <Row
                label="Issue started"
                value={`${complaint.issueStartDate.toLocaleDateString("en-IN", {
                  dateStyle: "medium",
                })} · ${complaint.daysAffected} day(s)`}
              />
              {complaint.extraInfo && <Row label="Extra notes" value={complaint.extraInfo} />}
            </dl>
          </Card>

          <Card>
            <CardHead title="📍 Complaint location" hint="Where the reported problem is." />
            {complaint.latitude != null && complaint.longitude != null && (
              <div className="px-5 pt-5">
                <ComplaintMap lat={complaint.latitude} lng={complaint.longitude} />
              </div>
            )}
            <dl className="divide-y divide-line">
              <Row label="Address" value={complaint.formattedAddress ?? complaint.address} />
              <Row label="Landmark" value={complaint.address} />
              <Row label="Area / ward" value={complaint.locality ?? complaint.ward} />
              <Row label="City / village" value={complaint.city} />
              <Row label="District" value={complaint.district ?? "—"} />
              <Row label="State" value={complaint.state ?? "—"} />
              {complaint.latitude != null && complaint.longitude != null && (
                <Row
                  label="Coordinates"
                  value={`${complaint.latitude.toFixed(6)}, ${complaint.longitude.toFixed(6)}`}
                />
              )}
            </dl>
          </Card>

          <Card>
            <CardHead title="Citizen" />
            <dl className="divide-y divide-line">
              <Row label="Name" value={`${complaint.citizen.firstName} ${complaint.citizen.lastName}`} />
              <Row label="Mobile" value={complaint.citizen.phone} />
              <Row label="Email" value={complaint.citizen.email} />
              <Row label="Ward" value={`${complaint.citizen.ward ?? "—"}, ${complaint.citizen.city ?? "—"}`} />
            </dl>
          </Card>

          {complaint.imageUrl && (
            <Card>
              <CardHead title="Photo" />
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

        <div className="space-y-5">
          <UpdateComplaintForm
            id={complaint.id}
            priority={complaint.priority}
            status={complaint.status}
          />
          <Card>
            <CardHead title="Progress" />
            <div className="px-5 py-5">
              <StatusTimeline current={complaint.status} history={complaint.history} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
