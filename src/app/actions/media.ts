"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createMediaFile(formData: FormData) {
  const brands = formData.getAll("brands") as string[];

  await prisma.mediaFile.create({
    data: {
      title:       (formData.get("title") as string).trim(),
      description: (formData.get("description") as string)?.trim() || null,
      fileUrl:     (formData.get("fileUrl") as string).trim(),
      fileName:    (formData.get("fileName") as string).trim(),
      fileType:    (formData.get("fileType") as string).trim(),
      fileSize:    formData.get("fileSize") ? parseInt(formData.get("fileSize") as string) : null,
      brands,
      category:    (formData.get("category") as string)?.trim()     || "logos",
      downloadUrl: (formData.get("downloadUrl") as string)?.trim()   || null,
    },
  });

  revalidatePath("/admin/logos-media");
  revalidatePath("/account/logos-media");
}

export async function updateMediaFile(id: string, formData: FormData) {
  const brands = formData.getAll("brands") as string[];

  await prisma.mediaFile.update({
    where: { id },
    data: {
      title:       (formData.get("title") as string).trim(),
      description: (formData.get("description") as string)?.trim()  || null,
      brands,
      category:    (formData.get("category") as string)?.trim()     || "logos",
      downloadUrl: (formData.get("downloadUrl") as string)?.trim()  || null,
    },
  });

  revalidatePath("/admin/logos-media");
  revalidatePath("/account/logos-media");
}

export async function deleteMediaFile(id: string) {
  await prisma.mediaFile.delete({ where: { id } });
  revalidatePath("/admin/logos-media");
  revalidatePath("/account/logos-media");
}
