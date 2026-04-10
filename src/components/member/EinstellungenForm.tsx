"use client";

import { useActionState, useState } from "react";
import { updateMemberProfile, changeMemberPassword } from "@/app/actions/member";
import { signOut } from "next-auth/react";
import { KeyRound, LogOut } from "lucide-react";

const TITEL_OPTIONS = ["", "Dr.", "Dr. med. dent.", "Prof. Dr.", "Prof. Dr. med. dent.", "M.Sc.", "PD Dr."];

type Props = {
  title:     string | null;
  firstName: string;
  lastName:  string;
  email:     string;
};

export default function EinstellungenForm({ title, firstName, lastName, email }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [profileSaved,  setProfileSaved]  = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const [profileError, profileAction, profilePending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      const err = await updateMemberProfile(_prev, formData);
      if (!err) { setProfileSaved(true); setTimeout(() => setProfileSaved(false), 3000); }
      return err;
    },
    null
  );

  const [passwordError, passwordAction, passwordPending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      const err = await changeMemberPassword(_prev, formData);
      if (!err) { setPasswordSaved(true); setTimeout(() => setPasswordSaved(false), 3000); }
      return err;
    },
    null
  );

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    fontSize: 14,
    color: "#1f2937",
    outline: "none",
    backgroundColor: "#fff",
  };

  const btnPrimary: React.CSSProperties = {
    width: "100%",
    padding: "13px",
    backgroundColor: "#4a9ebe",
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: "0.1em",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    transition: "background-color 0.2s",
  };

  const btnSecondary: React.CSSProperties = {
    width: "100%",
    padding: "11px",
    backgroundColor: "#1e3a5c",
    color: "#fff",
    fontWeight: 600,
    fontSize: 13,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "background-color 0.2s",
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start max-w-4xl">

      {/* ── Linke Spalte: Aktionen ─────────────────────────────────────── */}
      <div className="w-full sm:w-[220px] flex-shrink-0 space-y-3">
        {showPassword ? (
          <button
            type="button"
            style={btnSecondary}
            onClick={() => setShowPassword(false)}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2a5480")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1e3a5c")}
          >
            ← Zurück zu Einstellungen
          </button>
        ) : (
          <button
            type="button"
            style={btnSecondary}
            onClick={() => setShowPassword(true)}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2a5480")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1e3a5c")}
          >
            <KeyRound size={14} />
            Passwort ändern
          </button>
        )}

        <button
          type="button"
          style={btnSecondary}
          onClick={() => signOut({ callbackUrl: "/login" })}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2a5480")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1e3a5c")}
        >
          <LogOut size={14} />
          Abmelden
        </button>
      </div>

      {/* ── Rechte Spalte: Formulare ───────────────────────────────────── */}
      <div className="flex-1 space-y-5">

        {/* Profildaten */}
        {!showPassword && <div className="bg-white rounded-lg p-6">
          <form action={profileAction} className="space-y-3">
            {/* Titel */}
            <select name="title" defaultValue={title ?? ""} style={inputStyle}>
              {TITEL_OPTIONS.map(t => (
                <option key={t} value={t}>{t || "– Kein Titel –"}</option>
              ))}
            </select>

            {/* Vorname */}
            <input
              name="firstName"
              type="text"
              required
              defaultValue={firstName}
              placeholder="Vorname"
              style={inputStyle}
            />

            {/* Nachname */}
            <input
              name="lastName"
              type="text"
              required
              defaultValue={lastName}
              placeholder="Nachname"
              style={inputStyle}
            />

            {/* E-Mail */}
            <input
              name="email"
              type="email"
              required
              defaultValue={email}
              placeholder="E-Mail-Adresse"
              style={inputStyle}
            />

            {profileError && (
              <p className="text-[13px] text-red-600 bg-red-50 px-3 py-2 rounded">{profileError}</p>
            )}

            <button
              type="submit"
              disabled={profilePending}
              style={{ ...btnPrimary, opacity: profilePending ? 0.6 : 1 }}
            >
              {profilePending ? "WIRD GESPEICHERT …" : profileSaved ? "✓ GESPEICHERT" : "KONTO AKTUALISIEREN"}
            </button>
          </form>
        </div>}

        {/* Passwort ändern (aufklappbar) */}
        {showPassword && (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-[14px] font-semibold text-[#1f2937] mb-4">Passwort ändern</h3>
            <form action={passwordAction} className="space-y-3">
              <input
                name="currentPassword"
                type="password"
                required
                placeholder="Aktuelles Passwort"
                style={inputStyle}
              />
              <input
                name="newPassword"
                type="password"
                required
                placeholder="Neues Passwort (min. 8 Zeichen)"
                style={inputStyle}
              />
              <input
                name="confirmPassword"
                type="password"
                required
                placeholder="Neues Passwort bestätigen"
                style={inputStyle}
              />

              {passwordError && (
                <p className="text-[13px] text-red-600 bg-red-50 px-3 py-2 rounded">{passwordError}</p>
              )}

              <button
                type="submit"
                disabled={passwordPending}
                style={{ ...btnPrimary, opacity: passwordPending ? 0.6 : 1 }}
              >
                {passwordPending ? "WIRD GEÄNDERT …" : passwordSaved ? "✓ PASSWORT GEÄNDERT" : "PASSWORT SPEICHERN"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
