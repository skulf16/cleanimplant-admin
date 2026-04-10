import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Calendar, Video, MapPin, Clock, User } from "lucide-react";

function formatDate(d: Date | null) {
  if (!d) return "–";
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(d));
}

export default async function AdminEventsPage() {
  const [events, webinare] = await Promise.all([
    prisma.event.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.webinar.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { registrations: true } } },
    }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#333]">Events & Webinare</h1>
      </div>

      {/* ─── Events ─── */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-[#333]">
            Events <span className="text-[#999] font-normal text-[13px]">({events.length})</span>
          </h2>
          <Link
            href="/admin/events/new"
            className="flex items-center gap-1.5 bg-[#30A2F1] hover:bg-[#1a8fd8] text-white text-[13px] font-semibold px-4 py-2 rounded transition-colors"
          >
            <Plus size={14} /> Neues Event
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {events.length === 0 ? (
            <p className="py-12 text-center text-[#999] text-[14px]">Noch keine Events angelegt.</p>
          ) : (
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Beschreibung</th>
                  <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Datum</th>
                  <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Ort</th>
                  <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map(ev => (
                  <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {ev.imageUrl ? (
                          <img src={ev.imageUrl} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Calendar size={16} className="text-gray-400" />
                          </div>
                        )}
                        <p className="text-[#333] font-medium line-clamp-2 max-w-[280px]">{ev.description}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#666]">
                      {ev.dateFrom ? (
                        <span>{formatDate(ev.dateFrom)}{ev.dateTo ? ` – ${formatDate(ev.dateTo)}` : ""}</span>
                      ) : "–"}
                    </td>
                    <td className="px-5 py-3.5 text-[#666]">
                      {ev.city ? `${ev.city}${ev.country ? ", " + ev.country : ""}` : "–"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${ev.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                        {ev.active ? "Aktiv" : "Inaktiv"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href={`/admin/events/${ev.id}`} className="text-[#30A2F1] hover:underline text-[12px]">
                        Bearbeiten
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ─── Webinare ─── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-[#333]">
            Webinare <span className="text-[#999] font-normal text-[13px]">({webinare.length})</span>
          </h2>
          <Link
            href="/admin/events/webinare/new"
            className="flex items-center gap-1.5 bg-[#30A2F1] hover:bg-[#1a8fd8] text-white text-[13px] font-semibold px-4 py-2 rounded transition-colors"
          >
            <Plus size={14} /> Neues Webinar
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {webinare.length === 0 ? (
            <p className="py-12 text-center text-[#999] text-[14px]">Noch keine Webinare angelegt.</p>
          ) : (
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Webinar</th>
                  <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Datum</th>
                  <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Tutor</th>
                  <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Anmeldungen</th>
                  <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {webinare.map(wb => (
                  <tr key={wb.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {wb.imageUrl ? (
                          <img src={wb.imageUrl} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Video size={16} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-[#333]">{wb.title}</p>
                          {wb.duration && <p className="text-[11px] text-[#999] flex items-center gap-1 mt-0.5"><Clock size={10} /> {wb.duration}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#666]">{formatDate(wb.date)}</td>
                    <td className="px-5 py-3.5 text-[#666]">
                      {wb.tutorName ? <span className="flex items-center gap-1"><User size={11} />{wb.tutorName}</span> : "–"}
                    </td>
                    <td className="px-5 py-3.5 text-[#666]">{wb._count.registrations}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${wb.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                        {wb.active ? "Aktiv" : "Inaktiv"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href={`/admin/events/webinare/${wb.id}`} className="text-[#30A2F1] hover:underline text-[12px]">
                        Bearbeiten
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
