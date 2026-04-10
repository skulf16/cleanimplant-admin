import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DoctorForm from "@/components/admin/DoctorForm";
import CredentialsForm from "@/components/admin/CredentialsForm";
import AssignAccountSelect from "@/components/admin/AssignAccountSelect";
import { deleteDoctor } from "@/app/actions/doctors";
import { ExternalLink } from "lucide-react";

export default async function EditDoctorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [doctor, categories, allUsers] = await Promise.all([
    prisma.dentistProfile.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } },
        user: { select: { id: true, email: true, username: true, createdAt: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.user.findMany({
      orderBy: { email: "asc" },
      select: {
        id: true,
        email: true,
        username: true,
        profiles: {
          select: { firstName: true, lastName: true, city: true },
        },
      },
    }),
  ]);

  if (!doctor) notFound();

  // Falls kein User verknüpft, trotzdem nach einem User mit der Profil-E-Mail suchen
  let linkedUser = doctor.user;
  if (!linkedUser && doctor.email) {
    const userByEmail = await prisma.user.findUnique({
      where: { email: doctor.email },
      select: { id: true, email: true, username: true, createdAt: true },
    });
    if (userByEmail) linkedUser = userByEmail;
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <a
            href="/admin/doctors"
            className="text-[13px] text-[#999] hover:text-[#333] transition-colors"
          >
            ← Zurück zur Liste
          </a>
          <h1 className="text-2xl font-bold text-[#333] mt-2">
            {doctor.title ? `${doctor.title} ` : ""}
            {doctor.firstName} {doctor.lastName}
          </h1>
          <p className="text-[13px] text-[#999] mt-0.5">/{doctor.slug}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/zahnarzt/${doctor.citySlug}/${doctor.slug}?preview=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] text-[#30A2F1] border border-[#30A2F1] hover:bg-[#30A2F1] hover:!text-white px-3 py-1.5 rounded transition-colors"
          >
            <ExternalLink size={13} /> Profil ansehen
          </a>
          <form
            action={async () => {
              "use server";
              await deleteDoctor(id);
            }}
          >
            <button
              type="submit"
              className="text-[13px] text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded transition-colors"
            >
              Profil löschen
            </button>
          </form>
        </div>
      </div>

      {/* Account zuweisen (vorhandener Account) */}
      <AssignAccountSelect
        doctorId={id}
        currentUserId={doctor.userId ?? null}
        users={allUsers}
      />

      {/* Zugangsdaten erstellen / bearbeiten */}
      <CredentialsForm doctorId={id} user={linkedUser ?? null} doctorEmail={doctor.email ?? ""} />

      {/* Profildaten */}
      <DoctorForm doctor={doctor} categories={categories} />
    </div>
  );
}
