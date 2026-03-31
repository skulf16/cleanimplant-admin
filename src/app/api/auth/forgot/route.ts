import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

  // TODO: Reset-Token generieren & E-Mail senden
  // Für die Implementierung wird ein E-Mail-Dienst (z.B. Resend) benötigt
  const token = crypto.randomBytes(32).toString("hex");
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset?token=${token}`;

  console.log(`Password reset for ${email}: ${resetUrl}`);
  // await sendResetEmail(email, resetUrl);

  return NextResponse.json({ success: true });
}
