"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "ADMIN") throw new Error("Unauthorized");
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createPost(formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const base = slugify(title);
  let slug = base;
  let n = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }

  const domains = formData.getAll("domains") as string[];
  const published = formData.get("published") === "on";
  const publishedAtRaw = formData.get("publishedAt") as string;

  const post = await prisma.post.create({
    data: {
      slug,
      title,
      excerpt:     formData.get("excerpt")  as string || null,
      content:     formData.get("content")  as string || "",
      imageUrl:    formData.get("imageUrl") as string || null,
      category:    (formData.get("category") as string) ?? "GRUNDLAGEN",
      domains:     domains.length > 0 ? domains : ["DE"],
      published,
      publishedAt: published && publishedAtRaw ? new Date(publishedAtRaw) : published ? new Date() : null,
      metaTitle:   formData.get("metaTitle") as string || null,
      metaDesc:    formData.get("metaDesc")  as string || null,
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/wissenswert");
  redirect(`/admin/posts/${post.id}`);
}

export async function updatePost(id: string, formData: FormData) {
  await requireAdmin();

  const domains = formData.getAll("domains") as string[];
  const published = formData.get("published") === "on";
  const publishedAtRaw = formData.get("publishedAt") as string;

  await prisma.post.update({
    where: { id },
    data: {
      title:       formData.get("title")    as string,
      excerpt:     formData.get("excerpt")  as string || null,
      content:     formData.get("content")  as string || "",
      imageUrl:    formData.get("imageUrl") as string || null,
      category:    (formData.get("category") as string) ?? "GRUNDLAGEN",
      domains:     domains.length > 0 ? domains : ["DE"],
      published,
      publishedAt: published && publishedAtRaw ? new Date(publishedAtRaw) : published ? new Date() : null,
      metaTitle:   formData.get("metaTitle") as string || null,
      metaDesc:    formData.get("metaDesc")  as string || null,
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/wissenswert");
  revalidatePath("/admin/posts/" + id);
}

export async function deletePost(id: string) {
  await requireAdmin();
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/posts");
  revalidatePath("/wissenswert");
  redirect("/admin/posts");
}
