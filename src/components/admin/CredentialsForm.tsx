"use client";

import { useActionState, useState } from "react";
import { setDoctorCredentials, removeDoctorCredentials } from "@/app/actions/doctors";
import { KeyRound, UserX } from "lucide-react";

type User = { id: string; email: string; username?: string | null; createdAt: Date } | null;

type Props = {
  doctorId: string;
  user: User;
  doctorEmail?: string;
};

export default function CredentialsForm({ doctorId, user, doctorEmail }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [saved, setSaved] = useState(false);

  const boundAction = setDoctorCredentials.bind(null, doctorId);

  const [error, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      try {
        await boundAction(formData);
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
    <div className="bg-white border border-[#e5e7eb] rounded-[6px] p-6 mb-8">
      <div className="flex items-center gap-2 mb-5">
        <KeyRound size={16} className="text-[#30A2F1]" />
        <h2 className="text-[13px] font-semibold text-[#555] uppercase tracking-wide">
          Zugangsdaten (member.cleanimplant.com)
        </h2>
        {user && (
          <span className="ml-auto text-[11px] text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
            Account aktiv · {user.email}
          </span>
        )}
      </div>

      <form action={formAction} className="flex flex-wrap items-end gap-3">
        <div>
          <label className="label">E-Mail</label>
          <input
            name="credEmail"
            type="email"
            required
            defaultValue={user?.email ?? doctorEmail ?? ""}
            placeholder="arzt@praxis.de"
            style={{ width: 260 }}
            className="input"
          />
        </div>
        <div>
          <label className="label">Benutzername</label>
          {user && <p className="text-[11px] text-[#aaa] mb-1">leer lassen = unverändert</p>}
          <input
            name="credUsername"
            type="text"
            defaultValue={user?.username ?? ""}
            placeholder="z.B. dr-mueller"
            style={{ width: 200 }}
            className="input"
          />
        </div>
        <div>
          <label className="label">Passwort</label>
          {user && <p className="text-[11px] text-[#aaa] mb-1">leer lassen = unverändert</p>}
          <div className="relative">
            <input
              name="credPassword"
              type={showPassword ? "text" : "password"}
              placeholder={user ? "••••••••" : "Passwort vergeben"}
              style={{ width: 280, paddingRight: 56 }}
            className="input"
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
        <button
          type="submit"
          disabled={pending}
          className="bg-[#30A2F1] hover:bg-[#1a8fd8] disabled:opacity-60 text-white font-semibold px-5 py-[7px] rounded text-[13px] transition-colors"
        >
          {pending ? "Speichern…" : "Speichern"}
        </button>
        {saved && (
          <span className="text-[13px] text-green-600">✓ Gespeichert</span>
        )}
      </form>

      {error && (
        <p className="mt-2 text-[13px] text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>
      )}

      {user && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {!confirmRemove ? (
            <button
              onClick={() => setConfirmRemove(true)}
              className="flex items-center gap-1.5 text-[12px] text-red-400 hover:text-red-600 transition-colors"
            >
              <UserX size={13} /> Zugangsdaten entfernen
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-red-600">Account wirklich löschen?</span>
              <form action={removeDoctorCredentials.bind(null, doctorId)}>
                <button
                  type="submit"
                  className="text-[12px] text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors"
                >
                  Ja, löschen
                </button>
              </form>
              <button
                onClick={() => setConfirmRemove(false)}
                className="text-[12px] text-[#999] hover:text-[#333] transition-colors"
              >
                Abbrechen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
