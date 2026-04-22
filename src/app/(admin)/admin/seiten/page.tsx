import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  MapPin,
} from "lucide-react";

export const dynamic = "force-dynamic";

// ── Public-URL-Basen (Admin liegt auf eigener Domain) ───────────────────────
const PUBLIC_BASE =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://www.mycleandent.de"
    : "http://localhost:3000");
const MEMBER_BASE =
  process.env.NODE_ENV === "production"
    ? "https://member.cleanimplant.com"
    : "http://localhost:3001";

// ── Statische Routen (aus src/app/(main)/ – manuell gepflegt) ───────────────
const STATIC_PAGES_MYCLEANDENT = [
  { path: "/",                 label: "Startseite",         note: "" },
  { path: "/was-wir-tun",      label: "Was wir tun",        note: "" },
  { path: "/wissenswert",      label: "Wissenswert (Blog)", note: "Übersicht aller Beiträge" },
  { path: "/zahnarzt-finden",  label: "Zahnarzt finden",    note: "Directory-Einstieg" },
  { path: "/impressum",        label: "Impressum",          note: "" },
  { path: "/datenschutz",      label: "Datenschutz",        note: "" },
];

const STATIC_PAGES_MEMBER = [
  { path: "/account",              label: "Mein Konto (Start)",      note: "" },
  { path: "/account/profil",       label: "Profil",                  note: "" },
  { path: "/account/einstellungen",label: "Einstellungen",           note: "" },
  { path: "/account/bibliothek",   label: "Bibliothek",              note: "" },
  { path: "/account/events",       label: "Events & Webinare",       note: "" },
  { path: "/account/logos-media",  label: "Logos & Media",           note: "" },
  { path: "/account/netzwerk",     label: "Experten-Netzwerk",       note: "" },
];

// ── Geplant / noch nicht gebaut ─────────────────────────────────────────────
const PLANNED_CLEANIMPLANT = [
  { label: "Startseite (DE/EN)",             note: "Landingpage cleanimplant.com" },
  { label: "Beiträge / Blog (DE/EN)",        note: "Mehrsprachige Version von /wissenswert" },
  { label: "Publikationen (DE/EN)",          note: "Studien, Whitepapers, Guidelines" },
  { label: "Zertifizierte Implantathersteller", note: "Hersteller-Übersicht + Detailseiten" },
  { label: "Zertifizierte Produkte",         note: "Produktkatalog mit Hersteller-Verknüpfung" },
  { label: "Events (DE/EN)",                 note: "Mehrsprachige Event-Seite" },
  { label: "Zahnarzt-Directory international",note: "Analog /zahnarzt-finden für COM-Domain" },
  { label: "Impressum / Datenschutz (DE/EN)",note: "Rechtstexte zweisprachig" },
];

const COUNTRY_LABEL: Record<string, string> = {
  DE: "Deutschland",
  AT: "Österreich",
  CH: "Schweiz",
  OTHER: "Sonstige",
};

const COUNTRY_SLUG: Record<string, string> = {
  DE: "deutschland",
  AT: "oesterreich",
  CH: "schweiz",
};

async function loadData() {
  const [cityGroups, countryGroups, regionGroups, postsTotal, postsPublished, eventsTotal, eventsActive, webinarsTotal, expertsTotal, doctorsTotal] =
    await Promise.all([
      prisma.dentistProfile.groupBy({
        by: ["citySlug", "city", "country"],
        where: { active: true, citySlug: { not: "" } },
        _count: { _all: true },
        orderBy: { _count: { citySlug: "desc" } },
      }),
      prisma.dentistProfile.groupBy({
        by: ["country"],
        where: { active: true },
        _count: { _all: true },
      }),
      prisma.dentistProfile.groupBy({
        by: ["region", "country"],
        where: { active: true, region: { not: null } },
        _count: { _all: true },
      }),
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.event.count(),
      prisma.event.count({ where: { active: true } }),
      prisma.webinar.count(),
      prisma.expert.count(),
      prisma.dentistProfile.count({ where: { active: true } }),
    ]);

  return {
    cityGroups,
    countryGroups,
    regionGroups,
    postsTotal,
    postsPublished,
    eventsTotal,
    eventsActive,
    webinarsTotal,
    expertsTotal,
    doctorsTotal,
  };
}

