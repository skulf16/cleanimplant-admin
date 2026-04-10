"use client";

import { useActionState, useState } from "react";
import { createAdminUser } from "@/app/actions/users";

export default function NewUserPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [error, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      try {
        await createAdminUser(formData);
        return null;
      } catch (e: unknown) {
        return (e as Error).message ?? "Fehler beim Anlegen";
      }
    },
    null
  );

  return (
    <div>
      <div className="mb-6">
        <a href="/admin/users" className="text-[13px] text-[#999] hover:text-[#333] transition-colors">
          ← Zurück zur Liste
        </a>
        <h1 className="text-2xl font-bold text-[#333] mt-2">Neuen Benutzer anlegen</h1>
        <p className="text-[13px] text-[#999] mt-1">Interner Mitarbeiter mit Admin-Zugang</p>
      </div>

      <form action={formAction} className="space-y-6 max-w-md">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded">{error}</div>
        )}

        <fieldset className="bg-white border border-[#e5e7eb] rounded-[6px] p-6">
          <legend className="text-[13px] font-semibold text-[#555] uppercase tracking-wide px-2 mb-4">
            Zugangsdaten
          </legend>
          <div className="space-y-4">
            <div>
              <label className="label">E-Mail *</label>
              <input name="email" type="email" required placeholder="mitarbeiter@mycleandent.de" className="input" />
            </div>
            <div>
              <label className="label">Passwort *</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="input pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-[#999] hover:text-[#333] transition-colors"
                >
                  {showPassword ? "Verbergen" : "Zeigen"}
                </button>
              </div>
            </div>
          </div>
        </fieldset>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="bg-[#30A2F1] hover:bg-[#1a8fd8] disabled:opacity-60 !text-white font-semibold px-8 py-2.5 rounded text-[14px] transition-colors"
          >
            {pending ? "Anlegen…" : "Benutzer anlegen"}
          </button>
          <a href="/admin/users" className="text-[13px] text-[#999] hover:text-[#333] transition-colors">Abbrechen</a>
        </div>
      </form>
    </div>
  );
}
