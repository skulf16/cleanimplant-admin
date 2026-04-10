import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BLOG_CATEGORIES, CATEGORY_META } from "@/lib/blogCategories";
import BlogGrid from "@/components/blog/BlogGrid";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return {};
  const meta = CATEGORY_META[cat.key];
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description },
  };
}

async function getPostsByCategory(categoryKey: string) {
  return prisma.post.findMany({
    where: { published: true, category: categoryKey },
    select: {
      id: true, slug: true, title: true,
      excerpt: true, imageUrl: true, category: true, publishedAt: true,
    },
    orderBy: { publishedAt: "desc" },
  });
}

export default async function KategoriePage({ params }: Props) {
  const { slug } = await params;
  const cat = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();

  const posts = await getPostsByCategory(cat.key);

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
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Wissenswertes
          </p>
          <h1 style={{ color: "#fff", fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
            {cat.label}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: "#FEF9F5", padding: "60px 0 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          {/* Category pill links */}
          <div style={{ display: "flex", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
            <a
              href="/wissenswert"
              style={{
                padding: "8px 20px",
                borderRadius: 20,
                border: "2px solid #F4907B",
                background: "#fff",
                color: "#00385E",
                fontWeight: 600,
                fontSize: 13,
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              Alle
            </a>
            {BLOG_CATEGORIES.filter((c) => c.visible).map((c) => (
              <a
                key={c.slug}
                href={`/wissenswert/kategorie/${c.slug}`}
                style={{
                  padding: "8px 20px",
                  borderRadius: 20,
                  border: "2px solid #F4907B",
                  background: c.key === cat.key ? "#F4907B" : "#fff",
                  color: c.key === cat.key ? "#fff" : "#00385E",
                  fontWeight: 600,
                  fontSize: 13,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                {c.label}
              </a>
            ))}
          </div>

          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <BlogGrid posts={posts as any} hideFilter />
        </div>
      </section>
    </>
  );
}
