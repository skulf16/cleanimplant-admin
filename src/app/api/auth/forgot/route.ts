import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "E-Mail fehlt" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Immer 200 zurückgeben – kein User-Enumeration
  if (!user) {
    return NextResponse.json({ success: true });
  }

  // Alte Tokens für diese E-Mail löschen
  await prisma.passwordResetToken.deleteMany({ where: { email } });

  // Neuen Token generieren (1 Stunde gültig)
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: { token, email, expiresAt },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3001";
  const resetUrl = `${baseUrl}/reset?token=${token}`;

  try {
    await sendPasswordResetEmail(email, resetUrl);
  } catch (err) {
    console.error("E-Mail konnte nicht gesendet werden:", err);
    return NextResponse.json({ error: "E-Mail konnte nicht gesendet werden" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
