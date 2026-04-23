"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const COUNTRY_SLUG_MAP: Record<string, string> = { DE: "deutschland", AT: "oesterreich", CH: "schweiz" };

function revalidateArchivePages(country: string | null, region: string | null, citySlug: string) {
  revalidatePath(`/zahnarzt/${citySlug}`);
  const countrySlug = country ? COUNTRY_SLUG_MAP[country] : null;
  if (countrySlug) revalidatePath(`/zahnarzt/${countrySlug}`);
  if (region) revalidatePath(`/zahnarzt/${slugify(region)}`);
}

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "ADMIN") throw new Error("Unauthorized");
}

function extractNewFields(formData: FormData) {
  const languages = formData.getAll("languages") as string[];
  const treatments = formData.getAll("treatments") as string[];

  const galleryImages = Array.from({ length: 6 }, (_, i) =>
    formData.get(`galleryImages[${i}]`) as string | null
  ).filter(Boolean) as string[];

  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const openingHours: Record<string, { open: string; close: string; open2?: string; close2?: string; closed: boolean }> = {};
  for (const day of days) {
    const closed = formData.get(`hours_${day}_closed`) === "on";
    const open = (formData.get(`hours_${day}_open`) as string) || "";
    const close = (formData.get(`hours_${day}_close`) as string) || "";
    const open2 = (formData.get(`hours_${day}_open2`) as string) || "";
    const close2 = (formData.get(`hours_${day}_close2`) as string) || "";
    openingHours[day] = { open, close, closed, ...(open2 ? { open2, close2 } : {}) };
  }

  const appointmentUrl = (formData.get("appointmentUrl") as string) || null;
  const googleBusinessUrl = (formData.get("googleBusinessUrl") as string) || null;

  return { languages, treatments, galleryImages, openingHours, appointmentUrl, googleBusinessUrl };
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createDoctor(formData: FormData) {
  await requireAdmin();

  const firstName = formData.get("firstName") as string;
  const lastName  = formData.get("lastName")  as string;
  const city      = formData.get("city")       as string;

  // Generate unique slug (name only, city goes into citySlug)
  const citySlug = slugify(city);
  const base = slugify(`${firstName}-${lastName}`);
  let slug = base;
  let n = 1;
  while (await prisma.dentistProfile.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }

  const domains = formData.getAll("domains") as string[];
  const { languages, treatments, galleryImages, openingHours, appointmentUrl, googleBusinessUrl } =
    extractNewFields(formData);

  const doctor = await prisma.dentistProfile.create({
    data: {
      slug,
      citySlug,
      firstName,
      lastName,
      title:          formData.get("title")        as string || null,
      suffix:         formData.get("suffix")        as string || null,
      practiceName:   formData.get("practiceName")  as string || null,
      bio:            formData.get("bio")            as string || null,
      imageUrl:       formData.get("imageUrl")       as string || null,
      phone:          formData.get("phone")          as string || null,
      email:          formData.get("email")          as string || null,
      website:        formData.get("website")        as string || null,
      appointmentUrl,
      googleBusinessUrl,
      street:         formData.get("street")         as string || null,
      zip:            formData.get("zip")            as string || null,
      city,
      region:         formData.get("region")         as string || null,
      country:        (formData.get("country")       as "DE"|"AT"|"CH"|"OTHER") || "DE",
      lat:            formData.get("lat")   ? parseFloat(formData.get("lat") as string)  : null,
      lng:            formData.get("lng")   ? parseFloat(formData.get("lng") as string)  : null,
      domains:        domains.length > 0 ? (domains as ("DE"|"COM")[]) : ["DE"],
      verified:       formData.get("verified")       === "on",
      featured:       formData.get("featured")       === "on",
      active:         formData.get("active")         === "on",
      metaTitle:      formData.get("metaTitle")      as string || null,
      metaDesc:       formData.get("metaDesc")       as string || null,
      languages,
      treatments,
      galleryImages,
      openingHours,
    },
  });

  revalidatePath("/admin/doctors");
  revalidatePath("/");
  revalidateArchivePages(
    formData.get("country") as string || "DE",
    formData.get("region") as string || null,
    doctor.citySlug,
  );
  redirect(`/admin/doctors/${doctor.id}`);
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateDoctor(id: string, formData: FormData) {
  await requireAdmin();

  const domains = formData.getAll("domains") as string[];
  const { languages, treatments, galleryImages, openingHours, appointmentUrl, googleBusinessUrl } =
    extractNewFields(formData);

  const updCity = formData.get("city") as string;
  await prisma.dentistProfile.update({
    where: { id },
    data: {
      citySlug:         slugify(updCity),
      title:            formData.get("title")          as string || null,
      firstName:        formData.get("firstName")      as string,
      lastName:         formData.get("lastName")       as string,
      suffix:           formData.get("suffix")         as string || null,
      practiceName:     formData.get("practiceName")   as string || null,
      bio:              formData.get("bio")             as string || null,
      imageUrl:         formData.get("imageUrl")        as string || null,
      phone:            formData.get("phone")           as string || null,
      email:            formData.get("email")           as string || null,
      website:          formData.get("website")         as string || null,
      appointmentUrl,
      googleBusinessUrl,
      street:           formData.get("street")          as string || null,
      zip:              formData.get("zip")             as string || null,
      city:             updCity,
      region:           formData.get("region")          as string || null,
      country:          (formData.get("country")        as "DE"|"AT"|"CH"|"OTHER") || "DE",
      lat:              formData.get("lat")   ? parseFloat(formData.get("lat") as string)  : null,
      lng:              formData.get("lng")   ? parseFloat(formData.get("lng") as string)  : null,
      domains:          domains.length > 0 ? (domains as ("DE"|"COM")[]) : ["DE"],
      verified:         formData.get("verified")        === "on",
      featured:         formData.get("featured")        === "on",
      active:           formData.get("active")          === "on",
      metaTitle:        formData.get("metaTitle")       as string || null,
      metaDesc:         formData.get("metaDesc")        as string || null,
      languages,
      treatments,
      galleryImages,
      openingHours,
    },
  });

  const updated = await prisma.dentistProfile.findUnique({ where: { id }, select: { slug: true, citySlug: true, country: true, region: true } });
  revalidatePath("/admin/doctors");
  if (updated) {
    revalidatePath(`/zahnarzt/${updated.citySlug}/${updated.slug}`);
    revalidateArchivePages(updated.country, updated.region, updated.citySlug);
  }
  revalidatePath("/");
  revalidatePath("/admin/doctors/" + id);
}

// ── Member: update own profile ───────────────────────────────────────────────

async function requireProfileOwnership(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  const userId = session.user.id as string;
  const role = (session.user as { role?: string }).role;
  if (role === "ADMIN") return; // admins bypass
  const owns = await prisma.dentistProfile.findFirst({
    where: { id, userId },
    select: { id: true },
  });
  if (!owns) throw new Error("Forbidden");
}

export async function updateMemberDoctor(id: string, formData: FormData) {
  await requireProfileOwnership(id);

  const { languages, treatments, galleryImages, openingHours, appointmentUrl, googleBusinessUrl } =
    extractNewFields(formData);

  // Important: DO NOT update verified, featured, active, domains, slug, citySlug, metaTitle, metaDesc
  // Members cannot change these.
  await prisma.dentistProfile.update({
    where: { id },
    data: {
      title:            formData.get("title") as string || null,
      firstName:        formData.get("firstName") as string,
      lastName:         formData.get("lastName") as string,
      suffix:           formData.get("suffix") as string || null,
      practiceName:     formData.get("practiceName") as string || null,
      bio:              formData.get("bio") as string || null,
      imageUrl:         formData.get("imageUrl") as string || null,
      phone:            formData.get("phone") as string || null,
      email:            formData.get("email") as string || null,
      website:          formData.get("website") as string || null,
      appointmentUrl,
      googleBusinessUrl,
      street:           formData.get("street") as string || null,
      zip:              formData.get("zip") as string || null,
      city:             formData.get("city") as string,
      region:           formData.get("region") as string || null,
      country:          (formData.get("country") as "DE"|"AT"|"CH"|"OTHER") || "DE",
      lat:              formData.get("lat") ? parseFloat(formData.get("lat") as string) : null,
      lng:              formData.get("lng") ? parseFloat(formData.get("lng") as string) : null,
      languages,
      treatments,
      galleryImages,
      openingHours,
    },
  });

  // ── Social Media Links (Facebook, Instagram, LinkedIn, TikTok) ────────────
  const socialPlatforms = [
    { platform: "FACEBOOK" as const,  field: "social_facebook"  },
    { platform: "INSTAGRAM" as const, field: "social_instagram" },
    { platform: "LINKEDIN" as const,  field: "social_linkedin"  },
  ];

  for (const { platform, field } of socialPlatforms) {
    const url = (formData.get(field) as string | null)?.trim() ?? "";
    const existing = await prisma.socialLink.findFirst({
      where: { dentistId: id, platform },
    });
    if (url) {
      if (existing) {
        await prisma.socialLink.update({ where: { id: existing.id }, data: { url } });
      } else {
        await prisma.socialLink.create({ data: { dentistId: id, platform, url } });
      }
    } else if (existing) {
      await prisma.socialLink.delete({ where: { id: existing.id } });
    }
  }

  const updated = await prisma.dentistProfile.findUnique({
    where: { id },
    select: { slug: true, citySlug: true, country: true, region: true },
  });
  revalidatePath("/account/profil");
  revalidatePath(`/account/profil/${id}`);
  if (updated) {
    revalidatePath(`/zahnarzt/${updated.citySlug}/${updated.slug}`);
    revalidateArchivePages(updated.country, updated.region, updated.citySlug);
  }
  revalidatePath("/");
}

// ── Set doctor credentials ────────────────────────────────────────────────────

export async function setDoctorCredentials(doctorId: string, formData: FormData) {
  await requireAdmin();

  const email    = (formData.get("credEmail")    as string)?.trim();
  const password = (formData.get("credPassword") as string)?.trim();
  const username = (formData.get("credUsername") as string)?.trim() || null;

  if (!email) throw new Error("E-Mail ist erforderlich");

  const doctor = await prisma.dentistProfile.findUnique({
    where: { id: doctorId },
    include: { user: true },
  });
  if (!doctor) throw new Error("Profil nicht gefunden");

  if (doctor.user) {
    // Update existing linked user — check username conflict against OTHER users
    if (username) {
      const conflict = await prisma.user.findFirst({
        where: { username, id: { not: doctor.user.id } },
      });
      if (conflict) throw new Error(`Benutzername "${username}" ist bereits vergeben`);
    }
    const updateData: { email: string; username?: string | null; passwordHash?: string } = { email, username };
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 12);
    }
    await prisma.user.update({ where: { id: doctor.user.id }, data: updateData });
  } else {
    // Check if a user with this email already exists
    const existingByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingByEmail) {
      // Link the existing user and update username if provided
      await prisma.dentistProfile.update({
        where: { id: doctorId },
        data: { userId: existingByEmail.id },
      });
      if (username) {
        const conflict = await prisma.user.findFirst({
          where: { username, id: { not: existingByEmail.id } },
        });
        if (!conflict) {
          await prisma.user.update({ where: { id: existingByEmail.id }, data: { username } });
        }
      }
    } else {
      // No user with this email — check if username belongs to an existing account
      const existingByUsername = username
        ? await prisma.user.findFirst({ where: { username } })
        : null;

      if (existingByUsername) {
        // Username found in another account — link that account and update email
        await prisma.dentistProfile.update({
          where: { id: doctorId },
          data: { userId: existingByUsername.id },
        });
        await prisma.user.update({
          where: { id: existingByUsername.id },
          data: { email, ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {}) },
        });
      } else {
        if (!password) throw new Error("Passwort ist erforderlich für einen neuen Account");
        const passwordHash = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
          data: { email, username: username || null, passwordHash, role: "MEMBER" },
        });
        await prisma.dentistProfile.update({
          where: { id: doctorId },
          data: { userId: user.id },
        });
      }
    }
  }

  revalidatePath("/admin/doctors/" + doctorId);
}

