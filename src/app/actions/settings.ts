"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "ADMIN") throw new Error("Unauthorized");
}

export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  const rows = await prisma.setting.findMany({ where: { key: { in: keys } } });
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function saveSettings(formData: FormData) {
  await requireAdmin();

  const keys = [
    "email_patient_subject",
    "email_patient_body",
    "email_practice_subject",
    "email_practice_body",
  ];

  await Promise.all(
    keys.map((key) => {
      const value = (formData.get(key) as string) ?? "";
      return prisma.setting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      });
    })
  );

  revalidatePath("/admin/settings");
}