export default async function SeitenUebersicht() {
  const data = await loadData();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#333]">Seiten-Übersicht</h1>
        <p className="text-[13px] text-[#666] mt-1">
          Alle bestehenden und geplanten Seiten aller Domains auf einen Blick.
        </p>
      </div>

      {/* ─── mycleandent.de ─────────────────────────────────────────────── */}
      <Section
        title="mycleandent.de"
        subtitle="Öffentliche Hauptseite"
        icon={<Globe size={16} />}
      >
        <Subsection title="Statische Seiten">
          <PageTable
            rows={STATIC_PAGES_MYCLEANDENT.map((p) => ({
              label: p.label,
              path: p.path,
              note: p.note,
              status: "live" as const,
              href: `${PUBLIC_BASE}${p.path}`,
              external: true,
            }))}
          />
        </Subsection>

        <Subsection
          title="Inhaltsseiten (dynamisch aus DB)"
          hint="Seiten werden automatisch generiert, sobald Inhalte existieren."
        >
          <PageTable
            rows={[
              {
                label: "Blog-Beiträge",
                path: "/wissenswert/[slug]",
                note: `${data.postsTotal} gesamt · ${data.postsPublished} veröffentlicht`,
                status: data.postsTotal > 0 ? "live" : "leer",
                href: "/admin/posts",
                hrefLabel: "Verwalten",
              },
              {
                label: "Events",
                path: "—",
                note: `${data.eventsTotal} gesamt · ${data.eventsActive} aktiv`,
                status: data.eventsTotal > 0 ? "live" : "leer",
                href: "/admin/events",
                hrefLabel: "Verwalten",
              },
              {
                label: "Webinare",
                path: "—",
                note: `${data.webinarsTotal} gesamt`,
                status: data.webinarsTotal > 0 ? "live" : "leer",
                href: "/admin/events",
                hrefLabel: "Verwalten",
              },
              {
                label: "Experten-Netzwerk",
                path: "—",
                note: `${data.expertsTotal} Experten`,
                status: data.expertsTotal > 0 ? "live" : "leer",
                href: "/admin/experten",
                hrefLabel: "Verwalten",
              },
            ]}
          />
        </Subsection>

        <Subsection
          title="Regionale Seiten – Länder"
          hint="Generiert aus /zahnarzt/[land]."
        >
          <PageTable
            rows={data.countryGroups
              .filter((c) => COUNTRY_SLUG[c.country])
              .map((c) => ({
                label: COUNTRY_LABEL[c.country] ?? c.country,
                path: `/zahnarzt/${COUNTRY_SLUG[c.country]}`,
                note: `${c._count._all} Zahnärzte`,
                status: "live" as const,
                href: `${PUBLIC_BASE}/zahnarzt/${COUNTRY_SLUG[c.country]}`,
                external: true,
              }))}
          />
        </Subsection>

        {data.regionGroups.length > 0 && (
          <Subsection
            title="Regionale Seiten – Regionen / Bundesländer"
            hint="Generiert aus /zahnarzt/[region]."
          >
            <PageTable
              rows={data.regionGroups.map((r) => {
                const slug = slugify(r.region ?? "");
                return {
                  label: `${r.region} (${COUNTRY_LABEL[r.country] ?? r.country})`,
                  path: `/zahnarzt/${slug}`,
                  note: `${r._count._all} Zahnärzte`,
                  status: "live" as const,
                  href: `${PUBLIC_BASE}/zahnarzt/${slug}`,
                  external: true,
                };
              })}
            />
          </Subsection>
        )}

        <Subsection
          title={`Regionale Seiten – Städte (${data.cityGroups.length})`}
          hint="Jede Stadt mit aktivem Profil erhält automatisch eine eigene Seite unter /zahnarzt/[stadt]."
        >
          {data.cityGroups.length === 0 ? (
            <p className="text-[13px] text-[#999] italic px-5 py-4">
              Noch keine Städte mit aktiven Profilen.
            </p>
          ) : (
            <PageTable
              rows={data.cityGroups.map((c) => ({
                label: c.city,
                path: `/zahnarzt/${c.citySlug}`,
                note: `${c._count._all} Zahnärzte · ${COUNTRY_LABEL[c.country] ?? c.country}`,
                status: "live" as const,
                href: `${PUBLIC_BASE}/zahnarzt/${c.citySlug}`,
                external: true,
              }))}
            />
          )}
        </Subsection>
      </Section>

      {/* ─── member.cleanimplant.com ────────────────────────────────────── */}
      <Section
        title="member.cleanimplant.com"
        subtitle="Member-Bereich (geschützt)"
        icon={<FileText size={16} />}
      >
        <Subsection title="Statische Seiten">
          <PageTable
            rows={STATIC_PAGES_MEMBER.map((p) => ({
              label: p.label,
              path: p.path,
              note: p.note,
              status: "live" as const,
            }))}
          />
        </Subsection>
      </Section>

      {/* ─── cleanimplant.com ───────────────────────────────────────────── */}
      <Section
        title="cleanimplant.com"
        subtitle="Zertifizierungs- und Fachplattform – DE/EN"
        icon={<MapPin size={16} />}
      >
        <Subsection
          title="Geplant – noch zu erstellen"
          hint="Diese Seiten existieren noch nicht. Hier siehst du, was für die Plattform gebaut werden muss."
        >
          <PageTable
            rows={PLANNED_CLEANIMPLANT.map((p) => ({
              label: p.label,
              path: "—",
              note: p.note,
              status: "geplant" as const,
            }))}
          />
        </Subsection>
      </Section>
    </div>
  );
}

