"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function importMembersFromCSV(formData: FormData) {
  const file = formData.get("csv") as File;
  if (!file) throw new Error("Keine Datei");

  const text = await file.text();
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  // Detect header row
  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes("email") || firstLine.includes("user_email") || firstLine.includes("mail");
  const dataLines = hasHeader ? lines.slice(1) : lines;

  // Try to detect CSV separator
  const sep = firstLine.includes("\t") ? "\t" : ",";

  const headers = hasHeader
    ? lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g, "").toLowerCase())
    : [];

  function getCol(row: string[], name: string, fallback: number): string {
    const idx = headers.length > 0
      ? headers.findIndex(h => h.includes(name))
      : -1;
    const col = idx >= 0 ? idx : fallback;
    return (row[col] ?? "").trim().replace(/^"|"$/g, "");
  }

  let created = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const line of dataLines) {
    if (!line) continue;
    const cols = line.split(sep);

    const email        = getCol(cols, "email", 2);
    const passwordHash = getCol(cols, "user_pass", 1) || getCol(cols, "pass", 1);
    const displayName  = getCol(cols, "display_name", 7) || getCol(cols, "name", 0);
    const userLogin    = getCol(cols, "user_login", 0) || null;
    const firstName    = displayName.split(" ")[0] ?? "";
    const lastName     = displayName.split(" ").slice(1).join(" ") ?? "";

    if (!email || !email.includes("@")) {
      errors.push(`Ungültige E-Mail: "${email}"`);
      continue;
    }

    // If no WP hash provided, generate a temporary one
    const finalHash = passwordHash.startsWith("$P$") || passwordHash.startsWith("$H$")
      ? passwordHash
      : await bcrypt.hash(passwordHash || "CleanImplant2025!", 12);

    try {
      const existing = await prisma.user.findUnique({ where: { email } });

      if (existing) {
        // Nur username ergänzen falls noch keiner gesetzt ist
        if (userLogin && !existing.username) {
          await prisma.user.update({
            where: { id: existing.id },
            data: { username: userLogin },
          });
        }
        skipped++;
        continue;
      }

      // Prüfen ob ein Arztprofil mit dieser E-Mail existiert (noch nicht verknüpft)
      const doctorProfile = await prisma.dentistProfile.findFirst({
        where: { email, userId: null },
      });

      // Check if username is already taken by another user
      let safeUsername: string | null = userLogin || null;
      if (safeUsername) {
        const conflict = await prisma.user.findFirst({ where: { username: safeUsername } });
        if (conflict) safeUsername = null;
      }

      const user = await prisma.user.create({
        data: {
          email,
          username: safeUsername,
          passwordHash: finalHash,
          role: "MEMBER",
        },
      });

      // Arztprofil mit neuem User verknüpfen falls gefunden
      if (doctorProfile) {
        await prisma.dentistProfile.update({
          where: { id: doctorProfile.id },
          data: { userId: user.id },
        });
      }

      created++;
    } catch (e) {
      errors.push(`Fehler bei ${email}: ${(e as Error).message}`);
    }
  }

  revalidatePath("/admin/members");
  return { created, skipped, errors };
}

export async function createMember(formData: FormData) {
  const email     = (formData.get("email") as string).trim();
  const password  = (formData.get("password") as string).trim();
  const firstName = (formData.get("firstName") as string).trim();
  const lastName  = (formData.get("lastName") as string).trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("E-Mail bereits vorhanden");

  const hash = await bcrypt.hash(password || "CleanImplant2025!", 12);

  await prisma.user.create({
    data: {
      email,
      passwordHash: hash,
      role: "MEMBER",
    },
  });

  revalidatePath("/admin/members");
}

export async function updateMemberPassword(userId: string, formData: FormData) {
  const password = (formData.get("password") as string).trim();
  if (!password || password.length < 6) throw new Error("Passwort zu kurz");

  const hash = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash: hash } });
  revalidatePath("/admin/members");
}

export async function importUsernamesFromCSV(formData: FormData) {
  const file = formData.get("csv") as File;
  if (!file) throw new Error("Keine Datei");

  const text = await file.text();
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes("user_login") || firstLine.includes("email");
  const sep = firstLine.includes("\t") ? "\t" : ",";

  const headers = hasHeader
    ? lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g, "").toLowerCase())
    : [];

  const dataLines = hasHeader ? lines.slice(1) : lines;

  function getIdx(name: string) {
    return headers.findIndex(h => h === name || h.includes(name));
  }

  const emailIdx    = getIdx("user_email") >= 0 ? getIdx("user_email") : getIdx("email");
  const loginIdx    = getIdx("user_login");

  let updated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const line of dataLines) {
    if (!line) continue;
    const cols = line.split(sep).map(c => c.trim().replace(/^"|"$/g, ""));

    const email     = emailIdx >= 0 ? cols[emailIdx] : "";
    const userLogin = loginIdx >= 0 ? cols[loginIdx] : "";

    if (!email || !email.includes("@") || !userLogin) { skipped++; continue; }

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) { skipped++; continue; }

      // Check if username already taken by a different user
      if (userLogin) {
        const conflict = await prisma.user.findFirst({
          where: { username: userLogin, id: { not: user.id } }
        });
        if (conflict) {
          errors.push(`Benutzername "${userLogin}" bereits vergeben (${email})`);
          continue;
        }
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { username: userLogin },
      });
      updated++;
    } catch (e) {
      errors.push(`${email}: ${(e as Error).message}`);
    }
  }

  revalidatePath("/admin/members");
  return { updated, skipped, errors };
}

export async function deleteMember(userId: string) {
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/members");
}
