"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { createSession, destroySession, currentUser } from "@/lib/session";

export type FormState = { error?: string; ok?: boolean };

export async function registerCitizen(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();

  const firstName = get("firstName");
  const lastName = get("lastName");
  const phone = get("phone");
  const email = get("email").toLowerCase();
  const password = get("password");
  const confirm = get("confirmPassword");

  if (!firstName || !lastName) return { error: "Enter your first and last name." };
  if (!/^[6-9]\d{9}$/.test(phone)) return { error: "Enter a valid 10-digit mobile number." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid email address." };
  if (!get("country") || !get("state") || !get("district") || !get("city") || !get("ward"))
    return { error: "Complete your location details." };
  if (!/^\d{6}$/.test(get("pinCode"))) return { error: "PIN code must be 6 digits." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };
  if (formData.get("terms") !== "on") return { error: "Accept the terms to continue." };

  const clash = await prisma.user.findFirst({ where: { OR: [{ email }, { phone }] } });
  if (clash) return { error: "An account already exists with this email or mobile number." };

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      password: await bcrypt.hash(password, 10),
      gender: get("gender") || null,
      role: "CITIZEN",
      country: get("country"),
      state: get("state"),
      district: get("district"),
      city: get("city"),
      ward: get("ward"),
      address: get("address"),
      pinCode: get("pinCode"),
    },
  });

  createSession({ userId: user.id, role: user.role });
  redirect("/citizen/dashboard");
}

export async function loginCitizen(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const identifier = String(formData.get("identifier") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const captcha = String(formData.get("captcha") ?? "").trim().toUpperCase();
  const captchaCode = String(formData.get("captchaCode") ?? "").trim().toUpperCase();

  if (!identifier || !password) return { error: "Enter your login details." };
  if (captcha !== captchaCode) return { error: "The characters you entered do not match the image." };

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }] },
  });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return { error: "Incorrect login details. Check your email/mobile and password." };
  if (user.role !== "CITIZEN")
    return { error: "This is an administrator account. Use the admin sign-in page." };

  createSession({ userId: user.id, role: user.role });
  redirect("/citizen/dashboard");
}

export async function loginAdmin(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const captcha = String(formData.get("captcha") ?? "").trim().toUpperCase();
  const captchaCode = String(formData.get("captchaCode") ?? "").trim().toUpperCase();

  if (captcha !== captchaCode) return { error: "The characters you entered do not match the image." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== "CITY_ADMIN" || !(await bcrypt.compare(password, user.password)))
    return { error: "Incorrect administrator credentials." };

  createSession({ userId: user.id, role: user.role });
  redirect("/admin/dashboard");
}

export async function logout() {
  destroySession();
  redirect("/");
}

export async function updateProfile(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await currentUser();
  if (!user) return { error: "Your session expired. Sign in again." };

  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const phone = get("phone");
  if (!/^[6-9]\d{9}$/.test(phone)) return { error: "Enter a valid 10-digit mobile number." };

  const taken = await prisma.user.findFirst({ where: { phone, NOT: { id: user.id } } });
  if (taken) return { error: "That mobile number belongs to another account." };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      firstName: get("firstName") || user.firstName,
      lastName: get("lastName") || user.lastName,
      phone,
      gender: get("gender") || null,
      address: get("address"),
      city: get("city"),
      state: get("state"),
      ward: get("ward"),
      pinCode: get("pinCode"),
    },
  });

  revalidatePath("/citizen/profile");
  return { ok: true };
}
