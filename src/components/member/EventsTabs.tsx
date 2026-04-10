"use client";

import { useState } from "react";
import { Calendar, MapPin, Clock, User, Video } from "lucide-react";
import WebinarRegisterButton from "@/components/member/WebinarRegisterButton";

type Event = {
  id: string;
  title: string;
  imageUrl: string | null;
  description: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  city: string | null;
  country: string | null;
};

type Webinar = {
  id: string;
  imageUrl: string | null;
  title: string;
  shortDescription: string | null;
  duration: string | null;
  date: Date | null;
  tutorName: string | null;
  meetingUrl: string | null;
  registrationUrl: string | null;
};

type Props = {
  events: Event[];
  webinare: Webinar[];
  userId: string;
  userEmail: string;
  userName: string;
  registeredIds: string[];
};

function formatDate(d: Date | null, withTime = false) {
  if (!d) return "–";
  const opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
  if (withTime) { opts.hour = "2-digit"; opts.minute = "2-digit"; }
  return new Intl.DateTimeFormat("de-DE", opts).format(new Date(d));
}

const TABS = [
  { key: "events",   label: "Events" },
  { key: "webinare", label: "Webinare" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function EventsTabs({ events, webinare, userId, userEmail, userName, registeredIds }: Props) {
  const [active, setActive] = useState<TabKey>("events");
  const registeredSet = new Set(registeredIds);

  return (
    <div>
      {/* Sub-Tabs */}
      <div className="flex gap-2 mb-7">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-5 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
              active === tab.key
                ? "bg-white text-[#0c1d33]"
                : "bg-white/10 text-white/60 hover:bg-white/15 hover:text-white"
            }`}
          >
            {tab.label}
            <span className={`ml-2 text-[11px] px-1.5 py-0.5 rounded-full ${
              active === tab.key ? "bg-[#0c1d33]/10 text-[#0c1d33]" : "bg-white/10 text-white/40"
            }`}>
              {tab.key === "events" ? events.length : webinare.length}
            </span>
          </button>
        ))}
      </div>

      {/* Events */}
      {active === "events" && (
        <>
          {events.length === 0 ? (
            <div className="bg-white/5 rounded-xl p-10 text-center text-white/40 text-[14px]">
              Aktuell keine Events geplant.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map(ev => (
                <div key={ev.id} className="bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden flex flex-col transition-colors border border-white/5 hover:border-white/15">
                  {ev.imageUrl ? (
                    <img src={ev.imageUrl} alt="" className="w-full h-44 object-cover" />
                  ) : (
                    <div className="w-full h-44 flex items-center justify-center bg-white/5">
                      <Calendar size={32} className="text-[#30A2F1]/40" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1 gap-3">
                    {ev.title && (
                      <h3 className="text-[15px] font-bold text-white">{ev.title}</h3>
                    )}
                    {ev.dateFrom && (
                      <div className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#30A2F1" }}>
                        <Calendar size={13} />
                        {formatDate(ev.dateFrom)}
                        {ev.dateTo && ` – ${formatDate(ev.dateTo)}`}
                      </div>
                    )}
                    <p className="text-[14px] leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.8)" }}>{ev.description}</p>
                    {(ev.city || ev.country) && (
                      <div className="flex items-center gap-1.5 text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                        <MapPin size={12} />
                        {[ev.city, ev.country].filter(Boolean).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Webinare */}
      {active === "webinare" && (
        <>
          {webinare.length === 0 ? (
            <div className="bg-white/5 rounded-xl p-10 text-center text-white/40 text-[14px]">
              Aktuell keine Webinare geplant.
            </div>
          ) : (
            <div className="space-y-5">
              {webinare.map(wb => (
                <div key={wb.id} className="bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden flex flex-col md:flex-row transition-colors border border-white/5 hover:border-white/15">
                  {wb.imageUrl ? (
                    <img src={wb.imageUrl} alt="" className="w-full md:w-56 h-44 md:h-auto object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-full md:w-56 h-44 md:h-auto flex items-center justify-center flex-shrink-0 bg-white/5">
                      <Video size={32} className="text-[#30A2F1]/40" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <div>
                      <h3 className="text-[16px] font-bold text-white">{wb.title}</h3>
                      {wb.shortDescription && (
                        <p className="text-[13px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{wb.shortDescription}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-[12px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {wb.date && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-[#30A2F1]" />
                          {formatDate(wb.date, true)} Uhr
                        </span>
                      )}
                      {wb.duration && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-[#30A2F1]" />
                          {wb.duration}
                        </span>
                      )}
                      {wb.tutorName && (
                        <span className="flex items-center gap-1">
                          <User size={12} className="text-[#30A2F1]" />
                          {wb.tutorName}
                        </span>
                      )}
                    </div>
                    <div className="mt-auto pt-2">
                      <WebinarRegisterButton
                        webinarId={wb.id}
                        userId={userId}
                        userEmail={userEmail}
                        userName={userName}
                        isRegistered={registeredSet.has(wb.id)}
                        registrationUrl={wb.registrationUrl}
                        meetingUrl={wb.meetingUrl}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