// ── Assign existing user account to doctor profile ───────────────────────────

export async function assignUserToDoctor(doctorId: string, userId: string) {
  await requireAdmin();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Benutzer nicht gefunden");

  await prisma.dentistProfile.update({
    where: { id: doctorId },
    data: { userId },
  });

  revalidatePath("/admin/doctors/" + doctorId);
}

export async function unlinkUserFromDoctor(doctorId: string) {
  await requireAdmin();

  await prisma.dentistProfile.update({
    where: { id: doctorId },
    data: { userId: null },
  });

  revalidatePath("/admin/doctors/" + doctorId);
}

// ── Remove doctor credentials ─────────────────────────────────────────────────

export async function removeDoctorCredentials(doctorId: string) {
  await requireAdmin();

  const doctor = await prisma.dentistProfile.findUnique({
    where: { id: doctorId },
    select: { userId: true },
  });
  if (!doctor?.userId) return;

  await prisma.dentistProfile.update({ where: { id: doctorId }, data: { userId: null } });
  await prisma.user.delete({ where: { id: doctor.userId } });

  revalidatePath("/admin/doctors/" + doctorId);
}

// ── Sync: copy user email into profile email for linked doctors ───────────────

export async function syncProfileEmailsFromUsers() {
  await requireAdmin();

  const profiles = await prisma.dentistProfile.findMany({
    where: {
      userId: { not: null },
      OR: [{ email: null }, { email: "" }],
    },
    include: { user: { select: { email: true } } },
  });

  let updated = 0;
  for (const profile of profiles) {
    if (!profile.user?.email) continue;
    await prisma.dentistProfile.update({
      where: { id: profile.id },
      data: { email: profile.user.email },
    });
    updated++;
  }

  revalidatePath("/admin/doctors");
  return { updated };
}

