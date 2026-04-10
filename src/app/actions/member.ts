"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// ── Profildaten aktualisieren ─────────────────────────────────────────────────

export async function updateMemberProfile(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await auth();
  if (!session) return "Nicht autorisiert";

  const title     = (formData.get("title") as string)?.trim() || null;
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName  = (formData.get("lastName") as string)?.trim();
  const email     = (formData.get("email") as string)?.trim().toLowerCase();

  if (!firstName || !lastName || !email) return "Bitte alle Pflichtfelder ausfüllen";

  try {
    // E-Mail-Adresse darf nicht von einem anderen User genutzt werden
    const existing = await prisma.user.findFirst({
      where: { email, NOT: { id: session.user.id } },
    });
    if (existing) return "Diese E-Mail-Adresse wird bereits verwendet";

    await Promise.all([
      prisma.user.update({
        where: { id: session.user.id },
        data:  { email },
      }),
      prisma.dentistProfile.updateMany({
        where: { userId: session.user.id },
        data:  { title, firstName, lastName },
      }),
    ]);

    revalidatePath("/account/einstellungen");
    return null; // Erfolg
  } catch (e) {
    console.error(e);
    return "Fehler beim Speichern. Bitte versuche es erneut.";
  }
}

// ── Passwort ändern ───────────────────────────────────────────────────────────

export async function changeMemberPassword(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await auth();
  if (!session) return "Nicht autorisiert";

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword     = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword)
    return "Bitte alle Felder ausfüllen";

  if (newPassword !== confirmPassword)
    return "Die neuen Passwörter stimmen nicht überein";

  if (newPassword.length < 8)
    return "Das neue Passwort muss mindestens 8 Zeichen lang sein";

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return "Benutzer nicht gefunden";

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return "Das aktuelle Passwort ist falsch";

    const hash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: session.user.id },
      data:  { passwordHash: hash },
    });

    return null; // Erfolg
  } catch (e) {
    console.error(e);
    return "Fehler beim Ändern des Passworts";
  }
}
