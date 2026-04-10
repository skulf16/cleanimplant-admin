"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, MapPin, FileText, Settings, LayoutDashboard, Upload, Star, ImageIcon, CalendarDays, BookOpen } from "lucide-react";

const adminNav = [
  { href: "/admin",              label: "Dashboard",         Icon: LayoutDashboard },
  { href: "/admin/doctors",      label: "Ärzte",             Icon: MapPin },
  { href: "/admin/users",        label: "Benutzer",          Icon: Users },
  { href: "/admin/posts",        label: "Beiträge",          Icon: FileText },
  { href: "/admin/experten",     label: "Experten-Netzwerk", Icon: Star },
  { href: "/admin/logos-media",  label: "Logos & Media",     Icon: ImageIcon },
  { href: "/admin/events",       label: "Events & Webinare", Icon: CalendarDays },
  { href: "/admin/bibliothek",   label: "Bibliothek",        Icon: BookOpen },
  { href: "/admin/settings",     label: "Einstellungen",     Icon: Settings },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-3 space-y-0.5">
      {adminNav.map(({ href, label, Icon }) => {
        const isActive =
          href === "/admin"
            ? pathname === "/admin"
            : pathname === href || pathname.startsWith(href + "/");

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-[13px] transition-colors ${
              isActive
                ? "bg-[#EFF6FF]/20 text-[#30A2F1] font-semibold"
                : "text-gray-400 hover:bg-[#EFF6FF]/10 hover:text-[#30A2F1]"
            }`}
          >
            <Icon size={15} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
