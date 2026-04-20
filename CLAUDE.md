@AGENTS.md
@BLOG_PIPELINE.md

# Projektübersicht – mycleandent

## Struktur

Ein einziges Next.js-Projekt (16.2.1) mit drei Bereichen, die über die Middleware (`src/proxy.ts`) anhand des Hostnamens getrennt werden:

| Bereich | Domain (Produktion) | Lokal |
|---------|--------------------|----|
| Öffentliche Seite | `www.mycleandent.de` | `localhost:3000` |
| Member-Bereich | `member.cleanimplant.com` | `localhost:3001` (Proxy: `npm run proxy`) |
| Admin-Panel | `admin.mycleandent.de` | `localhost:3002` (Proxy: `npm run proxy:admin`) |

## Vercel Deployments

**Wichtig:** Ein einziges GitHub-Repo (`skulf16/cleanimplant-admin`), aber **drei separate Vercel-Projekte** — eines pro Domain. Alle bauen denselben Code, haben aber **jeweils eigene Environment Variables**.

| Vercel-Projekt | Domain | Zweck |
|---|---|---|
| `mycleandent.de` | `www.mycleandent.de` | Öffentliche Seite |
| `cleanimplant-admin` | `admin.mycleandent.de` | Admin-Panel |
| `cleanimplant-members` | `member.cleanimplant.com` | Member-Bereich |

- Jeder Push auf `main` → alle drei Projekte deployen parallel
- Feature-Branch pushen → Vercel erstellt Preview-URLs in allen drei Projekten

### Environment Variables – pro Projekt setzen!

Env-Vars sind **nicht shared** zwischen den Vercel-Projekten. Wer eine Variable anlegt/ändert, muss das in **jedem relevanten Projekt einzeln** tun. Besonders wichtig:

| Variable | Wo gebraucht | Muss gesetzt sein in |
|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | Sitemap, OG-Tags, Canonicals | `mycleandent.de` (Wert: `https://www.mycleandent.de`) |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Directory-Map auf der öff. Seite | `mycleandent.de` |
| `DATABASE_URL` | Prisma | alle drei |
| `NEXTAUTH_SECRET` | Auth | alle drei |
| SMTP-Zugänge | Mails | mindestens `cleanimplant-admin` + `cleanimplant-members` |

**Regel:** Nach jeder Env-Var-Änderung muss das Projekt **ohne Build-Cache** redeployed werden — sonst greift der neue Wert nicht (bei `NEXT_PUBLIC_*` zwingend, da diese build-time eingebacken werden).

## Lokale Entwicklung

```bash
npm run dev          # Next.js auf Port 3000
npm run proxy        # Member-Proxy auf Port 3001
npm run proxy:admin  # Admin-Proxy auf Port 3002
```

## Tech-Stack

- **Framework:** Next.js 16.2.1 (Turbopack)
- **Datenbank:** PostgreSQL via Supabase + Prisma 7.6.0
- **Auth:** NextAuth v5 (JWT)
- **Storage:** Supabase Storage
- **Styling:** Tailwind CSS

## Wichtige Dateien

- `src/proxy.ts` – Middleware, Domain-Routing
- `src/lib/prisma.ts` – Prisma Client (PrismaPg Adapter)
- `src/lib/auth.ts` – NextAuth Konfiguration
- `src/lib/mail.ts` – Nodemailer SMTP (Strato)
- `prisma/schema.prisma` – Datenbankschema

## Farbpalette

- Navy: `#00385E`
- Coral: `#F4907B`
- Peach: `#FCD2B2`
- Creme: `#FDF5EE` / `#FEF9F5`

## Arbeitsweise

Dieses Projekt hat drei Bereiche. Zu Beginn jedes Gesprächs sagt der Nutzer in welchem Bereich gearbeitet wird:
- "Wir arbeiten am **Admin-Panel**"
- "Wir arbeiten an der **öffentlichen Seite**"
- "Wir arbeiten am **Member-Bereich**"
