"use client";

import { useState } from "react";
import { registerForWebinar } from "@/app/actions/events";

type Props = {
  webinarId:       string;
  userId:          string;
  userEmail:       string;
  userName:        string;
  isRegistered:    boolean;
  registrationUrl: string | null;
  meetingUrl:      string | null;
};

export default function WebinarRegisterButton({
  webinarId,
  userId,
  userEmail,
  userName,
  isRegistered,
  registrationUrl,
  meetingUrl,
}: Props) {
  const [registered, setRegistered] = useState(isRegistered);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [confirming, setConfirming] = useState(false);

  // External registration form
  if (registrationUrl) {
    return (
      <a
        href={registrationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-[#30A2F1] hover:bg-[#1a8fd8] text-white font-semibold px-6 py-2.5 rounded text-[13px] transition-colors"
      >
        Jetzt anmelden →
      </a>
    );
  }

  if (registered) {
    return (
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 font-semibold px-5 py-2.5 rounded text-[13px]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Angemeldet
        </div>
        {meetingUrl && (
          <div>
            <a
              href={meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#00385E] hover:bg-[#002a46] text-white font-semibold px-5 py-2.5 rounded text-[13px] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
              Zum Webinar-Link
            </a>
          </div>
        )}
      </div>
    );
  }

  async function handleRegister() {
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.set("userId", userId);
      fd.set("email",  userEmail);
      fd.set("name",   userName);
      await registerForWebinar(webinarId, fd);
      setRegistered(true);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (confirming) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
        <p className="text-[13px] text-white/70">Anmeldung bestätigen als:</p>
        <div className="space-y-0.5">
          <p className="text-[14px] font-semibold text-white">{userName}</p>
          <p className="text-[12px] text-white/50">{userEmail}</p>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-[#30A2F1] hover:bg-[#1a8fd8] disabled:opacity-50 text-white font-semibold px-5 py-2 rounded text-[13px] transition-colors"
          >
            {loading ? "Anmelden …" : "Bestätigen"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={loading}
            className="text-white/40 hover:text-white/70 text-[13px] transition-colors px-3"
          >
            Abbrechen
          </button>
        </div>
        {error && <p className="text-[12px] text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => setConfirming(true)}
        className="bg-[#30A2F1] hover:bg-[#1a8fd8] text-white font-semibold px-6 py-2.5 rounded text-[13px] transition-colors"
      >
        Jetzt anmelden
      </button>
    </div>
  );
}
