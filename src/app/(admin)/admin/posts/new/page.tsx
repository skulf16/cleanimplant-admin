import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-6">
        <a href="/admin/posts" className="text-[13px] text-[#999] hover:text-[#333] transition-colors">
          ← Zurück zur Liste
        </a>
        <h1 className="text-2xl font-bold text-[#333] mt-2">Neuer Beitrag</h1>
      </div>
      <PostForm />
    </div>
  );
}
