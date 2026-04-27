import { prisma } from "@/lib/prisma";
import { BERLIN_DISTRICTS } from "@/lib/berlin-districts";
import { slugifyRegion, normalizeRegionName } from "@/lib/region";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "https://www.mycleandent.de";

// Dynamische llms.txt nach https://llmstxt.org/
//
// Liefert KI-Systemen (ChatGPT, Claude, Perplexity, …) eine kuratierte
// Linkliste der wichtigsten Seiten. Wird zur Build-Zeit nicht gecacht,
// damit neue Zahnärzte / Blog-Artikel automatisch auftauchen.
export const dynamic = "force-dynamic";

// Nicht auf admin.* / member.* ausspielen – siehe robots.ts.
function blockedSubdomain(host: string): boolean {
  return host.includes("admin.") || host.includes("member.");
}

export async function GET(req: Request) {
  const host = new URL(req.url).host;
  if (blockedSubdomain(host)) {
    return new Response("Not found", { status: 404 });
  }

  const [doctors, cities, regions, posts] = await Promise.all([
    prisma.dentistProfile.findMany({
      where: { active: true },
      select: { slug: true, citySlug: true, firstName: true, lastName: true, city: true, featured: true },
      orderBy: [{ featured: "desc" }, { lastName: "asc" }],
      take: 60,
    }),
    prisma.dentistProfile.findMany({
      where: { active: true, NOT: { citySlug: "" } },
      select: { citySlug: true, city: true },
      distinct: ["citySlug"],
      orderBy: { city: "asc" },
    }),
    prisma.dentistProfile.findMany({
      where: { active: true, NOT: { region: null } },
      select: { region: true, country: true },
      distinct: ["region"],
      orderBy: { region: "asc" },
    }),
    prisma.post.findMany({
      where: { published: true },
      select: { slug: true, title: true, excerpt: true },
      orderBy: { publishedAt: "desc" },
      take: 30,
    }),
  ]);

  const lines: string[] = [];
  const push = (s = "") => lines.push(s);

  push("# mycleandent.de");
  push();
  push("> Unabhängiges Verzeichnis von CleanImplant-zertifizierten Zahnärzten und Implantologen in Deutschland, Österreich und der Schweiz. Patientinnen und Patienten finden hier geprüfte Praxen samt Adresse, Öffnungszeiten und Behandlungsschwerpunkten. Die CleanImplant-Zertifizierung steht für Implantatversorgungen mit unabhängig auf Oberflächenreinheit geprüften Implantaten.");
  push();
  push("Sprache: Deutsch · Geografischer Fokus: DE / AT / CH · Inhaltsart: Verzeichnis + redaktionelle Ratgeber");
  push();

  push("## Einstieg");
  push(`- [Startseite](${BASE}/): Überblick und Suche`);
  push(`- [Zahnarzt finden](${BASE}/zahnarzt-finden): Karte und Filter für die gesamte Datenbank`);
  push(`- [Was wir tun](${BASE}/was-wir-tun): Über die CleanImplant Foundation und das Prüfverfahren`);
  push();

  push("## Länder-Übersichten");
  push(`- [Zahnärzte in Deutschland](${BASE}/zahnarzt/deutschland)`);
  push(`- [Zahnärzte in Österreich](${BASE}/zahnarzt/oesterreich)`);
  push(`- [Zahnärzte in der Schweiz](${BASE}/zahnarzt/schweiz)`);
  push();

  if (regions.length > 0) {
    push("## Regionen / Bundesländer");
    for (const r of regions) {
      if (!r.region) continue;
      const display = normalizeRegionName(r.region);
      push(`- [Zahnärzte ${display}](${BASE}/zahnarzt/${slugifyRegion(r.region)})`);
    }
    push();
  }

  if (cities.length > 0) {
    push("## Städte");
    for (const c of cities) {
      if (!c.citySlug || !c.city) continue;
      push(`- [Zahnärzte ${c.city}](${BASE}/zahnarzt/${c.citySlug})`);
    }
    push();
  }

  push("## Lokale Ratgeber – Berlin");
  push(`- [Implantologe Berlin](${BASE}/implantologe-berlin): Übersicht, Kosten, Bezirke`);
  push(`- [Implantologe Charlottenburg](${BASE}/implantologe-charlottenburg)`);
  for (const d of BERLIN_DISTRICTS) {
    push(`- [${d.keyphrase}](${BASE}/implantologe-${d.slug})`);
  }
  push();

  if (doctors.length > 0) {
    push("## Ausgewählte Zahnarzt-Profile");
    for (const d of doctors) {
      const name = [d.firstName, d.lastName].filter(Boolean).join(" ").trim();
      if (!name || !d.citySlug || !d.slug) continue;
      const city = d.city ? ` (${d.city})` : "";
      push(`- [${name}${city}](${BASE}/zahnarzt/${d.citySlug}/${d.slug})`);
    }
    push();
  }

  if (posts.length > 0) {
    push("## Wissenswertes – Blog");
    for (const p of posts) {
      const desc = p.excerpt ? `: ${p.excerpt.replace(/\s+/g, " ").trim().slice(0, 160)}` : "";
      push(`- [${p.title}](${BASE}/wissenswert/${p.slug})${desc}`);
    }
    push();
  }

  push("## Rechtliches & Service");
  push(`- [Impressum](${BASE}/impressum)`);
  push(`- [Datenschutz](${BASE}/datenschutz)`);
  push(`- [Sitemap (XML)](${BASE}/sitemap.xml)`);

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
