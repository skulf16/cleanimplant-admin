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

  // Mitglieder dürfen nur ihre eigenen Profile abrufen
  if (userRole !== "ADMIN") {
    const owns = await prisma.dentistProfile.findFirst({
      where: { id, userId: session.user.id as string },
      select: { id: true },
    });
    if (!owns) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

  // Admins dürfen alles, Mitglieder nur ihre eigenen Profile (begrenzte Felder)
  if (userRole !== "ADMIN") {
    const owns = await prisma.dentistProfile.findFirst({
      where: { id, userId: session.user.id as string },
      select: { id: true },
    });
    if (!owns) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
