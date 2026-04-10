import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNav from "./AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-[#f1f3f5]">
      {/* Sidebar */}
      <aside className="w-56 bg-[#1E293B] text-white flex flex-col fixed top-0 left-0 h-full z-40">
        <div className="p-5 border-b border-white/10">
          <Link href="/">
            <span className="text-[18px] font-bold leading-none">
              <span className="text-[#8E9E7A]">my</span>
              <span className="text-white">clean</span>
              <span className="text-[#8E9E7A]">dent</span>
            </span>
          </Link>
          <p className="text-[11px] text-gray-400 mt-1">Admin Panel</p>
        </div>
        <AdminNav />
        <div className="p-4 border-t border-white/10">
          <p className="text-[11px] text-gray-500 mb-1">
            {session.user?.email}
          </p>
          <Link href="/" className="text-[12px] text-gray-400 hover:text-white transition-colors">
            ← Zur Website
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="ml-56 flex-1 min-h-screen">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
