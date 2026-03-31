import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// GET /api/doctors/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userRole = (session.user as { role?: string }).role;

  // Mitglieder dürfen nur ihr eigenes Profil abrufen
  if (userRole !== "ADMIN") {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      include: { profile: true },
    });
    if (!user?.profile || user.profile.id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const doctor = await prisma.dentistProfile.findUnique({
    where: { id },
    include: {
      categories: { include: { category: true } },
      socialLinks: true,
    },
  });

  if (!doctor) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doctor);
}

// PATCH /api/doctors/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userRole = (session.user as { role?: string }).role;

  // Admins dürfen alles, Mitglieder nur ihr Profil (begrenzte Felder)
  if (userRole !== "ADMIN") {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      include: { profile: true },
    });
    if (!user?.profile || user.profile.id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const body = await req.json();

  // Mitglieder dürfen sensitive Felder nicht ändern
  if (userRole !== "ADMIN") {
    delete body.verified;
    delete body.featured;
    delete body.active;
    delete body.domains;
    delete body.userId;
  }

  const doctor = await prisma.dentistProfile.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(doctor);
}

// DELETE /api/doctors/[id] – nur Admin
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.dentistProfile.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
