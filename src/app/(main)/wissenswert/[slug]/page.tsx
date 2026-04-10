import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, imageUrl: true, metaTitle: true, metaDesc: true, publishedAt: true },
  });
  if (!post) return {};

  const title = post.metaTitle ?? `${post.title} – mycleandent`;
  const description = post.metaDesc ?? post.excerpt ?? undefined;
  const imageUrl = post.imageUrl ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

async function getPost(slug: string) {
  return prisma.post.findUnique({
    where: { slug, published: true },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      publishedAt: true,
      category: true,
      metaTitle: true,
      metaDesc: true,
    },
  });
}

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://mycleandent.de";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.metaTitle ?? post.title,
    description: post.metaDesc ?? post.excerpt ?? undefined,
    image: post.imageUrl ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    url: `${baseUrl}/wissenswert/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: "mycleandent",
      url: baseUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <section style={{ background: "#FDF5F2", padding: "80px 0 100px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px" }}>

        {/* Post image */}
        {post.imageUrl && (
          <div style={{ marginBottom: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.imageUrl}
              alt={post.title}
              style={{ width: "100%", height: "auto", display: "block", borderRadius: 8 }}
            />
          </div>
        )}

        {/* Date */}
        {post.publishedAt && (
          <p style={{ fontSize: 13, color: "#aaa", textAlign: "center", margin: "0 0 16px" }}>
            {formatDate(post.publishedAt)}
          </p>
        )}

        {/* Headline */}
        <h1 style={{ color: "#F4907B", fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, lineHeight: 1.2, textAlign: "center", margin: "0 0 32px" }}>
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p style={{ fontSize: 16, color: "#00385E", fontWeight: 600, lineHeight: 1.7, textAlign: "center", margin: "0 0 32px" }}>
            {post.excerpt}
          </p>
        )}

        {/* Divider */}
        <hr style={{ border: "none", borderTop: "1px solid #e8dfd8", margin: "0 0 32px" }} />

        {/* Body */}
        <div
          className="post-body"
          style={{ color: "#00385E", fontSize: 15, lineHeight: 1.9 }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </section>
    </>
  );
}
