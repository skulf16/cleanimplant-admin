"use client";

import { useState } from "react";

// ── Mappings ──────────────────────────────────────────────────────────────────

const TREATMENTS: Record<string, string> = {
  "angstpatienten": "Angstpatienten",
  "ästhetische zahnheilkunde": "Ästhetische Zahnheilkunde",
  "ästhetische zahnmedizin": "Ästhetische Zahnmedizin",
  "biologische zahnmedizin": "Biologische Zahnmedizin",
  "diagnostik und biopsie": "Diagnostik und Biopsie",
  "explantation": "Explantation",
  "fissurenversiegelung": "Fissurenversiegelung",
  "fluoridbehandlungen": "Fluoridbehandlungen",
  "füllungen": "Füllungen",
  "funktionsdiagnostik": "Funktionsdiagnostik",
  "implantatversorgung": "Implantatversorgung",
  "implantologie": "Implantologie",
  "inlays": "Inlays",
  "kariesbehandlung": "Kariesbehandlung",
  "keramikfüllungen": "Keramikfüllungen",
  "keramikimplantate": "Keramikimplantate",
  "kieferkammaufbau": "Kieferkammaufbau",
  "kiefergelenksbehandlung": "Kiefergelenksbehandlung",
  "kiefergelenksstörungen": "Kiefergelenksstörungen",
  "kieferorthopädie": "Kieferorthopädie",
  "kinderzahnheilkunde": "Kinderzahnheilkunde",
  "kinesiologie": "Kinesiologie",
  "knochentransplantation": "Knochentransplantation",
  "knochenaufbau": "Knochenaufbau",
  "kompositfüllungen": "Kompositfüllungen",
  "kronen und brücken": "Kronen und Brücken",
  "lachgas": "Lachgas",
  "laserbehandlungen": "Laserbehandlungen",
  "mikronährstoffe und ernährung": "Mikronährstoffe & Ernährung",
  "moderne digitale zahnmedizin": "Moderne Digitale Zahnmedizin",
  "narkosebehandlung": "Narkosebehandlung",
  "onlays": "Onlays",
  "parodontitis": "Parodontitis",
  "parodontologie": "Parodontologie",
  "periimplantitis": "Periimplantitis",
  "professionelle zahnreinigung (prophylaxe)": "Professionelle Zahnreinigung (Prophylaxe)",
  "provisorischer zahnersatz": "Provisorischer Zahnersatz",
  "sedierung in der zahnheilkunde": "Sedierung in der Zahnheilkunde",
  "sinuslift-operation": "Sinuslift-Operation",
  "sportzahnmedizin": "Sportzahnmedizin",
  "tiefenreinigung": "Tiefenreinigung (Scaling und Root Planing)",
  "transparente aligner": "Transparente Aligner (z. B. Invisalign)",
  "umweltzahnmedizin": "Umweltzahnmedizin",
  "untersuchung und beratung": "Untersuchung und Beratung",
  "unsichtbare zahnspangen": "Unsichtbare Zahnspangen",
  "veneers": "Veneers",
  "vitamin d3 test": "Vitamin D3 Test",
  "weichgewebstransplantation": "Weichgewebstransplantation",
  "wurzelkanalbehandlung (endodontie)": "Wurzelkanalbehandlung (Endodontie)",
  "wurzelspitzenresektion (apikotomie)": "Wurzelspitzenresektion (Apikotomie)",
  "zahnärztlicher notfalldienst": "Zahnärztlicher Notfalldienst",
  "zahnaufhellung (bleaching)": "Zahnaufhellung (Bleaching)",
  "zahnentfernungen": "Zahnentfernungen",
  "zahnersatz (voll- und teilprothesen)": "Zahnersatz (Voll- und Teilprothesen)",
  "zahnimplantate": "Zahnimplantate",
  "zahnmedizin": "Zahnmedizin",
  "zahnröntgen und 3d-bildgebung (dvt/cbct)": "Zahnröntgen und 3D-Bildgebung (DVT/CBCT)",
  "zahntraumata": "Zahntraumata",
  "zahnversiegelungen": "Zahnversiegelungen",
  "zystenentfernung": "Zystenentfernung",
};

type Props = {
  bio: string | null;
  treatments: string[];
};

type Tab = "profil" | "behandlungen";

export default function ProfileTabs({ bio, treatments }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("profil");

  return (
    <div className="mb-6">
      {/* Tab buttons */}
      <div className="flex gap-2 mb-4">
        {(["profil", "behandlungen"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? "#F5907C" : "#F9B0A1",
              color: "#fff",
              borderRadius: 8,
              width: 160,
              padding: "8px 20px",
              border: "none",
              fontWeight: activeTab === tab ? 700 : 500,
              fontSize: 14,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            {tab === "profil" ? "Profil" : "Behandlungen"}
          </button>
        ))}
      </div>

      {/* Content card */}
      <div
        className="bg-white"
        style={{ borderRadius: 10, padding: 24 }}
      >
        {activeTab === "profil" && (
          bio
            ? <div
                className="doctor-bio"
                dangerouslySetInnerHTML={{ __html: bio }}
              />
            : <p style={{ color: "#00385E", fontSize: 14 }}>Keine Beschreibung vorhanden.</p>
        )}

        {activeTab === "behandlungen" && (
          <ul className="space-y-2" style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {treatments.length === 0 ? (
              <li style={{ color: "#00385E", fontSize: 14 }}>
                Keine Behandlungen angegeben.
              </li>
            ) : (
              treatments.map((slug) => (
                <li
                  key={slug}
                  className="flex items-start gap-2"
                  style={{ fontSize: 14, color: "#00385E" }}
                >
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#F5907B",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 11,
                    flexShrink: 0,
                    marginTop: 1,
                  }}>
                    ✓
                  </span>
                  <span>{TREATMENTS[slug.toLowerCase()] ?? slug}</span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
