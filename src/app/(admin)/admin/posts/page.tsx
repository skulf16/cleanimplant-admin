import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { BLOG_CATEGORIES } from "@/lib/blogCategories";

const CATEGORY_LABELS: Record<string, string> = {
  GRUNDLAGEN:   "Grundlagen & Verfahren",
  ZAHNERSATZ:   "Zahnersatz & Prothetik",
  ERKRANKUNGEN: "Erkrankungen & Symptome",
  BEHANDLUNGEN: "Behandlungen & Eingriffe",
  KOSTEN:       "Kosten & Versicherung",
  RATGEBER:     "Ratgeber",
  ZAHNAERZTE:   "Zahnärzte",
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function AdminPostsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const activeCategory = BLOG_CATEGORIES.find(c => c.key === category)?.key ?? "alle";

  const posts = await prisma.post.findMany({
    where: activeCategory !== "alle" ? { category: activeCategory } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#333]">Beiträge</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 bg-[#30A2F1] !text-white px-4 py-2 rounded text-[13px] font-semibold hover:bg-[#1a8fd8] transition-colors"
        >
          <Plus size={15} /> Neuer Beitrag
        </Link>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        <Link
          href="/admin/posts"
          className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
            activeCategory === "alle"
              ? "bg-[#30A2F1] border-[#30A2F1] text-white"
              : "border-gray-200 text-[#666] hover:border-[#30A2F1] hover:text-[#30A2F1]"
          }`}
        >
          Alle
        </Link>
        {BLOG_CATEGORIES.map((c) => (
          <Link
            key={c.key}
            href={`/admin/posts?category=${c.key}`}
            className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              activeCategory === c.key
                ? "bg-[#30A2F1] border-[#30A2F1] text-white"
                : "border-gray-200 text-[#666] hover:border-[#30A2F1] hover:text-[#30A2F1]"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Titel</th>
              <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Kategorie</th>
              <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Domain</th>
              <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Datum</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="text-[14px] font-medium text-[#333]">{post.title}</p>
                  <p className="text-[12px] text-[#999]">/{post.slug}</p>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[12px] text-[#666] bg-gray-100 px-2 py-0.5 rounded-full">
                    {CATEGORY_LABELS[post.category] ?? post.category}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1">
                    {(post.domains ?? ["DE"]).includes("DE") && (
                      <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">.de</span>
                    )}
                    {(post.domains ?? []).includes("COM") && (
                      <span className="text-[11px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">.com</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                    post.published ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-100"
                  }`}>
                    {post.published ? "Veröffentlicht" : "Entwurf"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[13px] text-[#999]">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("de-DE")
                    : "–"}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link href={`/admin/posts/${post.id}`} className="text-[13px] text-[#30A2F1] hover:underline">
                    Bearbeiten
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <div className="text-center py-12 text-[#999] text-[14px]">Keine Beiträge in dieser Kategorie.</div>
        )}
      </div>
      <p className="text-[12px] text-[#999] mt-3">{posts.length} Beiträge</p>
    </div>
  );
}