// ── Slug helper (nur Anzeige, identisch zu src/lib/region) ──────────────────
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── UI Components ────────────────────────────────────────────────────────────

function Section({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#30A2F1]">{icon}</span>
        <h2 className="text-[16px] font-semibold text-[#333]">{title}</h2>
        {subtitle && <span className="text-[12px] text-[#999]">· {subtitle}</span>}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Subsection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100">
        <h3 className="text-[13px] font-semibold text-[#333]">{title}</h3>
        {hint && <p className="text-[11px] text-[#999] mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

type Row = {
  label: string;
  path: string;
  note?: string;
  status: "live" | "leer" | "geplant";
  href?: string;
  hrefLabel?: string;
  external?: boolean;
};

function PageTable({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return (
      <p className="text-[13px] text-[#999] italic px-5 py-4">
        Keine Einträge.
      </p>
    );
  }

  return (
    <div className="divide-y divide-gray-50">
      {rows.map((row, i) => (
        <div
          key={`${row.label}-${i}`}
          className="px-5 py-3 flex items-center justify-between gap-4"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-medium text-[#333] truncate">
                {row.label}
              </p>
              <StatusBadge status={row.status} />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <code className="text-[11px] text-[#666] font-mono">{row.path}</code>
              {row.note && (
                <span className="text-[11px] text-[#999]">· {row.note}</span>
              )}
            </div>
          </div>
          {row.href &&
            (row.external ? (
              <a
                href={row.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-[#30A2F1] hover:underline flex items-center gap-1 shrink-0"
              >
                {row.hrefLabel ?? "Öffnen"}
                <ExternalLink size={11} />
              </a>
            ) : (
              <Link
                href={row.href}
                className="text-[12px] text-[#30A2F1] hover:underline flex items-center gap-1 shrink-0"
              >
                {row.hrefLabel ?? "Öffnen"}
              </Link>
            ))}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: Row["status"] }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
        <CheckCircle2 size={10} /> live
      </span>
    );
  }
  if (status === "leer") {
    return (
      <span className="text-[10px] text-[#999] bg-gray-100 px-1.5 py-0.5 rounded-full">
        leer
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full">
      <Clock size={10} /> geplant
    </span>
  );
}
