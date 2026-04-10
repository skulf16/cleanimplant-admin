import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, MapPin, ShieldCheck, FileText } from "lucide-react";

async function getStats() {
  const [total, verified, active, users, posts] = await Promise.all([
    prisma.dentistProfile.count(),
    prisma.dentistProfile.count({ where: { verified: true } }),
    prisma.dentistProfile.count({ where: { active: true } }),
    prisma.user.count(),
    prisma.post.count({ where: { published: true } }),
  ]);
  return { total, verified, active, users, posts };
}

async function getRecentDoctors() {
  return prisma.dentistProfile.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { categories: { include: { category: true } } },
  });
}

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getStats(), getRecentDoctors()]);

  const cards = [
    { label: "Arztprofile gesamt", value: stats.total, icon: MapPin, href: "/admin/doctors", color: "text-[#30A2F1]", bg: "bg-[#e8f5fe]" },
    { label: "Verifiziert", value: stats.verified, icon: ShieldCheck, href: "/admin/doctors?verified=true", color: "text-green-600", bg: "bg-green-50" },
    { label: "Aktiv", value: stats.active, icon: MapPin, href: "/admin/doctors?active=true", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Benutzer", value: stats.users, icon: Users, href: "/admin/users", color: "text-[#30A2F1]", bg: "bg-[#EFF6FF]" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#333] mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon size={18} className={card.color} />
            </div>
            <div className="text-2xl font-bold text-[#333]">{card.value}</div>
            <div className="text-[13px] text-[#666] mt-0.5">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Doctors */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#333]">Zuletzt hinzugefügt</h2>
          <Link href="/admin/doctors" className="text-[13px] text-[#30A2F1] hover:underline">
            Alle anzeigen
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recent.map((doc: typeof recent[0]) => (
            <div key={doc.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-[14px] font-medium text-[#333]">
                  {doc.title ? `${doc.title} ` : ""}{doc.firstName} {doc.lastName}
                </p>
                <p className="text-[12px] text-[#999]">
                  {doc.city}, {doc.country}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {doc.verified && (
                  <span className="text-[11px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Verifiziert
                  </span>
                )}
                {!doc.active && (
                  <span className="text-[11px] text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                    Inaktiv
                  </span>
                )}
                <Link
                  href={`/admin/doctors/${doc.id}`}
                  className="text-[12px] text-[#30A2F1] hover:underline"
                >
                  Bearbeiten
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
