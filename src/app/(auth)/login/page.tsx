"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const port = window.location.port;
    const host = window.location.hostname;
    setIsAdmin(port === "3002" || host.startsWith("admin."));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("E-Mail/Benutzername oder Passwort falsch.");
    } else {
      if (isAdmin) {
        router.push("/admin");
      } else {
        const session = await fetch("/api/auth/session").then((r) => r.json());
        if (session?.user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/account");
        }
      }
      router.refresh();
    }
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
        <h1 className="text-[22px] font-bold text-white mb-1">Anmelden</h1>
        <p className="text-[13px] mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
          {isAdmin ? "Zugang zum Admin-Panel" : "Zugang zum Mitglieder-Portal"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>
              E-Mail oder Benutzername
            </label>
            <input
              type="text"
              name="email"
              required
              autoComplete="username"
              placeholder="ihr@email.de oder Benutzername"
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
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                Passwort
              </label>
              <Link
                href="/forgot"
                className="text-[12px] transition-colors"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Passwort vergessen?
              </Link>
            </div>
            <input
              type="password"
              name="password"
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
            {loading ? "Anmelden…" : "Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}
