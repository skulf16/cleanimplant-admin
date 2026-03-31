import Link from "next/link";
import SessionProvider from "@/components/layout/SessionProvider";
import {
  Users,
  MapPin,
  FileText,
  Settings,
  LayoutDashboard,
} from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/doctors", label: "Ärzte", icon: MapPin },
  { href: "/admin/users", label: "Benutzer", icon: Users },
  { href: "/admin/posts", label: "Beiträge", icon: FileText },
  { href: "/admin/settings", label: "Einstellungen", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex bg-[#f8f9fa]">
        {/* Sidebar */}
        <aside className="w-56 bg-[#1e293b] text-white flex flex-col fixed top-0 left-0 h-full z-40">
          <div className="p-5 border-b border-white/10">
            <Link href="/">
              <span className="text-lg font-bold text-[#2EA3F2]">
                my<span className="text-white">clean</span>dent
              </span>
            </Link>
            <p className="text-[11px] text-gray-400 mt-0.5">Admin Panel</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {adminNav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded text-[13px] text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10">
            <Link
              href="/"
              className="text-[12px] text-gray-400 hover:text-white transition-colors"
            >
              ← Zur Website
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <div className="ml-56 flex-1 flex flex-col min-h-screen">
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
