"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ─── Events ──────────────────────────────────────────────────────────────────

export async function createEvent(formData: FormData) {
  const event = await prisma.event.create({
    data: {
      title:       (formData.get("title") as string)?.trim() || "",
      imageUrl:    (formData.get("imageUrl") as string)?.trim() || null,
      description: (formData.get("description") as string).trim(),
      dateFrom:    formData.get("dateFrom") ? new Date(formData.get("dateFrom") as string) : null,
      dateTo:      formData.get("dateTo")   ? new Date(formData.get("dateTo")   as string) : null,
      city:        (formData.get("city") as string)?.trim()    || null,
      country:     (formData.get("country") as string)?.trim() || null,
      active:      formData.get("active") === "true",
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/account/events");
  redirect(`/admin/events/${event.id}`);
}

export async function updateEvent(id: string, formData: FormData) {
  await prisma.event.update({
    where: { id },
    data: {
      title:       (formData.get("title") as string)?.trim() || "",
      imageUrl:    (formData.get("imageUrl") as string)?.trim() || null,
      description: (formData.get("description") as string).trim(),
      dateFrom:    formData.get("dateFrom") ? new Date(formData.get("dateFrom") as string) : null,
      dateTo:      formData.get("dateTo")   ? new Date(formData.get("dateTo")   as string) : null,
      city:        (formData.get("city") as string)?.trim()    || null,
      country:     (formData.get("country") as string)?.trim() || null,
      active:      formData.get("active") === "true",
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/account/events");
}

export async function deleteEvent(id: string) {
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/account/events");
  redirect("/admin/events");
}

// ─── Webinare ────────────────────────────────────────────────────────────────

export async function createWebinar(formData: FormData) {
  const webinar = await prisma.webinar.create({
    data: {
      imageUrl:         (formData.get("imageUrl") as string)?.trim()         || null,
      title:            (formData.get("title") as string).trim(),
      shortDescription: (formData.get("shortDescription") as string)?.trim() || null,
      duration:         (formData.get("duration") as string)?.trim()         || null,
      date:             formData.get("date") ? new Date(formData.get("date") as string) : null,
      tutorName:        (formData.get("tutorName") as string)?.trim()        || null,
      meetingUrl:       (formData.get("meetingUrl") as string)?.trim()       || null,
      registrationUrl:  (formData.get("registrationUrl") as string)?.trim()  || null,
      active:           formData.get("active") === "true",
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/account/events");
  redirect(`/admin/events/webinare/${webinar.id}`);
}

export async function updateWebinar(id: string, formData: FormData) {
  await prisma.webinar.update({
    where: { id },
    data: {
      imageUrl:         (formData.get("imageUrl") as string)?.trim()         || null,
      title:            (formData.get("title") as string).trim(),
      shortDescription: (formData.get("shortDescription") as string)?.trim() || null,
      duration:         (formData.get("duration") as string)?.trim()         || null,
      date:             formData.get("date") ? new Date(formData.get("date") as string) : null,
      tutorName:        (formData.get("tutorName") as string)?.trim()        || null,
      meetingUrl:       (formData.get("meetingUrl") as string)?.trim()       || null,
      registrationUrl:  (formData.get("registrationUrl") as string)?.trim()  || null,
      active:           formData.get("active") === "true",
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/account/events");
}

export async function deleteWebinar(id: string) {
  await prisma.webinar.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/account/events");
  redirect("/admin/events");
}

// ─── Webinar-Anmeldung ───────────────────────────────────────────────────────

export async function registerForWebinar(webinarId: string, formData: FormData) {
  const userId = formData.get("userId") as string;
  const email  = formData.get("email")  as string;
  const name   = formData.get("name")   as string;

  if (!userId || !email || !name) throw new Error("Fehlende Pflichtfelder");

  await prisma.webinarRegistration.upsert({
    where:  { webinarId_userId: { webinarId, userId } },
    create: { webinarId, userId, email, name },
    update: {},
  });

  revalidatePath("/account/events");
}
