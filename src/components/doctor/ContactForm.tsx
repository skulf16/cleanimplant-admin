"use client";

import { useState, FormEvent } from "react";
import { sendContactEmail } from "@/app/actions/contact";

type RadioOption = "termin" | "rueckruf";

type Props = {
  practiceEmail: string | null;
  practiceName: string;
};

const inputStyle: React.CSSProperties = {
  border: "1px solid #F5907B",
  borderRadius: 6,
  padding: "12px 14px",
  width: "100%",
  fontSize: 14,
  fontWeight: 500,
  color: "#00385E",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  background: "#fff",
};

export default function ContactForm({ practiceEmail, practiceName }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [radio, setRadio] = useState<RadioOption>("termin");
  const [phone, setPhone] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const result = await sendContactEmail({
      firstName,
      lastName,
      email,
      phone: radio === "rueckruf" ? phone : undefined,
      requestType: radio,
      practiceEmail,
      practiceName,
      honeypot,
    });

    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Unbekannter Fehler.");
    }
  }

  function getFocusStyle(field: string): React.CSSProperties {
    return focusedField === field
      ? { ...inputStyle, borderColor: "#F5907B", boxShadow: "0 0 0 3px rgba(245,144,123,0.18)" }
      : inputStyle;
  }

  if (status === "success") {
    return (
      <div id="contact-form" className="bg-white" style={{ borderRadius: 10, padding: 24 }}>
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
          <h2 style={{ color: "#00385E", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            Nachricht gesendet!
          </h2>
          <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6 }}>
            Vielen Dank für Ihre Anfrage. Sie erhalten in Kürze eine Bestätigung per E-Mail.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="contact-form" className="bg-white" style={{ borderRadius: 10, padding: 24 }}>
      <h2 style={{ color: "#BEC3AA", fontSize: "2.5vmax", fontWeight: 600, marginBottom: 6, marginTop: 0 }}>
        Praxis kontaktieren
      </h2>
      <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20, marginTop: 0 }}>
        Die mit * markierten Felder sind Pflichtfelder.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Honeypot — für Bots unsichtbar, nie von echten Nutzern ausgefüllt */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />

        {/* Vorname + Nachname */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onFocus={() => setFocusedField("firstname")}
            onBlur={() => setFocusedField(null)}
            style={getFocusStyle("firstname")}
            placeholder="Vorname *"
          />
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onFocus={() => setFocusedField("lastname")}
            onBlur={() => setFocusedField(null)}
            style={getFocusStyle("lastname")}
            placeholder="Nachname *"
          />
        </div>

        {/* E-Mail */}
        <div className="mb-5">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            style={getFocusStyle("email")}
            placeholder="E-Mail-Adresse *"
          />
        </div>

        {/* Radio options */}
        <div className="mb-5">
          <p style={{ fontSize: 13, fontWeight: 600, color: "#BEC3AA", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
            Ihr Anliegen *
          </p>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer" style={{ fontSize: 14, fontWeight: 500, color: "#00385E" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 22, height: 22, borderRadius: "50%", border: "2px solid #F5907B",
                flexShrink: 0, marginTop: 1,
                background: radio === "termin" ? "#F5907B" : "#fff",
                cursor: "pointer", transition: "background 0.15s",
              }} onClick={() => setRadio("termin")}>
                {radio === "termin" && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", display: "block" }} />}
              </span>
              <span onClick={() => setRadio("termin")}>Ich möchte einen Termin für eine Beratung buchen</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer" style={{ fontSize: 14, fontWeight: 500, color: "#00385E" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 22, height: 22, borderRadius: "50%", border: "2px solid #F5907B",
                flexShrink: 0, marginTop: 1,
                background: radio === "rueckruf" ? "#F5907B" : "#fff",
                cursor: "pointer", transition: "background 0.15s",
              }} onClick={() => setRadio("rueckruf")}>
                {radio === "rueckruf" && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", display: "block" }} />}
              </span>
              <span onClick={() => setRadio("rueckruf")}>Ich bitte um einen Rückruf für weitere Informationen</span>
            </label>
          </div>
        </div>

        {/* Conditional phone field */}
        {radio === "rueckruf" && (
          <div className="mb-5">
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField(null)}
              style={getFocusStyle("phone")}
              placeholder="Telefonnummer *"
            />
          </div>
        )}

        {/* Datenschutz */}
        <div className="mb-4" style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <input
            type="checkbox"
            id="privacy"
            required
            style={{ marginTop: 3, accentColor: "#F4907B", flexShrink: 0, width: 16, height: 16, cursor: "pointer" }}
          />
          <label htmlFor="privacy" style={{ fontSize: 13, color: "#374151", lineHeight: 1.5, cursor: "pointer" }}>
            Ich erkläre mich mit der Verarbeitung der eingegebenen Daten sowie der{" "}
            <a href="/datenschutz" target="_blank" style={{ color: "#F4907B", textDecoration: "underline" }}>
              Datenschutzerklärung
            </a>{" "}
            einverstanden.
          </label>
        </div>

        {/* Error message */}
        {status === "error" && (
          <p style={{ color: "#e53e3e", fontSize: 13, marginBottom: 12 }}>
            {errorMsg}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "sending"}
          style={{
            width: "100%",
            background: status === "sending" ? "#ccc" : "#F4907B",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 0",
            fontWeight: 700,
            fontSize: 14,
            cursor: status === "sending" ? "not-allowed" : "pointer",
            letterSpacing: "0.03em",
            fontFamily: "inherit",
            transition: "background 0.2s",
          }}
        >
          {status === "sending" ? "Wird gesendet …" : "NACHRICHT SENDEN"}
        </button>
      </form>
    </div>
  );
}
