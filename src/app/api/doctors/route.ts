import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

// GET /api/doctors – Liste (Admin)
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  const doctors = await prisma.dentistProfile.findMany({
    where: q
      ? {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { categories: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(doctors);
}

// POST /api/doctors – Neues Profil anlegen (Admin)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { firstName, lastName, title, suffix, city, country, ...rest } = body;

  if (!firstName || !lastName || !city) {
    return NextResponse.json({ error: "firstName, lastName, city sind Pflicht" }, { status: 400 });
  }

  const baseSlug = slugify(`${title ?? ""} ${firstName} ${lastName}`.trim());
  // Eindeutigkeit sicherstellen
  let slug = baseSlug;
  let i = 2;
  while (await prisma.dentistProfile.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  const doctor = await prisma.dentistProfile.create({
    data: {
      slug,
      firstName,
      lastName,
      title: title ?? null,
      suffix: suffix ?? null,
      city,
      country: country ?? "DE",
      ...rest,
    },
  });

  return NextResponse.json(doctor, { status: 201 });
}
