import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { deletePost } from "@/app/actions/posts";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <a href="/admin/posts" className="text-[13px] text-[#999] hover:text-[#333] transition-colors">
            ← Zurück zur Liste
          </a>
          <h1 className="text-2xl font-bold text-[#333] mt-2">{post.title}</h1>
          <p className="text-[13px] text-[#999] mt-0.5">/{post.slug}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/admin/posts/${id}/preview`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-[#30A2F1] border border-[#30A2F1] hover:bg-[#EFF6FF] px-3 py-1.5 rounded transition-colors"
          >
            Vorschau →
          </a>
          <form action={async () => { "use server"; await deletePost(id); }}>
            <button
              type="submit"
              className="text-[13px] text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded transition-colors"
            >
              Beitrag löschen
            </button>
          </form>
        </div>
      </div>
      <PostForm post={post} />
    </div>
  );
}
