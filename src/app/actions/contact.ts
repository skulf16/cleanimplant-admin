"use server";

import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: Number(process.env.SMTP_PORT ?? 465) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `mycleandent <${process.env.EMAIL_FROM ?? "noreply@mycleandent.de"}>`;
const ADMIN_EMAIL = "termin@mycleandent.de";

// ── Rate Limiting (in-memory, max 5 Anfragen pro IP pro Stunde) ───────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

const DEFAULTS: Record<string, string> = {
  email_patient_subject: "Ihre Anfrage bei {{practiceName}}",
  email_patient_body: `Liebe/r {{patientName}},

vielen Dank für Ihre Anfrage. Wir haben Ihre Nachricht erhalten und melden uns schnellstmöglich bei Ihnen.

Art der Anfrage: {{requestType}}

Mit freundlichen Grüßen
{{practiceName}}`,

  email_practice_subject: "Neue Patientenanfrage: {{requestType}}",
  email_practice_body: `Neue Anfrage über mycleandent:

Praxis: {{practiceName}}
Name: {{patientName}}
E-Mail: {{patientEmail}}
Telefon: {{patientPhone}}
Art der Anfrage: {{requestType}}

Diese Nachricht wurde über das mycleandent-Profil von {{practiceName}} gesendet.`,
};

function fill(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (str, [k, v]) => str.replaceAll(`{{${k}}}`, v),
    template
  );
}

function textToRows(text: string): string {
  return text
    .split("\n")
    .map((l) =>
      l.trim() === ""
        ? `<tr><td style="padding:6px 0"></td></tr>`
        : `<tr><td style="font-size:15px;line-height:1.7;color:#374151;padding:1px 0">${l}</td></tr>`
    )
    .join("");
}

const LOGO_B64 = "";

function buildEmail(body: string, type: "patient" | "practice"): string {
  const accentColor = "#F4907B";
  const headerBg    = type === "patient" ? "#00385E" : "#F4907B";
  const headerText  = type === "patient" ? "Vielen Dank für Ihre Anfrage" : "Neue Patientenanfrage";
  const logoSrc     = `data:image/png;base64,${LOGO_B64}`;
  const baseUrl     = process.env.NEXT_PUBLIC_BASE_URL ?? "https://mycleandent.de";

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>mycleandent</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f0;padding:32px 0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
          <tr>
            <td style="background:${headerBg};padding:32px 40px 28px">
              <img src="${logoSrc}" alt="mycleandent" height="36" style="display:block;margin-bottom:18px">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;line-height:1.3">${headerText}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px 32px">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${textToRows(body)}
              </table>
            </td>
          </tr>
          <tr><td style="padding:0 40px"><div style="height:1px;background:#e8e5e0"></div></td></tr>
          <tr>
            <td style="padding:24px 40px 32px">
              <p style="margin:0 0 4px;font-size:13px;color:#9ca3af">mycleandent – CleanImplant-zertifizierte Zahnarztpraxen</p>
              <p style="margin:0;font-size:13px">
                <a href="${baseUrl}" style="color:${accentColor};text-decoration:none">${baseUrl.replace('https://','')}</a>
                &nbsp;·&nbsp;
                <a href="mailto:support@mycleandent.de" style="color:${accentColor};text-decoration:none">support@mycleandent.de</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  requestType: "termin" | "rueckruf";
  practiceEmail: string | null;
  practiceName: string;
  honeypot?: string;
};

export async function sendContactEmail(payload: ContactPayload): Promise<{ ok: boolean; error?: string }> {
  // Honeypot: Bots füllen das versteckte Feld aus
  if (payload.honeypot) return { ok: true }; // Still erfolgreich vortäuschen

  // Rate Limiting: IP aus Next.js Headers
  const { headers } = await import("next/headers");
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? hdrs.get("x-real-ip") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return { ok: false, error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." };
  }

  try {
    const keys = ["email_patient_subject", "email_patient_body", "email_practice_subject", "email_practice_body"];
    const rows = await prisma.setting.findMany({ where: { key: { in: keys } } });
    const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));

    const vars: Record<string, string> = {
      patientName:  `${payload.firstName} ${payload.lastName}`,
      patientEmail: payload.email,
      patientPhone: payload.phone ?? "–",
      requestType:  payload.requestType === "termin" ? "Terminanfrage" : "Rückrufbitte",
      practiceName: payload.practiceName,
    };

    const patientSubject  = fill(settings.email_patient_subject  ?? DEFAULTS.email_patient_subject,  vars);
    const patientBody     = fill(settings.email_patient_body     ?? DEFAULTS.email_patient_body,     vars);
    const practiceSubject = fill(settings.email_practice_subject ?? DEFAULTS.email_practice_subject, vars);
    const practiceBody    = fill(settings.email_practice_body    ?? DEFAULTS.email_practice_body,    vars);

    const sends = [
      transporter.sendMail({ from: FROM, to: payload.email,  subject: patientSubject,                  html: buildEmail(patientBody,  "patient")  }),
      transporter.sendMail({ from: FROM, to: ADMIN_EMAIL,    subject: `[mycleandent] ${practiceSubject}`, html: buildEmail(practiceBody, "practice") }),
    ];

    if (payload.practiceEmail) {
      sends.push(transporter.sendMail({ from: FROM, to: payload.practiceEmail, subject: practiceSubject, html: buildEmail(practiceBody, "practice") }));
    }

    await Promise.all(sends);
    return { ok: true };
  } catch (err) {
    console.error("sendContactEmail error:", err);
    return { ok: false, error: "E-Mail konnte nicht gesendet werden." };
  }
}
