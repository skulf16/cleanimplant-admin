import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { EXPERT_CATEGORY_LABEL } from "@/lib/expertCategories";
import { ExpertCategory } from "@/generated/prisma/client";

export default async function AdminExpertenPage() {
  const experts = await prisma.expert.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#333]">Experten-Netzwerk</h1>
          <p className="text-[13px] text-[#999] mt-0.5">{experts.length} Experten</p>
        </div>
        <Link
          href="/admin/experten/new"
          className="flex items-center gap-2 bg-[#30A2F1] hover:bg-[#1a8fd8] text-white text-[13px] font-semibold px-4 py-2 rounded transition-colors"
        >
          <Plus size={15} /> Experte hinzufügen
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-5 py-3 font-semibold text-[#666] uppercase tracking-wide text-[12px]">Name</th>
              <th className="px-5 py-3 font-semibold text-[#666] uppercase tracking-wide text-[12px]">Kategorie</th>
              <th className="px-5 py-3 font-semibold text-[#666] uppercase tracking-wide text-[12px]">Unternehmen</th>
              <th className="px-5 py-3 font-semibold text-[#666] uppercase tracking-wide text-[12px]">Status</th>
              <th className="px-5 py-3 font-semibold text-[#666] uppercase tracking-wide text-[12px]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {experts.map(expert => (
              <tr key={expert.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {expert.imageUrl ? (
                      <img src={expert.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#e8f5fe] flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-[#30A2F1]">
                        {expert.firstName[0]}{expert.lastName[0]}
                      </div>
                    )}
                    <span className="font-medium text-[#333]">{expert.firstName} {expert.lastName}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[12px] bg-[#e8f5fe] text-[#30A2F1] px-2.5 py-0.5 rounded-full">
                    {EXPERT_CATEGORY_LABEL[expert.category as ExpertCategory]}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[#666]">{expert.company ?? "–"}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-[12px] px-2.5 py-0.5 rounded-full ${expert.active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                    {expert.active ? "Aktiv" : "Inaktiv"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link href={`/admin/experten/${expert.id}`} className="text-[#30A2F1] hover:underline">
                    Bearbeiten
                  </Link>
                </td>
              </tr>
            ))}
            {experts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-[#999]">
                  Noch keine Experten angelegt.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
