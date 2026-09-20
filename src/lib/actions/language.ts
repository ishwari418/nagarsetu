"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { isLanguage } from "@/lib/i18n";

export type FormState = { error?: string; ok?: boolean };

export async function setLanguage(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await currentUser();
  if (!user) return { error: "Your session expired. Sign in again." };

  const lang = String(formData.get("language") ?? "");
  if (!isLanguage(lang)) return { error: "Choose a language from the list." };

  await prisma.user.update({
    where: { id: user.id },
    data: { preferredLanguage: lang, languageChosen: true },
  });

  revalidatePath("/citizen", "layout");
  return { ok: true };
}
