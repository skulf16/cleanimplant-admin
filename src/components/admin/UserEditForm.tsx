"use client";

import { useActionState, useState } from "react";
import { updateUser } from "@/app/actions/users";

type User = { id: string; email: string };

export default function UserEditForm({ user }: { user: User }) {
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const bound = updateUser.bind(null, user.id);

  const [error, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      try {
        await bound(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        return null;
      } catch (e: unknown) {
        return (e as Error).message ?? "Fehler beim Speichern";
      }
    },
    null
  );

  return (
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
            <input name="email" type="email" required defaultValue={user.email} className="input" />
          </div>
          <div>
            <label className="label">Neues Passwort</label>
            <p className="text-[11px] text-[#aaa] mb-1">leer lassen = unverändert</p>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
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
          {pending ? "Speichern…" : "Speichern"}
        </button>
        {saved && <span className="text-[13px] text-green-600">✓ Gespeichert</span>}
        <a href="/admin/users" className="text-[13px] text-[#999] hover:text-[#333] transition-colors">Abbrechen</a>
      </div>
    </form>
  );
}
