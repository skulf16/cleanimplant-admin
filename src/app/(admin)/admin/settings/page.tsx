import { getSettings, saveSettings } from "@/app/actions/settings";

const SETTING_KEYS = [
  "email_patient_subject",
  "email_patient_body",
  "email_practice_subject",
  "email_practice_body",
];

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

export default async function SettingsPage() {
  const saved = await getSettings(SETTING_KEYS);
  const values = Object.fromEntries(
    SETTING_KEYS.map((k) => [k, saved[k] ?? DEFAULTS[k]])
  );

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
        Einstellungen
      </h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32 }}>
        Bearbeiten Sie hier die automatischen E-Mail-Vorlagen.
      </p>

      <form action={saveSettings}>
        {/* ── Patient-Mail ──────────────────────────────────────────────── */}
        <Section
          title="E-Mail an den Patienten"
          description="Wird automatisch versendet, wenn ein Patient das Kontaktformular abschickt."
          placeholders={[
            { tag: "{{patientName}}", label: "Vor- und Nachname des Patienten" },
            { tag: "{{practiceName}}", label: "Name der Praxis / des Arztes" },
            { tag: "{{requestType}}", label: "Art der Anfrage (Termin / Rückruf)" },
          ]}
        >
          <Field label="Betreff" name="email_patient_subject" value={values.email_patient_subject} />
          <TextareaField label="Nachrichtentext" name="email_patient_body" value={values.email_patient_body} />
        </Section>

        {/* ── Praxis-Mail ───────────────────────────────────────────────── */}
        <Section
          title="E-Mail an die Praxis"
          description="Wird an die Praxis gesendet, wenn ein Patient eine Anfrage stellt."
          placeholders={[
            { tag: "{{patientName}}", label: "Vor- und Nachname des Patienten" },
            { tag: "{{patientEmail}}", label: "E-Mail-Adresse des Patienten" },
            { tag: "{{patientPhone}}", label: "Telefonnummer (nur bei Rückruf)" },
            { tag: "{{requestType}}", label: "Art der Anfrage (Termin / Rückruf)" },
            { tag: "{{practiceName}}", label: "Name der Praxis / des Arztes" },
          ]}
        >
          <Field label="Betreff" name="email_practice_subject" value={values.email_practice_subject} />
          <TextareaField label="Nachrichtentext" name="email_practice_body" value={values.email_practice_body} />
        </Section>

        <button
          type="submit"
          style={{
            background: "#30A2F1",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "11px 28px",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            marginTop: 8,
          }}
        >
          Einstellungen speichern
        </button>
      </form>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({
  title,
  description,
  placeholders,
  children,
}: {
  title: string;
  description: string;
  placeholders: { tag: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        padding: "24px 28px",
        marginBottom: 24,
      }}
    >
      <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{title}</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>{description}</p>

      {children}

      {/* Placeholder reference */}
      <div style={{ marginTop: 16, background: "#f8fafc", borderRadius: 8, padding: "12px 16px" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Verfügbare Platzhalter
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {placeholders.map((p) => (
            <div key={p.tag} style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
              <code style={{ fontSize: 12, background: "#e2e8f0", borderRadius: 4, padding: "1px 6px", color: "#334155", flexShrink: 0 }}>
                {p.tag}
              </code>
              <span style={{ fontSize: 12, color: "#64748b" }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value }: { label: string; name: string; value: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
        {label}
      </label>
      <input
        type="text"
        name={name}
        defaultValue={value}
        style={{
          width: "100%",
          border: "1px solid #d1d5db",
          borderRadius: 8,
          padding: "9px 12px",
          fontSize: 14,
          color: "#0f172a",
          background: "#fff",
          boxSizing: "border-box",
          fontFamily: "inherit",
          outline: "none",
        }}
      />
    </div>
  );
}

function TextareaField({ label, name, value }: { label: string; name: string; value: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
        {label}
      </label>
      <textarea
        name={name}
        defaultValue={value}
        rows={8}
        style={{
          width: "100%",
          border: "1px solid #d1d5db",
          borderRadius: 8,
          padding: "9px 12px",
          fontSize: 14,
          color: "#0f172a",
          background: "#fff",
          boxSizing: "border-box",
          fontFamily: "inherit",
          outline: "none",
          resize: "vertical",
          lineHeight: 1.6,
        }}
      />
    </div>
  );
}