// ── Sync: link profiles to user accounts by matching email ───────────────────

export async function linkProfilesWithMatchingUsers() {
  await requireAdmin();

  // All profiles with an email but no linked user
  const profiles = await prisma.dentistProfile.findMany({
    where: {
      userId: null,
      email: { not: null },
    },
    select: { id: true, email: true },
  });

  let linked = 0;
  for (const profile of profiles) {
    if (!profile.email) continue;
    const user = await prisma.user.findUnique({ where: { email: profile.email } });
    if (!user) continue;
    await prisma.dentistProfile.update({
      where: { id: profile.id },
      data: { userId: user.id },
    });
    linked++;
  }

  revalidatePath("/admin/doctors");
  return { linked, total: profiles.length };
}

// ── Bulk: create accounts for all doctors with email but no account ───────────

export async function bulkCreateDoctorAccounts(defaultPassword: string) {
  await requireAdmin();

  const profiles = await prisma.dentistProfile.findMany({
    where: { userId: null, email: { not: null } },
    select: { id: true, email: true },
  });

  let created = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const profile of profiles) {
    const email = profile.email!.trim();
    if (!email || !email.includes("@")) { skipped++; continue; }

    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        // Already exists — just link if not linked
        await prisma.dentistProfile.update({
          where: { id: profile.id },
          data: { userId: existing.id },
        });
        skipped++;
        continue;
      }

      const hash = await bcrypt.hash(defaultPassword, 12);
      const user = await prisma.user.create({
        data: { email, passwordHash: hash, role: "MEMBER" },
      });
      await prisma.dentistProfile.update({
        where: { id: profile.id },
        data: { userId: user.id },
      });
      created++;
    } catch (e) {
      errors.push(`${email}: ${(e as Error).message}`);
    }
  }

  revalidatePath("/admin/doctors");
  return { created, skipped, errors, total: profiles.length };
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteDoctor(id: string) {
  await requireAdmin();
  const doc = await prisma.dentistProfile.findUnique({ where: { id }, select: { slug: true, citySlug: true, country: true, region: true } });
  await prisma.dentistProfile.delete({ where: { id } });
  revalidatePath("/admin/doctors");
  revalidatePath("/");
  if (doc) {
    revalidatePath(`/zahnarzt/${doc.citySlug}/${doc.slug}`);
    revalidateArchivePages(doc.country, doc.region, doc.citySlug);
  }
  redirect("/admin/doctors");
}
