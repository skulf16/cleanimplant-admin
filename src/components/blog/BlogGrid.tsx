"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BLOG_CATEGORIES } from "@/lib/blogCategories";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  imageUrl: string | null;
  category: string;
  publishedAt: Date | null;
};

type Category = "alle" | typeof BLOG_CATEGORIES[number]["key"];

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "alle", label: "Alle" },
  ...BLOG_CATEGORIES.filter((c) => c.visible).map((c) => ({ key: c.key as Exclude<Category, "alle">, label: c.label })),
];

// Placeholder cards shown when no posts are in the DB yet
const PLACEHOLDERS = [
  { id: "p1", slug: "wie-funktioniert-ein-implantat",    title: "Wie funktioniert ein Implantat?",          category: "GRUNDLAGEN", image: "https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/illu-1.jpg" },
  { id: "p2", slug: "vorteile-implantatversorgung",      title: "Die Vorteile einer Implantatversorgung",   category: "GRUNDLAGEN", image: "https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/illu-13.jpg" },
  { id: "p3", slug: "zahnimplantate-unterschiede",       title: "Wie Zahnimplantate sich unterscheiden",    category: "GRUNDLAGEN", image: "https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/illu-12.jpg" },
];

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" });
}

export default function BlogGrid({ posts, hideFilter, defaultCategory }: { posts: Post[]; hideFilter?: boolean; defaultCategory?: Category }) {
  const [active, setActive] = useState<Category>(defaultCategory ?? "alle");

  const source = posts.length > 0 ? posts : PLACEHOLDERS.map(p => ({
    ...p, excerpt: null, publishedAt: null,
  }));

  const filtered = active === "alle"
    ? source
    : source.filter(p => p.category === active);

  return (
    <>
      {/* Category filter */}
      {!hideFilter && (
        <div style={{ display: "flex", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
          {CATEGORIES.map(({ key, label }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => setActive(key)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 20,
                  border: "2px solid #F4907B",
                  background: isActive ? "#F4907B" : "#fff",
                  color: isActive ? "#fff" : "#00385E",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s ease",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <p style={{ color: "#00385E", fontSize: 14, textAlign: "center", padding: "60px 0" }}>
          Keine Beiträge in dieser Kategorie vorhanden.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((post) => {
            const imgSrc = (post as Post & { image?: string; imageUrl?: string | null }).image ?? (post as Post & { imageUrl?: string | null }).imageUrl ?? null;
            return (
              <Link
                key={post.id}
                href={`/wissenswert/${post.slug}`}
                className="group"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                {/* Fixed-height image area */}
                <div style={{ position: "relative", height: 220, background: "#FDF5F2", flexShrink: 0 }}>
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={post.title}
                      fill
                      unoptimized
                      style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                  ) : (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg viewBox="0 0 120 80" style={{ width: 100, opacity: 0.3 }}>
                        <rect x="10" y="10" width="100" height="60" rx="8" fill="#BEC4AB" />
                        <circle cx="40" cy="40" r="20" fill="#F4907B" />
                        <path d="M70 30h30M70 45h25M70 55h20" stroke="white" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", flex: 1, minHeight: 160 }}>
                  {/* Date tag – always reserve space */}
                  <span style={{
                    display: "inline-block",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#F4907B",
                    background: "#FDDAD0",
                    borderRadius: 4,
                    padding: "3px 8px",
                    marginBottom: 10,
                    alignSelf: "flex-start",
                    letterSpacing: "0.02em",
                    visibility: post.publishedAt ? "visible" : "hidden",
                  }}>
                    {post.publishedAt ? formatDate(post.publishedAt) : "–"}
                  </span>
                  <h3 style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#00385E",
                    lineHeight: 1.4,
                    margin: "0 0 8px",
                  }}>
                    {post.title}
                  </h3>
                  <p style={{
                    fontSize: 13,
                    color: "#667",
                    lineHeight: 1.65,
                    margin: 0,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "3.9em",
                  }}>
                    {post.excerpt ?? ""}
                  </p>
                  <span style={{
                    marginTop: "auto",
                    paddingTop: 12,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#F4907B",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}>
                    Weiterlesen →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
