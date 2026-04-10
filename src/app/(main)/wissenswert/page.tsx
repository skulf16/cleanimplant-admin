import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import BlogGrid from "@/components/blog/BlogGrid";

export const metadata: Metadata = {
  title: "Wissenswertes – mycleandent",
  description: "Artikel, Interviews und Neuigkeiten rund um Zahnimplantate und die CleanImplant-Zertifizierung.",
};

async function getPosts() {
  return prisma.post.findMany({
    where: { published: true },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      imageUrl: true,
      category: true,
      publishedAt: true,
    },
    orderBy: { publishedAt: "desc" },
  });
}

export default async function WissenswertPage() {
  const posts = await getPosts();

  return (
    <>
      {/* Hero */}
      <section
        style={{
          marginTop: "-72px",
          height: "28vh",
          backgroundImage: "url('https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/mycleandent-bg-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
          paddingBottom: "2rem",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", padding: "0 24px" }}>
          <h1 style={{ color: "#fff", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
            Wissenswertes
          </h1>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: "#FEF9F5", padding: "60px 0 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <BlogGrid posts={posts as any} />
        </div>
      </section>
    </>
  );
}
