import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

export default async function PostPreviewPage({ params }: Props) {
  const { id } = await params;

  // Lädt den Post OHNE published-Filter – auch Drafts
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      publishedAt: true,
      published: true,
      category: true,
    },
  });

  if (!post) notFound();

  return (
    <>
      {/* Draft-Banner */}
      {!post.published && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: "#F59E0B",
          color: "#fff",
          textAlign: "center",
          padding: "10px 16px",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.04em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}>
          <span>⚠️ DRAFT-VORSCHAU – nicht veröffentlicht</span>
          <Link
            href={`/admin/posts/${post.id}`}
            style={{ color: "#fff", textDecoration: "underline", fontWeight: 600 }}
          >
            ← Zurück zum Editor
          </Link>
        </div>
      )}

      {/* Post-Inhalt (gleiche Darstellung wie öffentliche Seite) */}
      <section style={{
        background: "#FEF9F5",
        padding: `${post.published ? "80px" : "120px"} 0 100px`,
      }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px" }}>

          {post.imageUrl && (
            <div style={{ marginBottom: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.imageUrl}
                alt={post.title}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  borderRadius: 8,
                  boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                }}
              />
            </div>
          )}

          {post.publishedAt && (
            <p style={{ fontSize: 13, color: "#aaa", textAlign: "center", margin: "0 0 16px" }}>
              {formatDate(post.publishedAt)}
            </p>
          )}

          <h1 style={{
            color: "#F5907B",
            fontSize: "clamp(26px, 4vw, 36px)",
            fontWeight: 700,
            lineHeight: 1.2,
            textAlign: "center",
            margin: "0 0 32px",
          }}>
            {post.title}
          </h1>

          {post.excerpt && (
            <p style={{
              fontSize: 16,
              color: "#00385E",
              fontWeight: 600,
              lineHeight: 1.7,
              textAlign: "center",
              margin: "0 0 32px",
            }}>
              {post.excerpt}
            </p>
          )}

          <hr style={{ border: "none", borderTop: "1px solid #e8dfd8", margin: "0 0 32px" }} />

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
