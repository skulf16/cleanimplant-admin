"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { buildDoctorName } from "@/lib/utils";

// ── Opening hours ─────────────────────────────────────────────────────────────

type DayHours = { open: string; close: string; closed?: boolean };
type OpeningHours = Record<string, DayHours | string | null | undefined> | null;
const JS_DAY: Record<number, string> = { 1:"Mo",2:"Tu",3:"We",4:"Th",5:"Fr",6:"Sa",0:"Su" };

function normDay(raw: DayHours | string | null | undefined): DayHours | null {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  const s = raw.trim().toLowerCase();
  if (s === "closed" || s === "geschlossen") return { open:"", close:"", closed:true };
  const m = s.match(/^(\d{2}:\d{2})\s*[-–]\s*(\d{2}:\d{2})$/);
  return m ? { open:m[1], close:m[2], closed:false } : null;
}

function isOpenNow(hours: OpeningHours): boolean | null {
  if (!hours) return null;
  const now = new Date();
  const berlin = new Date(now.toLocaleString("en-US", { timeZone:"Europe/Berlin" }));
  const key = JS_DAY[berlin.getDay()];
  const t = `${String(berlin.getHours()).padStart(2,"0")}:${String(berlin.getMinutes()).padStart(2,"0")}`;
  const d = normDay(hours[key]);
  if (!d || d.closed || !d.open || !d.close) return false;
  return t >= d.open && t < d.close;
}

function OpenBadge({ hours }: { hours: OpeningHours }) {
  const [status, setStatus] = useState<boolean | null>(null);
  useEffect(() => { setStatus(isOpenNow(hours)); }, [hours]);
  if (status === null) return null;
  return (
    <span style={{
      display:"inline-block", fontSize:11, fontWeight:600, padding:"2px 10px",
      borderRadius:20, marginTop:8,
      background: status ? "#dcfce7" : "#fee2e2",
      color: status ? "#16a34a" : "#dc2626",
    }}>
      {status ? "Geöffnet" : "Geschlossen"}
    </span>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Doctor = {
  id: string; slug: string; citySlug: string; firstName: string; lastName: string;
  title: string | null; suffix: string | null;
  street: string | null; zip: string | null; city: string; country: string;
  imageUrl: string | null; openingHours: OpeningHours;
  categories: { category: { name: string } }[];
};

// ── Carousel ──────────────────────────────────────────────────────────────────

const GAP = 20;

function getVisible(width: number): number {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  return 4;
}

export default function DoctorCarousel({ doctors }: { doctors: Doctor[] }) {
  const [index, setIndex] = useState(0);
  const outerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);

  const visible = getVisible(containerW);
  const max = Math.max(0, doctors.length - visible);

  // ResizeObserver – measures the clipping container accurately
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerW(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Reset index when visible count changes to avoid out-of-bounds
  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, doctors.length - visible)));
  }, [visible, doctors.length]);

  const cardW = containerW
    ? Math.floor((containerW - GAP * (visible - 1)) / visible)
    : 0;

  const translateX = -(index * (cardW + GAP));

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(max, i + 1));

  if (doctors.length === 0) return (
    <div style={{ textAlign:"center", padding:"2rem 0", color:"rgba(255,255,255,0.7)", fontSize:14 }}>
      Noch keine Praxen eingetragen.
    </div>
  );

  return (
    <div style={{ position:"relative" }}>
      {/* Arrows */}
      {index > 0 && (
        <button onClick={prev} style={{
          position:"absolute", left:-22, top:"50%", transform:"translateY(-50%)",
          zIndex:10, width:44, height:44, borderRadius:"50%",
          background:"#F4907B", border:"none", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", color:"#fff",
          boxShadow:"0 2px 8px rgba(0,0,0,0.25)", transition:"background 0.2s ease, transform 0.15s ease",
        }}>
          <ChevronLeft size={22} />
        </button>
      )}
      {index < max && (
        <button onClick={next} style={{
          position:"absolute", right:-22, top:"50%", transform:"translateY(-50%)",
          zIndex:10, width:44, height:44, borderRadius:"50%",
          background:"#F4907B", border:"none", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", color:"#fff",
          boxShadow:"0 2px 8px rgba(0,0,0,0.25)", transition:"background 0.2s ease, transform 0.15s ease",
        }}>
          <ChevronRight size={22} />
        </button>
      )}

      {/* Clipping viewport */}
      <div ref={outerRef} style={{ overflow:"hidden" }}>
        {/* Sliding track */}
        <div style={{
          display:"flex",
          gap: GAP,
          transform: cardW ? `translateX(${translateX}px)` : "none",
          transition:"transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange:"transform",
          alignItems:"stretch",
          opacity: cardW ? 1 : 0,
        }}>
          {doctors.map((doc) => {
            const name = buildDoctorName(doc.title, doc.firstName, doc.lastName, doc.suffix);
            const initials = (doc.firstName?.[0] ?? "") + (doc.lastName?.[0] ?? "");
            const line1 = doc.street ?? "";
            const line2 = [doc.zip, doc.city].filter(Boolean).join(" ");

            return (
              <Link
                key={doc.id}
                href={`/zahnarzt/${doc.citySlug}/${doc.slug}`}
                style={{
                  textDecoration:"none",
                  flex:`0 0 ${cardW}px`,
                  width: cardW,
                  display:"flex",
                  minWidth:0,
                }}
              >
                <div style={{
                  background:"#fff", borderRadius:12, padding:"28px 20px 20px",
                  textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.12)",
                  display:"flex", flexDirection:"column", alignItems:"center",
                  width:"100%", boxSizing:"border-box", overflow:"hidden",
                }}>
                  {/* Avatar */}
                  <div style={{
                    width:220, height:220, borderRadius:"50%", overflow:"hidden",
                    background:"#e8f5f0", display:"flex", alignItems:"center",
                    justifyContent:"center", border:"3px solid #F4907B",
                    marginBottom:14, flexShrink:0,
                    maxWidth:"calc(100% - 40px)",
                  }}>
                    {doc.imageUrl
                      ? <img src={doc.imageUrl} alt={name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      : <span style={{ color:"#F4907B", fontWeight:700, fontSize:48 }}>{initials}</span>
                    }
                  </div>

                  {/* Name */}
                  <h3 style={{ color:"#F4907B", fontWeight:700, fontSize:22, lineHeight:1.3, margin:"0 0 10px" }}>
                    {name}
                  </h3>

                  {/* Address */}
                  <div style={{ color:"#00385E", fontSize:14, lineHeight:1.6, textAlign:"center" }}>
                    <MapPin size={14} style={{ color:"#F4907B", display:"block", margin:"0 auto 2px" }} />
                    {line1 && <div>{line1}</div>}
                    {line2 ? <div>{line2}</div> : <div>{doc.city}</div>}
                  </div>

                  {/* Status */}
                  <OpenBadge hours={doc.openingHours} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      {doctors.length > visible && (
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:24 }}>
          {Array.from({ length: max + 1 }).map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} style={{
              width:8, height:8, borderRadius:"50%", border:"none", cursor:"pointer", padding:0,
              background: i === index ? "#fff" : "rgba(255,255,255,0.4)",
              transition:"background 0.2s",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
