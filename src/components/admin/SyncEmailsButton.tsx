"use client";

import { useState } from "react";
import { syncProfileEmailsFromUsers, linkProfilesWithMatchingUsers } from "@/app/actions/doctors";
import { RefreshCw, Link2 } from "lucide-react";

export default function SyncEmailsButton() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [linking, setLinking] = useState(false);

  async function handleSync() {
    setLoading(true);
    setStatus(null);
    try {
      const result = await syncProfileEmailsFromUsers();
      setStatus(`✓ ${result.updated} E-Mail${result.updated !== 1 ? "s" : ""} übertragen`);
    } catch (e) {
      setStatus("Fehler: " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLink() {
    setLinking(true);
    setStatus(null);
    try {
      const result = await linkProfilesWithMatchingUsers();
      setStatus(`✓ ${result.linked} von ${result.total} Profilen verknüpft`);
    } catch (e) {
      setStatus("Fehler: " + (e as Error).message);
    } finally {
      setLinking(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleLink}
        disabled={linking}
        className="flex items-center gap-1.5 text-[13px] border border-gray-300 hover:border-[#30A2F1] hover:text-[#30A2F1] px-3 py-1.5 rounded transition-colors disabled:opacity-50"
      >
        <Link2 size={13} className={linking ? "animate-pulse" : ""} />
        Profile mit Accounts verknüpfen
      </button>
      <button
        onClick={handleSync}
        disabled={loading}
        className="flex items-center gap-1.5 text-[13px] border border-gray-300 hover:border-[#30A2F1] hover:text-[#30A2F1] px-3 py-1.5 rounded transition-colors disabled:opacity-50"
      >
        <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
        E-Mails aus Accounts übernehmen
      </button>
      {status && (
        <span className={`text-[13px] ${status.startsWith("✓") ? "text-green-600" : "text-red-600"}`}>
          {status}
        </span>
      )}
    </div>
  );
}
