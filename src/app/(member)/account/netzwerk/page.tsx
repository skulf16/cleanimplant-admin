import { prisma } from "@/lib/prisma";
import NetzwerkOverview from "@/components/member/NetzwerkOverview";

export default async function NetzwerkPage() {
  const experts = await prisma.expert.findMany({
    where:   { active: true },
    orderBy: [{ category: "asc" }, { lastName: "asc" }],
  });

  if (experts.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-[14px] text-white/40">Noch keine Experten verfügbar.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[18px] font-bold text-white mb-1">Experten-Netzwerk</h2>
        <p className="text-white/40 text-[13px]">{experts.length} Experten · Klicken für vollständiges Profil</p>
      </div>
      <NetzwerkOverview experts={experts} />
    </div>
  );
}
