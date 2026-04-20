import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import MemberDoctorForm from "@/components/member/MemberDoctorForm";

export default async function EditProfilPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");
  const { id } = await params;

  const userId = session.user.id as string;
  const role = (session.user as { role?: string }).role;

  const doctor = await prisma.dentistProfile.findUnique({
    where: { id },
    include: { categories: { include: { category: true } } },
  });
  if (!doctor) notFound();
  if (role !== "ADMIN" && doctor.userId !== userId) notFound();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Link
        href="/account/profil"
        className="inline-flex items-center gap-1 text-[13px] mb-4 hover:text-white transition-colors"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        <ChevronLeft size={14} /> Zurück zu meinen Profilen
      </Link>
      <h2 className="text-[18px] font-semibold text-white mb-1">
        Profil bearbeiten
      </h2>
      <p className="text-[13px] mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
        {doctor.firstName} {doctor.lastName}
      </p>

      <div className="bg-[#f5f6f8] rounded-xl p-6">
        <MemberDoctorForm doctor={doctor} />
      </div>
    </div>
  );
}
