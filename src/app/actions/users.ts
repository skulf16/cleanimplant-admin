"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "ADMIN") throw new Error("Unauthorized");
}

export async function updateUser(id: string, formData: FormData) {
  await requireAdmin();

  const email    = (formData.get("email")    as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  if (!email) throw new Error("E-Mail ist erforderlich");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== id) throw new Error("Diese E-Mail wird bereits verwendet");

  const updateData: { email: string; passwordHash?: string } = { email };
  if (password) {
    updateData.passwordHash = await bcrypt.hash(password, 12);
  }
  await prisma.user.update({ where: { id }, data: updateData });

  revalidatePath("/admin/users");
  revalidatePath("/admin/users/" + id);
}

export async function createAdminUser(formData: FormData) {
  await requireAdmin();

  const email    = (formData.get("email")    as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  if (!email)    throw new Error("E-Mail ist erforderlich");
  if (!password) throw new Error("Passwort ist erforderlich");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Diese E-Mail wird bereits verwendet");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash, role: "ADMIN" },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users/" + user.id);
}

export async function deleteUser(id: string) {
  await requireAdmin();
  // Unlink profile first
  await prisma.dentistProfile.updateMany({ where: { userId: id }, data: { userId: null } });
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}
