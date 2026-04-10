import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ExpertForm from "@/components/admin/ExpertForm";
import DeleteExpertButton from "@/components/admin/DeleteExpertButton";
import { updateExpert } from "@/app/actions/experts";
import { EXPERT_CATEGORY_LABEL } from "@/lib/expertCategories";
import { ExpertCategory } from "@/generated/prisma/client";

export default async function EditExpertPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const expert = await prisma.expert.findUnique({ where: { id } });
  if (!expert) notFound();

  const updateWithId = updateExpert.bind(null, id);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <a href="/admin/experten" className="text-[13px] text-[#999] hover:text-[#333] transition-colors">
            ← Zurück zur Liste
          </a>
          <h1 className="text-2xl font-bold text-[#333] mt-2">
            {expert.firstName} {expert.lastName}
          </h1>
          <p className="text-[13px] text-[#999] mt-0.5">
            {EXPERT_CATEGORY_LABEL[expert.category as ExpertCategory]}
          </p>
        </div>
        <DeleteExpertButton id={id} />
      </div>

      <ExpertForm expert={expert} action={updateWithId} />
    </div>
  );
}
