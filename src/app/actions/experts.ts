"use server";

import { prisma } from "@/lib/prisma";
import { ExpertCategory } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function formDataToExpert(formData: FormData) {
  const benefits = (formData.get("benefits") as string)
    .split("\n")
    .map(b => b.trim())
    .filter(Boolean);

  // benefitLinks: JSON string from the form
  let benefitLinks: { label: string; url: string }[] = [];
  try {
    const raw = formData.get("benefitLinks") as string;
    if (raw) benefitLinks = JSON.parse(raw);
  } catch {}

  const categories = formData.getAll("categories") as ExpertCategory[];
  // keep legacy category in sync with first selected
  const category = categories[0] ?? ("KI_IT" as ExpertCategory);

  return {
    category,
    categories,
    firstName:    (formData.get("firstName") as string).trim(),
    lastName:     (formData.get("lastName") as string).trim(),
    bio:          (formData.get("bio") as string)?.trim()        || null,
    leistungen:   (formData.get("leistungen") as string)?.trim() || null,
    benefits,
    benefitLinks,
    company:      (formData.get("company") as string)?.trim()    || null,
    imageUrl:     (formData.get("imageUrl") as string)?.trim()   || null,
    address:      (formData.get("address") as string)?.trim()    || null,
    email:        (formData.get("email") as string)?.trim()      || null,
    phone:        (formData.get("phone") as string)?.trim()      || null,
    website:      (formData.get("website") as string)?.trim()    || null,
    profileUrl:   (formData.get("profileUrl") as string)?.trim() || null,
    linkedin:     (formData.get("linkedin") as string)?.trim()   || null,
    instagram:    (formData.get("instagram") as string)?.trim()  || null,
    facebook:     (formData.get("facebook") as string)?.trim()   || null,
    active:       formData.get("active") === "true",
  };
}

export async function createExpert(formData: FormData) {
  const data = formDataToExpert(formData);
  const expert = await prisma.expert.create({ data });
  revalidatePath("/admin/experten");
  redirect(`/admin/experten/${expert.id}`);
}

export async function updateExpert(id: string, formData: FormData) {
  const data = formDataToExpert(formData);
  await prisma.expert.update({ where: { id }, data });
  revalidatePath("/admin/experten");
  revalidatePath(`/admin/experten/${id}`);
}

export async function deleteExpert(id: string) {
  await prisma.expert.delete({ where: { id } });
  revalidatePath("/admin/experten");
  redirect("/admin/experten");
}
