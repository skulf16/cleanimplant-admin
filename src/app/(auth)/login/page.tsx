"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError("E-Mail oder Passwort falsch.");
    } else {
      router.push("/account");
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-[#333] mb-1">Anmelden</h1>
        <p className="text-[13px] text-[#999] mb-6">
          Zugang zum Mitglieder-Portal
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-[#333] mb-1.5">
              E-Mail
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#2EA3F2] transition-colors"
              placeholder="ihr@email.de"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[13px] font-medium text-[#333]">
                Passwort
              </label>
              <Link
                href="/forgot"
                className="text-[12px] text-[#2EA3F2] hover:underline"
              >
                Passwort vergessen?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              required
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#2EA3F2] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-[13px] text-red-600 bg-red-50 px-3 py-2 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2EA3F2] text-white py-2.5 rounded font-semibold text-[14px] hover:bg-[#1a8fd8] transition-colors disabled:opacity-60"
          >
            {loading ? "Anmelden..." : "Anmelden"}
          </button>
        </form>
      </div>

      <p className="text-center text-[13px] text-[#999] mt-4">
        Noch kein Konto?{" "}
        <Link href="/join-us" className="text-[#2EA3F2] hover:underline">
          Mitglied werden
        </Link>
      </p>
    </div>
  );
}
