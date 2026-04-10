import { prisma } from "@/lib/prisma";
import DoctorForm from "@/components/admin/DoctorForm";

export default async function NewDoctorPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6">
        <a href="/admin/doctors" className="text-[13px] text-[#999] hover:text-[#333] transition-colors">
          ← Zurück zur Liste
        </a>
        <h1 className="text-2xl font-bold text-[#333] mt-2">Neues Profil anlegen</h1>
      </div>
      <DoctorForm categories={categories} />
    </div>
  );
}
