import Link from "next/link";
import { MapPin, Phone, Globe, ShieldCheck } from "lucide-react";
import { buildDoctorName } from "@/lib/utils";
import type { DentistWithRelations } from "@/types";

export default function DoctorCard({ doctor }: { doctor: DentistWithRelations }) {
  const fullName = buildDoctorName(
    doctor.title,
    doctor.firstName,
    doctor.lastName,
    doctor.suffix
  );

  return (
    <Link
      href={`/places/${doctor.slug}`}
      className="bg-white rounded-lg border border-gray-200 hover:border-[#2EA3F2] hover:shadow-md transition-all p-5 flex gap-4 group"
    >
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full bg-[#e8f5fe] flex-shrink-0 overflow-hidden flex items-center justify-center">
        {doctor.imageUrl ? (
          <img
            src={doctor.imageUrl}
            alt={fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[#2EA3F2] font-bold text-xl">
            {doctor.firstName[0]}
            {doctor.lastName[0]}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[15px] text-[#333] group-hover:text-[#2EA3F2] transition-colors truncate">
            {fullName}
          </h3>
          {doctor.verified && (
            <span className="flex-shrink-0 flex items-center gap-1 text-[11px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <ShieldCheck size={11} /> Verifiziert
            </span>
          )}
        </div>

        {doctor.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {doctor.categories.slice(0, 2).map(({ category }: { category: { id: string; name: string } }) => (
              <span
                key={category.id}
                className="text-[11px] bg-[#e8f5fe] text-[#2EA3F2] px-2 py-0.5 rounded-full"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-2 space-y-1">
          <p className="text-[13px] text-[#666] flex items-center gap-1.5">
            <MapPin size={12} className="flex-shrink-0 text-[#2EA3F2]" />
            {[doctor.street, doctor.zip, doctor.city].filter(Boolean).join(", ")}
          </p>
          {doctor.phone && (
            <p className="text-[13px] text-[#666] flex items-center gap-1.5">
              <Phone size={12} className="flex-shrink-0 text-[#2EA3F2]" />
              {doctor.phone}
            </p>
          )}
          {doctor.website && (
            <p className="text-[13px] text-[#2EA3F2] flex items-center gap-1.5 truncate">
              <Globe size={12} className="flex-shrink-0" />
              {doctor.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </p>
          )}
        </div>

        {doctor.bio && (
          <p className="text-[13px] text-[#999] mt-2 line-clamp-2 leading-relaxed">
            {doctor.bio}
          </p>
        )}
      </div>
    </Link>
  );
}
