"use client";

import { useState, useTransition } from "react";
import { Upload, Plus, Key, Trash2, Users } from "lucide-react";
import { importMembersFromCSV, importUsernamesFromCSV, createMember, updateMemberPassword, deleteMember } from "@/app/actions/members";
import { useRouter } from "next/navigation";

type Member = {
  id: string;
  email: string;
  createdAt: Date;
  profile: { firstName: string; lastName: string; practiceName: string | null; city: string } | null;
};

export default function MembersPage() {
  return <MembersClient />;
}

function MembersClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // CSV Import
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ created: number; skipped: number; errors: string[] } | null>(null);

  // Username Import
  const [importingUsernames, setImportingUsernames] = useState(false);
  const [usernameResult, setUsernameResult] = useState<{ updated: number; skipped: number; errors: string[] } | null>(null);

  // New member form
  const [showNew, setShowNew] = useState(false);
  const [newError, setNewError] = useState("");

  // Password reset
  const [resetId, setResetId] = useState<string | null>(null);
  const [resetError, setResetError] = useState("");

  async function handleUsernameImport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setImportingUsernames(true);
    setUsernameResult(null);
    const fd = new FormData(e.currentTarget);
    const result = await importUsernamesFromCSV(fd);
    setUsernameResult(result);
    setImportingUsernames(false);
    router.refresh();
  }

  async function handleImport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setImporting(true);
    setImportResult(null);
    const fd = new FormData(e.currentTarget);
    const result = await importMembersFromCSV(fd);
    setImportResult(result);
    setImporting(false);
    router.refresh();
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNewError("");
    const fd = new FormData(e.currentTarget);
    try {
      await createMember(fd);
      setShowNew(false);
      router.refresh();
    } catch (err) {
      setNewError((err as Error).message);
    }
  }

  async function handlePasswordReset(e: React.FormEvent<HTMLFormElement>, userId: string) {
    e.preventDefault();
    setResetError("");
    const fd = new FormData(e.currentTarget);
    try {
      await updateMemberPassword(userId, fd);
      setResetId(null);
    } catch (err) {
      setResetError((err as Error).message);
    }
  }

  return (
    <MembersPageInner
      importing={importing}
      importResult={importResult}
      importingUsernames={importingUsernames}
      usernameResult={usernameResult}
      showNew={showNew}
      newError={newError}
      resetId={resetId}
      resetError={resetError}
      onImport={handleImport}
      onUsernameImport={handleUsernameImport}
      onCreate={handleCreate}
      onPasswordReset={handlePasswordReset}
      onShowNew={() => setShowNew(v => !v)}
      onSetResetId={setResetId}
      onDelete={async (id) => {
        if (!confirm("Mitglied wirklich löschen?")) return;
        await deleteMember(id);
        router.refresh();
      }}
    />
  );
}

// Server data fetcher wrapper — we use a server component trick via fetch
import { useEffect } from "react";

