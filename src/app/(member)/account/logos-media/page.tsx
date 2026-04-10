import { prisma } from "@/lib/prisma";
import LogosMediaOverview from "@/components/member/LogosMediaOverview";

export default async function MemberLogosMediaPage() {
  const files = await prisma.mediaFile.findMany({
    where: { category: { not: "bibliothek" } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[18px] font-bold text-white mb-1">Logos & Media</h2>
        <p className="text-white/40 text-[13px]">Laden Sie Logos, Siegel und Marketingmaterialien herunter.</p>
      </div>
      <LogosMediaOverview files={files} />
    </div>
  );
}
