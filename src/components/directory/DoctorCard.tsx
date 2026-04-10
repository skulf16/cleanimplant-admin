import Link from "next/link";
import { MapPin } from "lucide-react";
import { buildDoctorName } from "@/lib/utils";
import type { DentistWithRelations } from "@/types";
import DoctorCardHours from "./DoctorCardHours";
import type { OpeningHoursData } from "../doctor/OpeningHoursStatus";

export default function DoctorCard({ doctor }: { doctor: DentistWithRelations }) {
  const fullName = buildDoctorName(
    doctor.title,
    doctor.firstName,
    doctor.lastName,
    doctor.suffix
  );
  const initials = (doctor.firstName?.[0] ?? "") + (doctor.lastName?.[0] ?? "");
  const addressLine1 = doctor.street ?? "";
  const addressLine2 = [doctor.zip, doctor.city].filter(Boolean).join(" ");

  return (
    <div
      style={{
        position: "relative",
        background: "#fff",
        borderRadius: 12,
        padding: "28px 20px 20px",
        textAlign: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        transition: "box-shadow 0.35s ease, transform 0.35s ease",
        overflow: "hidden",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      className="hover:shadow-lg hover:scale-[1.02]"
    >
      {/* Invisible full-card link */}
      <Link
        href={`/zahnarzt/${doctor.citySlug}/${doctor.slug}`}
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
        aria-label={fullName}
      />

      {/* Content (above the link) */}
      <div style={{ position: "relative", zIndex: 0, pointerEvents: "none", flex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Avatar */}
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            overflow: "hidden",
            margin: "0 auto 14px",
            background: "#e8f5f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "3px solid #F4907B",
          }}
        >
          {doctor.imageUrl ? (
            <img
              src={doctor.imageUrl}
              alt={fullName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ color: "#F4907B", fontWeight: 700, fontSize: 40 }}>
              {initials}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 style={{ color: "#00385E", fontWeight: 700, fontSize: 20, marginBottom: 8, lineHeight: 1.3 }}>
          {fullName}
        </h3>

        {/* Tag */}
        <span
          style={{
            display: "inline-block",
            background: "#F4907B",
            color: "#fff",
            borderRadius: 8,
            padding: "3px 12px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Zahnarzt
        </span>

        {/* Address */}
        {(addressLine1 || addressLine2) && (
          <div style={{ textAlign: "center", color: "#00385E", fontSize: 13, fontWeight: 500, lineHeight: 1.7, marginTop: 10 }}>
            <MapPin size={14} style={{ color: "#F4907B", display: "block", margin: "0 auto 2px" }} />
            {addressLine1 && <div>{addressLine1}</div>}
            {addressLine2 && <div>{addressLine2}</div>}
          </div>
        )}
      </div>

      {/* Opening hours — pushed to bottom */}
      <div style={{ marginTop: "auto", paddingTop: 12, width: "100%" }}>
        <DoctorCardHours hours={doctor.openingHours as OpeningHoursData} />
      </div>
    </div>
  );
}