function MembersPageInner({
  importing, importResult, importingUsernames, usernameResult,
  showNew, newError, resetId, resetError,
  onImport, onUsernameImport, onCreate, onPasswordReset, onShowNew, onSetResetId, onDelete,
}: {
  importing: boolean;
  importResult: { created: number; skipped: number; errors: string[] } | null;
  importingUsernames: boolean;
  usernameResult: { updated: number; skipped: number; errors: string[] } | null;
  showNew: boolean;
  newError: string;
  resetId: string | null;
  resetError: string;
  onImport: (e: React.FormEvent<HTMLFormElement>) => void;
  onUsernameImport: (e: React.FormEvent<HTMLFormElement>) => void;
  onCreate: (e: React.FormEvent<HTMLFormElement>) => void;
  onPasswordReset: (e: React.FormEvent<HTMLFormElement>, id: string) => void;
  onShowNew: () => void;
  onSetResetId: (id: string | null) => void;
  onDelete: (id: string) => void;
}) {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetch("/api/admin/members").then(r => r.json()).then(setMembers);
  }, [importing, showNew, resetId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#333]">Mitglieder</h1>
          <p className="text-[13px] text-[#999] mt-1">{members.length} Mitglieder · Member-Portal Zugänge</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onShowNew}
            className="flex items-center gap-2 bg-[#30A2F1] text-white px-4 py-2 rounded text-[13px] font-semibold hover:bg-[#1a8fd8] transition-colors"
          >
            <Plus size={14} /> Mitglied anlegen
          </button>
        </div>
      </div>

      {/* CSV Import */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-[14px] font-semibold text-[#333] mb-3 flex items-center gap-2">
          <Upload size={15} className="text-[#30A2F1]" /> WordPress-Import (CSV aus phpMyAdmin)
        </h2>
        <p className="text-[12px] text-[#999] mb-4">
          Exportiere die Tabelle <code className="bg-gray-100 px-1 rounded">wp_users</code> aus phpMyAdmin als CSV.
          Spalten: <code className="bg-gray-100 px-1 rounded">user_email, user_pass, display_name</code> werden automatisch erkannt.
        </p>
        <form onSubmit={onImport} className="flex items-center gap-3">
          <input
            type="file"
            name="csv"
            accept=".csv,.txt"
            required
            className="text-[13px] text-[#666] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[12px] file:font-semibold file:bg-[#30A2F1]/10 file:text-[#30A2F1] hover:file:bg-[#30A2F1]/20"
          />
          <button
            type="submit"
            disabled={importing}
            className="bg-[#30A2F1] text-white px-4 py-1.5 rounded text-[13px] font-semibold hover:bg-[#1a8fd8] disabled:opacity-50 transition-colors flex-shrink-0"
          >
            {importing ? "Importiert …" : "Importieren"}
          </button>
        </form>

        {importResult && (
          <div className="mt-4 space-y-2">
            <div className="flex gap-4 text-[13px]">
              <span className="text-green-600 font-semibold">✓ {importResult.created} importiert</span>
              {importResult.skipped > 0 && <span className="text-amber-600">{importResult.skipped} übersprungen (bereits vorhanden)</span>}
            </div>
            {importResult.errors.length > 0 && (
              <div className="bg-red-50 rounded p-3 text-[12px] text-red-600 space-y-1">
                {importResult.errors.map((e, i) => <p key={i}>{e}</p>)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Benutzernamen-Import */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-[14px] font-semibold text-[#333] mb-3 flex items-center gap-2">
          <Upload size={15} className="text-[#30A2F1]" /> Benutzernamen importieren (user_login)
        </h2>
        <p className="text-[12px] text-[#999] mb-4">
          Gleiche CSV wie oben – liest <code className="bg-gray-100 px-1 rounded">user_login</code> und{" "}
          <code className="bg-gray-100 px-1 rounded">user_email</code> aus und aktualisiert bestehende Accounts.
        </p>
        <form onSubmit={onUsernameImport} className="flex items-center gap-3">
          <input
            type="file"
            name="csv"
            accept=".csv,.txt"
            required
            className="text-[13px] text-[#666] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[12px] file:font-semibold file:bg-[#30A2F1]/10 file:text-[#30A2F1] hover:file:bg-[#30A2F1]/20"
          />
          <button
            type="submit"
            disabled={importingUsernames}
            className="bg-[#30A2F1] text-white px-4 py-1.5 rounded text-[13px] font-semibold hover:bg-[#1a8fd8] disabled:opacity-50 transition-colors flex-shrink-0"
          >
            {importingUsernames ? "Aktualisiert …" : "Benutzernamen eintragen"}
          </button>
        </form>
        {usernameResult && (
          <div className="mt-4 space-y-2">
            <div className="flex gap-4 text-[13px]">
              <span className="text-green-600 font-semibold">✓ {usernameResult.updated} aktualisiert</span>
              {usernameResult.skipped > 0 && <span className="text-amber-600">{usernameResult.skipped} übersprungen</span>}
            </div>
            {usernameResult.errors.length > 0 && (
              <div className="bg-red-50 rounded p-3 text-[12px] text-red-600 space-y-1 max-h-40 overflow-y-auto">
                {usernameResult.errors.map((e, i) => <p key={i}>{e}</p>)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Neues Mitglied */}
      {showNew && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-[14px] font-semibold text-[#333] mb-4">Neues Mitglied anlegen</h2>
          <form onSubmit={onCreate} className="grid grid-cols-2 gap-4 max-w-xl">
            <div>
              <label className="label">Vorname</label>
              <input name="firstName" type="text" className="input w-full" placeholder="Vorname" />
            </div>
            <div>
              <label className="label">Nachname</label>
              <input name="lastName" type="text" className="input w-full" placeholder="Nachname" />
            </div>
            <div className="col-span-2">
              <label className="label">E-Mail *</label>
              <input name="email" type="email" required className="input w-full" placeholder="email@example.com" />
            </div>
            <div className="col-span-2">
              <label className="label">Passwort (leer = CleanImplant2025!)</label>
              <input name="password" type="text" className="input w-full font-mono" placeholder="CleanImplant2025!" />
            </div>
            {newError && <p className="col-span-2 text-[13px] text-red-600 bg-red-50 px-3 py-2 rounded">{newError}</p>}
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="bg-[#30A2F1] text-white px-5 py-2 rounded text-[13px] font-semibold hover:bg-[#1a8fd8] transition-colors">
                Anlegen
              </button>
              <button type="button" onClick={onShowNew} className="text-[#999] hover:text-[#333] text-[13px] px-3">
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mitgliederliste */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {members.length === 0 ? (
          <div className="py-16 text-center text-[#999] text-[14px]">
            <Users size={32} className="mx-auto mb-3 text-gray-300" />
            Noch keine Mitglieder importiert.
          </div>
        ) : (
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Name</th>
                <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">E-Mail</th>
                <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Angelegt</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map(member => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-[#333]">
                    {member.profile
                      ? <>
                          <span>{member.profile.firstName} {member.profile.lastName}</span>
                          {member.profile.practiceName && (
                            <span className="ml-2 text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full">Arztprofil ✓</span>
                          )}
                          {member.profile.city && (
                            <span className="block text-[11px] text-[#999]">{member.profile.practiceName ?? ""}{member.profile.practiceName ? " · " : ""}{member.profile.city}</span>
                          )}
                        </>
                      : "–"
                    }
                  </td>
                  <td className="px-5 py-3.5 text-[#666]">{member.email}</td>
                  <td className="px-5 py-3.5 text-[#999]">
                    {new Date(member.createdAt).toLocaleDateString("de-DE")}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() => onSetResetId(resetId === member.id ? null : member.id)}
                        className="text-[#30A2F1] hover:text-[#1a8fd8] transition-colors"
                        title="Passwort setzen"
                      >
                        <Key size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(member.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                        title="Löschen"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {resetId === member.id && (
                      <form
                        onSubmit={e => onPasswordReset(e, member.id)}
                        className="flex gap-2 mt-2"
                      >
                        <input
                          name="password"
                          type="text"
                          placeholder="Neues Passwort"
                          className="border border-gray-200 rounded px-2 py-1 text-[12px] w-40 font-mono"
                          required
                        />
                        <button type="submit" className="bg-[#30A2F1] text-white px-3 py-1 rounded text-[12px] font-semibold hover:bg-[#1a8fd8]">
                          Setzen
                        </button>
                        {resetError && <span className="text-red-500 text-[12px] self-center">{resetError}</span>}
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
