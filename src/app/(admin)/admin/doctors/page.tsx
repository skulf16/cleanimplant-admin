import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShieldCheck, Plus } from "lucide-react";

export default async function AdminDoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; country?: string; verified?: string; active?: string }>;
}) {
  const params = await searchParams;

  const where: Record<string, unknown> = {};
  if (params.q) {
    where.OR = [
      { firstName: { contains: params.q, mode: "insensitive" } },
      { lastName: { contains: params.q, mode: "insensitive" } },
      { city: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.country) where.country = params.country;
  if (params.verified === "true") where.verified = true;
  if (params.active === "true") where.active = true;

  const doctors = await prisma.dentistProfile.findMany({
    where,
    include: { categories: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#333]">Arztprofile</h1>
        <Link
          href="/admin/doctors/new"
          className="flex items-center gap-2 bg-[#2EA3F2] text-white px-4 py-2 rounded text-[13px] font-semibold hover:bg-[#1a8fd8] transition-colors"
        >
          <Plus size={15} /> Neues Profil
        </Link>
      </div>

      {/* Filter */}
      <form method="get" className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          name="q"
          defaultValue={params.q}
          placeholder="Name oder Stadt..."
          className="border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2EA3F2] w-56"
        />
        <select
          name="country"
          defaultValue={params.country ?? ""}
          className="border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2EA3F2]"
        >
          <option value="">Alle Länder</option>
          <option value="DE">Deutschland</option>
          <option value="AT">Österreich</option>
          <option value="CH">Schweiz</option>
        </select>
        <button
          type="submit"
          className="bg-[#2EA3F2] text-white px-4 py-2 rounded text-[13px] hover:bg-[#1a8fd8] transition-colors"
        >
          Suchen
        </button>
        {(params.q || params.country) && (
          <a href="/admin/doctors" className="text-[13px] text-[#666] py-2">
            Zurücksetzen
          </a>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Name</th>
              <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Ort</th>
              <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Domains</th>
              <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {doctors.map((doc: typeof doctors[0]) => (
              <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="text-[14px] font-medium text-[#333]">
                    {doc.title ? `${doc.title} ` : ""}{doc.firstName} {doc.lastName}
                  </p>
                  <p className="text-[12px] text-[#999]">/{doc.slug}</p>
                </td>
                <td className="px-5 py-3.5 text-[13px] text-[#666]">
                  {doc.city}, {doc.country}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1">
                    {doc.domains.includes("DE") && (
                      <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">.de</span>
                    )}
                    {doc.domains.includes("COM") && (
                      <span className="text-[11px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">.com</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5 flex-wrap">
                    {doc.verified && (
                      <span className="flex items-center gap-1 text-[11px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <ShieldCheck size={10} /> Verifiziert
                      </span>
                    )}
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                      doc.active ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"
                    }`}>
                      {doc.active ? "Aktiv" : "Inaktiv"}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    href={`/admin/doctors/${doc.id}`}
                    className="text-[13px] text-[#2EA3F2] hover:underline"
                  >
                    Bearbeiten
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {doctors.length === 0 && (
          <div className="text-center py-12 text-[#999] text-[14px]">
            Keine Profile gefunden.
          </div>
        )}
      </div>

      <p className="text-[12px] text-[#999] mt-3">{doctors.length} Profile</p>
    </div>
  );
}
