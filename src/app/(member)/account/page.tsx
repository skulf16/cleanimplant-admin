import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { buildDoctorName } from "@/lib/utils";
import Link from "next/link";
import { MapPin, Phone, Globe, Mail, ShieldCheck, Edit } from "lucide-react";

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    include: {
      profile: {
        include: {
          categories: { include: { category: true } },
          socialLinks: true,
        },
      },
    },
  });

  if (!user) redirect("/login");

  const profile = user.profile;

  return (
    <div className="max-w-[1080px] mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#333]">Mein Konto</h1>
          <p className="text-[13px] text-[#999] mt-0.5">{user.email}</p>
        </div>
        {profile && (
          <Link
            href="/account/edit"
            className="flex items-center gap-2 text-[13px] bg-[#2EA3F2] text-white px-4 py-2 rounded hover:bg-[#1a8fd8] transition-colors"
          >
            <Edit size={14} /> Profil bearbeiten
          </Link>
        )}
      </div>

      {!profile ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-[#666] mb-4">
            Ihrem Konto ist noch kein Arztprofil zugewiesen.
          </p>
          <p className="text-[13px] text-[#999]">
            Bitte kontaktieren Sie uns unter{" "}
            <a href="mailto:info@mycleandent.de" className="text-[#2EA3F2]">
              info@mycleandent.de
            </a>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profil-Vorschau */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex gap-5 items-start">
                <div className="w-20 h-20 rounded-full bg-[#e8f5fe] flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {profile.imageUrl ? (
                    <img
                      src={profile.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[#2EA3F2] font-bold text-2xl">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[#333]">
                      {buildDoctorName(
                        profile.title,
                        profile.firstName,
                        profile.lastName,
                        profile.suffix
                      )}
                    </h2>
                    {profile.verified ? (
                      <span className="flex items-center gap-1 text-[11px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <ShieldCheck size={11} /> Verifiziert
                      </span>
                    ) : (
                      <span className="text-[11px] text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                        Ausstehend
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#666] mt-1 flex items-center gap-1">
                    <MapPin size={12} /> {profile.city}, {profile.country}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {profile.categories.map(({ category }: { category: { id: string; name: string } }) => (
                      <span
                        key={category.id}
                        className="text-[11px] bg-[#e8f5fe] text-[#2EA3F2] px-2.5 py-0.5 rounded-full"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {profile.bio && (
                <p className="mt-4 text-[13px] text-[#666] leading-relaxed border-t border-gray-100 pt-4">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Status Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-[#333] mb-3">Profil-Status</h3>
              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#666]">Sichtbarkeit</span>
                  <span className={profile.active ? "text-green-600" : "text-red-500"}>
                    {profile.active ? "Aktiv" : "Inaktiv"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">Verifizierung</span>
                  <span className={profile.verified ? "text-green-600" : "text-yellow-600"}>
                    {profile.verified ? "Verifiziert" : "Ausstehend"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">Domain .de</span>
                  <span className={profile.domains.includes("DE") ? "text-green-600" : "text-[#999]"}>
                    {profile.domains.includes("DE") ? "Aktiv" : "–"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">Domain .com</span>
                  <span className={profile.domains.includes("COM") ? "text-green-600" : "text-[#999]"}>
                    {profile.domains.includes("COM") ? "Aktiv" : "–"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Kontakt-Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-[#333] mb-3">Kontaktdaten</h3>
              <ul className="space-y-2.5">
                {profile.phone && (
                  <li className="flex items-center gap-2 text-[13px] text-[#666]">
                    <Phone size={13} className="text-[#2EA3F2]" /> {profile.phone}
                  </li>
                )}
                {profile.email && (
                  <li className="flex items-center gap-2 text-[13px] text-[#666]">
                    <Mail size={13} className="text-[#2EA3F2]" /> {profile.email}
                  </li>
                )}
                {profile.website && (
                  <li className="flex items-center gap-2 text-[13px] text-[#2EA3F2]">
                    <Globe size={13} /> {profile.website}
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-[#333] mb-3">Schnelllinks</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/places/${profile.slug}`}
                    className="text-[13px] text-[#2EA3F2] hover:underline"
                    target="_blank"
                  >
                    Öffentliches Profil ansehen →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/password"
                    className="text-[13px] text-[#666] hover:text-[#2EA3F2] transition-colors"
                  >
                    Passwort ändern
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
