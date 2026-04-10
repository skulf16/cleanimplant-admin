"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    await fetch("/api/auth/forgot", {
      method: "POST",
      body: JSON.stringify({ email: form.get("email") }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="w-full max-w-sm">
      <div
        className="rounded-2xl p-8"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        <h1 className="text-[22px] font-bold text-white mb-1">Passwort vergessen</h1>
        <p className="text-[13px] mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
          Wir senden Ihnen einen Reset-Link per E-Mail.
        </p>

        {sent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✉️</div>
            <p className="text-white font-semibold mb-2">E-Mail gesendet</p>
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>
              Falls ein Konto mit dieser E-Mail existiert, erhalten Sie einen Reset-Link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>
                E-Mail-Adresse
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="ihr@email.de"
                className="w-full rounded-lg px-4 py-3 text-[14px] text-white focus:outline-none transition-colors"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.4)")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-[14px] transition-all disabled:opacity-60"
              style={{ background: "#fff", color: "#00385E" }}
            >
              {loading ? "Sende…" : "Reset-Link senden"}
            </button>
          </form>
        )}
      </div>

      <p className="text-center text-[13px] mt-4" style={{ color: "rgba(255,255,255,0.4)" }}>
        <Link href="/login" className="hover:text-white transition-colors">
          ← Zurück zum Login
        </Link>
      </p>
    </div>
  );
}
