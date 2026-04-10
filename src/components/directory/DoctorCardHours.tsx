"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

type DayHoursObject = { open: string; close: string; closed?: boolean };
type RawDayValue = DayHoursObject | string | null | undefined;
type OpeningHoursData = Record<string, RawDayValue> | null;

const DAY_KEYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;
type DayKey = (typeof DAY_KEYS)[number];

const DAY_LABELS: Record<DayKey, string> = {
  Mo: "Mo", Tu: "Di", We: "Mi", Th: "Do", Fr: "Fr", Sa: "Sa", Su: "So",
};

const JS_DAY_TO_KEY: Record<number, DayKey> = {
  1: "Mo", 2: "Tu", 3: "We", 4: "Th", 5: "Fr", 6: "Sa", 0: "Su",
};

function normalize(raw: RawDayValue): DayHoursObject | null {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  const s = raw.trim().toLowerCase();
  if (s === "closed" || s === "geschlossen") return { open: "", close: "", closed: true };
  const match = s.match(/^(\d{2}:\d{2})\s*[-–]\s*(\d{2}:\d{2})$/);
  if (match) return { open: match[1], close: match[2], closed: false };
  return null;
}

function getCurrentBerlinInfo(): { dayKey: DayKey; currentTime: string } {
  const now = new Date();
  const berlinDate = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
  const dayKey = JS_DAY_TO_KEY[berlinDate.getDay()];
  const hh = String(berlinDate.getHours()).padStart(2, "0");
  const mm = String(berlinDate.getMinutes()).padStart(2, "0");
  return { dayKey, currentTime: `${hh}:${mm}` };
}

function isOpen(day: DayHoursObject | null, currentTime: string): boolean {
  if (!day || day.closed || !day.open || !day.close) return false;
  return currentTime >= day.open && currentTime < day.close;
}

export default function DoctorCardHours({ hours }: { hours: OpeningHoursData }) {
  const [mounted, setMounted] = useState(false);
  const [info, setInfo] = useState<{ dayKey: DayKey; currentTime: string } | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setInfo(getCurrentBerlinInfo());
    setMounted(true);
  }, []);

  if (!hours) return null;

  const todayKey = info?.dayKey ?? null;
  const todayData = todayKey ? normalize(hours[todayKey]) : null;
  const openNow = mounted && todayKey ? isOpen(todayData, info!.currentTime) : null;

  return (
    <div
      style={{ marginTop: 10, position: "relative", zIndex: 2 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Status badge — centered */}
      <div style={{ textAlign: "center" }}>
        {mounted && openNow !== null && (
          <span
            style={{
              display: "inline-block",
              fontSize: 12,
              fontWeight: 600,
              padding: "3px 12px",
              borderRadius: 20,
              background: openNow ? "#dcfce7" : "#fee2e2",
              color: openNow ? "#16a34a" : "#dc2626",
              marginBottom: 6,
            }}
          >
            {openNow ? "Geöffnet" : "Geschlossen"}
          </span>
        )}
        {/* Toggle button */}
        <div>
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              color: "#F5907B",
              background: "#fff5f2",
              border: "1px solid #F5907B",
              borderRadius: 20,
              padding: "4px 12px",
              cursor: "pointer",
              fontFamily: "inherit",
              marginTop: 6,
            }}
          >
            <Clock size={12} />
            {expanded ? "Schließen" : "Uhrzeiten anzeigen"}
          </button>
        </div>
      </div>

      {/* Expandable hours table */}
      {expanded && (
        <table style={{ margin: "8px auto 0", fontSize: 12, color: "#00385E", borderCollapse: "collapse" }}>
          <tbody>
            {DAY_KEYS.map((key) => {
              const day = normalize(hours[key]);
              const isToday = mounted && todayKey === key;
              return (
                <tr key={key} style={isToday ? { fontWeight: 700 } : undefined}>
                  <td style={{ paddingRight: 12, paddingTop: 2, paddingBottom: 2, color: "#888" }}>
                    {DAY_LABELS[key]}
                  </td>
                  <td style={{ paddingTop: 2, paddingBottom: 2 }}>
                    {!day || day.closed ? (
                      <span style={{ color: "#bbb" }}>Geschlossen</span>
                    ) : (
                      `${day.open} – ${day.close}`
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
