@AGENTS.md
@BLOG_PIPELINE.md

# Projektübersicht – mycleandent

## Struktur

Ein einziges Next.js-Projekt (16.2.1) mit drei Bereichen, die über die Middleware (`src/proxy.ts`) anhand des Hostnamens getrennt werden:

| Bereich | Domain (Produktion) | Lokal |
|---------|--------------------|----|
| Öffentliche Seite | `mycleandent.de` | `localhost:3000` |
| Member-Bereich | `member.cleanimplant.com` | `localhost:3001` (Proxy: `npm run proxy`) |
| Admin-Panel | `admin.mycleandent.de` | `localhost:3002` (Proxy: `npm run proxy:admin`) |

## Vercel Deployments

Alle drei Bereiche laufen im selben Vercel-Projekt `cleanimplant-admin` aus dem GitHub-Repo `skulf16/cleanimplant-admin`.

- Jeder Push auf `main` → geht sofort live
- Feature-Branch pushen → Vercel erstellt Preview-URL zum Testen

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
