"use client";

import { useEffect, useState } from "react";

// Both storage formats are supported:
// New: { Mo: { open: "09:00", close: "17:00", closed: false } }
// Legacy: { Mo: "09:00-17:00" } or { Mo: "closed" }
type DayHoursObject = { open: string; close: string; open2?: string; close2?: string; closed?: boolean };
type RawDayValue = DayHoursObject | string | null | undefined;

export type OpeningHoursData = Record<string, RawDayValue> | null;

type Props = { hours: OpeningHoursData };

const DAY_KEYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;
type DayKey = (typeof DAY_KEYS)[number];

const DAY_LABELS: Record<DayKey, string> = {
  Mo: "Montag",
  Tu: "Dienstag",
  We: "Mittwoch",
  Th: "Donnerstag",
  Fr: "Freitag",
  Sa: "Samstag",
  Su: "Sonntag",
};

// JS getDay(): 0=Sun, 1=Mon, …, 6=Sat
const JS_DAY_TO_KEY: Record<number, DayKey> = {
  1: "Mo", 2: "Tu", 3: "We", 4: "Th", 5: "Fr", 6: "Sa", 0: "Su",
};

/** Normalize a stored day value into a consistent object */
function normalize(raw: RawDayValue): DayHoursObject | null {
  if (!raw) return null;
  if (typeof raw === "object") return raw;

  // String format: "09:00-17:00" or "closed"
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
  const inFirst = currentTime >= day.open && currentTime < day.close;
  const inSecond = day.open2 && day.close2
    ? currentTime >= day.open2 && currentTime < day.close2
    : false;
  return inFirst || inSecond;
}

export default function OpeningHoursStatus({ hours }: Props) {
  const [mounted, setMounted] = useState(false);
  const [info, setInfo] = useState<{ dayKey: DayKey; currentTime: string } | null>(null);

  useEffect(() => {
    setInfo(getCurrentBerlinInfo());
    setMounted(true);
  }, []);

  if (!hours) return null;

  const todayKey = info?.dayKey ?? null;
  const todayData = todayKey ? normalize(hours[todayKey]) : null;
  const openNow = mounted && todayKey ? isOpen(todayData, info!.currentTime) : null;

  return (
    <div>
      {/* Title + status badge on same line */}
      <div className="flex items-center gap-3 mb-2">
        <p style={{ color: "#F5907B", fontWeight: 600, fontSize: 18, lineHeight: 1 }}>
          Öffnungszeiten
        </p>
        {mounted && openNow !== null && (
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
              openNow ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {openNow ? "Geöffnet" : "Geschlossen"}
          </span>
        )}
      </div>

      {/* Opening hours table */}
      <table style={{ color: "#00385E", fontSize: 14, borderCollapse: "collapse" }}>
        <tbody>
          {DAY_KEYS.map((key) => {
            const day = normalize(hours[key]);
            const isToday = mounted && todayKey === key;
            return (
              <tr key={key} style={isToday ? { fontWeight: 600 } : undefined}>
                <td style={{ paddingRight: 16, paddingTop: 2, paddingBottom: 2, whiteSpace: "nowrap" }}>
                  {DAY_LABELS[key]}
                </td>
                <td style={{ paddingTop: 2, paddingBottom: 2, whiteSpace: "nowrap" }}>
                  {!day || day.closed ? (
                    <span style={{ color: "#aaa" }}>Geschlossen</span>
                  ) : day.open2 && day.close2 ? (
                    `${day.open} – ${day.close} / ${day.open2} – ${day.close2}`
                  ) : (
                    `${day.open} – ${day.close}`
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
