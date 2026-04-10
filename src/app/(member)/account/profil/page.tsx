import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ExternalLink, CheckCircle, MapPin, Building2 } from "lucide-react";
import Image from "next/image";

export default async function ProfilPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const profiles = await prisma.dentistProfile.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      slug: true,
      citySlug: true,
      title: true,
      firstName: true,
      lastName: true,
      suffix: true,
      practiceName: true,
      city: true,
      imageUrl: true,
      verified: true,
      active: true,
    },
    orderBy: { lastName: "asc" },
  });

  if (profiles.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.5)" }}>
          Kein Profil mit diesem Account verknüpft.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-[18px] font-semibold text-white mb-1">
        {profiles.length === 1 ? "Mein Profil" : "Meine Profile"}
      </h2>
      <p className="text-[13px] mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
        {profiles.length === 1
          ? "Ihr öffentliches Profil auf mycleandent"
          : `${profiles.length} Profile sind mit Ihrem Account verknüpft`}
      </p>

      <div className="space-y-4">
        {profiles.map((profile) => {
          const name = [profile.title, profile.firstName, profile.lastName, profile.suffix]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={profile.id}
              className="rounded-xl p-5 flex gap-4 items-start"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                {profile.imageUrl ? (
                  <Image
                    src={profile.imageUrl}
                    alt={name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[22px] font-bold"
                    style={{ color: "rgba(255,255,255,0.3)" }}>
                    {profile.firstName?.[0]}{profile.lastName?.[0]}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[16px] font-semibold text-white">{name}</span>
                  {profile.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80" }}>
                      <CheckCircle size={11} />
                      Verifiziert
                    </span>
                  )}
                  {!profile.active && (
                    <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
                      Inaktiv
                    </span>
                  )}
                </div>

                {profile.practiceName && (
                  <div className="flex items-center gap-1.5 text-[13px] mb-0.5"
                    style={{ color: "rgba(255,255,255,0.55)" }}>
                    <Building2 size={13} />
                    {profile.practiceName}
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-[13px] mb-3"
                  style={{ color: "rgba(255,255,255,0.45)" }}>
                  <MapPin size={13} />
                  {profile.city}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <a
                    href={`/zahnarzt/${profile.citySlug}/${profile.slug}?preview=1`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors"
                    style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
                  >
                    <ExternalLink size={14} />
                    Profil ansehen
                  </a>
                  <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    mycleandent.de/zahnarzt/{profile.citySlug}/{profile.slug}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
