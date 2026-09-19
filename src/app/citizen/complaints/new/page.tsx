import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireCitizen } from "@/lib/session";
import { Card, LinkButton } from "@/components/ui";
import { ComplaintForm } from "./ComplaintForm";

export const dynamic = "force-dynamic";

export default async function NewComplaintPage({
  searchParams,
}: {
  searchParams: { submitted?: string };
}) {
  const user = await requireCitizen();

  if (searchParams.submitted) {
    const complaint = await prisma.complaint.findUnique({
      where: { complaintNumber: searchParams.submitted },
    });

    if (complaint && complaint.citizenId === user.id) {
      return (
        <div className="mx-auto max-w-xl">
          <Card className="px-6 py-10 text-center">
            <span
              aria-hidden
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-civic-light text-xl text-civic"
            >
              ✓
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold text-ink">
              Complaint submitted successfully.
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              The {complaint.ward} ward office has received your report. Keep this number for reference.
            </p>
            <p className="mt-5 rounded-md border border-line bg-paper px-4 py-3 font-mono text-lg text-ink">
              {complaint.complaintNumber}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <LinkButton href={`/citizen/complaints/${complaint.id}`}>Track this complaint</LinkButton>
              <LinkButton href="/citizen/complaints" variant="outline">
                My complaints
              </LinkButton>
            </div>
          </Card>
        </div>
      );
    }
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <Link href="/citizen/complaints" className="text-sm text-civic hover:underline">
          ← My complaints
        </Link>
        <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Report an issue</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Tell the ward office where the problem is, what it is, and how long it has been going on.
        </p>
      </div>
      <ComplaintForm defaultAddress={user.address ?? ""} />
    </div>
  );
}
