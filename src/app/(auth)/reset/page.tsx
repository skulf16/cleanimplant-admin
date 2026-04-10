"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function ResetForm() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token") ?? "";
    setToken(t);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }

    if (password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen haben.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      body: JSON.stringify({ token, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Ein Fehler ist aufgetreten.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    }
  }

  if (!token) {
    return (
      <div className="text-center py-4">
        <p className="text-red-300 text-[14px]">Ungültiger Reset-Link.</p>
        <Link href="/forgot" className="text-[13px] mt-3 block" style={{ color: "rgba(255,255,255,0.5)" }}>
          Neuen Link anfordern
        </Link>
      </div>
    );
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
        <h1 className="text-[22px] font-bold text-white mb-1">Neues Passwort</h1>
        <p className="text-[13px] mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
          Vergeben Sie ein neues Passwort für Ihr Konto.
        </p>

        {success ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-white font-semibold mb-2">Passwort geändert</p>
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>
              Sie werden zum Login weitergeleitet…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>
                Neues Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Mindestens 8 Zeichen"
                className="w-full rounded-lg px-4 py-3 text-[14px] text-white focus:outline-none transition-colors"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.4)")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>
                Passwort bestätigen
              </label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg px-4 py-3 text-[14px] text-white focus:outline-none transition-colors"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.4)")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
              />
            </div>

            {error && (
              <p className="text-[13px] bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-[14px] transition-all disabled:opacity-60"
              style={{ background: "#fff", color: "#00385E" }}
            >
              {loading ? "Speichern…" : "Passwort speichern"}
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

export default function ResetPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
