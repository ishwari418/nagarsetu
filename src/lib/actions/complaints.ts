"use server";

import fs from "fs/promises";
import path from "path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin, requireCitizen } from "@/lib/session";
import { CATEGORIES, PRIORITIES, STATUSES } from "@/lib/constants";

export type FormState = { error?: string; ok?: boolean };

async function nextComplaintNumber() {
  const year = new Date().getFullYear();
  const prefix = `NGR-${year}-`;
  const last = await prisma.complaint.findFirst({
    where: { complaintNumber: { startsWith: prefix } },
    orderBy: { complaintNumber: "desc" },
    select: { complaintNumber: true },
  });
  const seq = last ? Number(last.complaintNumber.slice(prefix.length)) + 1 : 1;
  return prefix + String(seq).padStart(6, "0");
}

function derivePriority(category: string, daysAffected: number) {
  const critical = ["Water", "Drainage", "Public Health"];
  if (daysAffected >= 7 || (critical.includes(category) && daysAffected >= 3)) return "HIGH";
  if (daysAffected >= 2) return "MEDIUM";
  return "LOW";
}

async function saveImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!file.type.startsWith("image/")) return null;
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function createComplaint(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireCitizen();
  const get = (k: string) => String(formData.get(k) ?? "").trim();

  const category = get("category");
  const title = get("title");
  const description = get("description");
  const city = get("city");
  const ward = get("ward");
  const address = get("address");
  const issueStartDate = get("issueStartDate");
  const daysAffected = Number(get("daysAffected") || 0);

  if (!CATEGORIES.includes(category as any)) return { error: "Choose a category." };
  if (title.length < 6) return { error: "Give the issue a clear title of at least 6 characters." };
  if (description.length < 20) return { error: "Describe the issue in at least 20 characters." };
  if (!city || !ward || !address) return { error: "Complete the location of the issue." };
  if (!issueStartDate) return { error: "Select the date the issue started." };
  if (new Date(issueStartDate) > new Date()) return { error: "The start date cannot be in the future." };
  if (Number.isNaN(daysAffected) || daysAffected < 0) return { error: "Enter a valid number of days affected." };
  if (formData.get("consent") !== "on") return { error: "Give consent so the ward office can contact you." };

  let imageUrl: string | null = null;
  try {
    imageUrl = await saveImage(formData.get("image") as File | null);
  } catch {
    return { error: "The photo could not be saved. Try a smaller image." };
  }

  const complaintNumber = await nextComplaintNumber();
  const priority = derivePriority(category, daysAffected);

  const complaint = await prisma.complaint.create({
    data: {
      complaintNumber,
      citizenId: user.id,
      category,
      title,
      description,
      city,
      ward,
      address,
      latitude: Number(get("latitude")) || null,
      longitude: Number(get("longitude")) || null,
      issueStartDate: new Date(issueStartDate),
      daysAffected,
      imageUrl,
      extraInfo: get("extraInfo") || null,
      priority,
      status: "SUBMITTED",
      history: {
        create: {
          status: "SUBMITTED",
          note: "Complaint received by the ward office.",
          updatedBy: `${user.firstName} ${user.lastName}`,
        },
      },
    },
  });

  revalidatePath("/citizen/complaints");
  revalidatePath("/citizen/dashboard");
  redirect(`/citizen/complaints/new?submitted=${complaint.complaintNumber}`);
}

export async function updateComplaint(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const priority = String(formData.get("priority") ?? "");
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("note") ?? "").trim();

  if (!PRIORITIES.includes(priority as any)) return { error: "Choose a valid priority." };
  if (!STATUSES.includes(status as any)) return { error: "Choose a valid status." };

  const existing = await prisma.complaint.findUnique({ where: { id } });
  if (!existing) return { error: "That complaint no longer exists." };

  await prisma.complaint.update({
    where: { id },
    data: { priority, status },
  });

  if (existing.status !== status || note) {
    await prisma.complaintStatusHistory.create({
      data: {
        complaintId: id,
        status,
        note: note || null,
        updatedBy: `${admin.firstName} ${admin.lastName}`,
      },
    });
  }

  revalidatePath(`/admin/complaints/${id}`);
  revalidatePath("/admin/complaints");
  revalidatePath("/admin/dashboard");
  revalidatePath("/citizen/complaints");
  revalidatePath(`/citizen/complaints/${id}`);
  return { ok: true };
}
