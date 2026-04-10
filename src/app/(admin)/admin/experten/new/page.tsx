import ExpertForm from "@/components/admin/ExpertForm";
import { createExpert } from "@/app/actions/experts";

export default function NewExpertPage() {
  return (
    <div>
      <div className="mb-6">
        <a href="/admin/experten" className="text-[13px] text-[#999] hover:text-[#333] transition-colors">
          ← Zurück zur Liste
        </a>
        <h1 className="text-2xl font-bold text-[#333] mt-2">Neuen Experten anlegen</h1>
      </div>
      <ExpertForm action={createExpert} />
    </div>
  );
}
