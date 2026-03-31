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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-[#333] mb-1">Passwort vergessen</h1>
        <p className="text-[13px] text-[#999] mb-6">
          Wir senden Ihnen einen Reset-Link.
        </p>

        {sent ? (
          <div className="text-center py-4">
            <p className="text-[14px] text-green-600 font-medium mb-2">
              E-Mail gesendet!
            </p>
            <p className="text-[13px] text-[#666]">
              Falls ein Konto mit dieser E-Mail existiert, erhalten Sie einen Reset-Link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#333] mb-1.5">
                E-Mail
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#2EA3F2]"
                placeholder="ihr@email.de"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2EA3F2] text-white py-2.5 rounded font-semibold text-[14px] hover:bg-[#1a8fd8] transition-colors disabled:opacity-60"
            >
              {loading ? "Sende..." : "Reset-Link senden"}
            </button>
          </form>
        )}
      </div>

      <p className="text-center text-[13px] text-[#999] mt-4">
        <Link href="/login" className="text-[#2EA3F2] hover:underline">
          ← Zurück zum Login
        </Link>
      </p>
    </div>
  );
}
