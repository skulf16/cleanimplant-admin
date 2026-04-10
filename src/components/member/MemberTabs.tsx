"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  UserCircle,
  Image as ImageIcon,
  Users,
  CalendarDays,
  BookOpen,
} from "lucide-react";

const TABS = [
  { href: "/account/einstellungen", label: "Einstellungen",       icon: Settings      },
  { href: "/account/profil",        label: "mycleandent Profile", icon: UserCircle    },
  { href: "/account/logos-media",   label: "Logos & Media",       icon: ImageIcon     },
  { href: "/account/netzwerk",      label: "Experten-Netzwerk",   icon: Users         },
  { href: "/account/events",        label: "Events & Webinare",   icon: CalendarDays  },
  { href: "/account/bibliothek",    label: "Bibliothek",          icon: BookOpen      },
];

export default function MemberTabs() {
  const pathname = usePathname();

  return (
    <div className="pt-6 pb-0">
      {/* Desktop: 6-Spalten-Grid */}
      <div className="hidden sm:grid gap-3" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 px-4 py-4 rounded-lg text-[13px] font-medium transition-all w-full"
              style={{
                backgroundColor: active ? "#2a6496" : "#ffffff",
                color:           active ? "#ffffff" : "#2a6496",
              }}
            >
              <Icon size={24} />
              <span className="text-center leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Mobile: horizontales Scroll-Menü */}
      <div className="flex sm:hidden gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-lg text-[11px] font-medium transition-all flex-shrink-0"
              style={{
                backgroundColor: active ? "#2a6496" : "#ffffff",
                color:           active ? "#ffffff" : "#2a6496",
                minWidth: 80,
              }}
            >
              <Icon size={20} />
              <span className="text-center leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
