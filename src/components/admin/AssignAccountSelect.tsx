"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { assignUserToDoctor, unlinkUserFromDoctor } from "@/app/actions/doctors";
import { Link2, Link2Off, Search, ChevronDown } from "lucide-react";

type User = {
  id: string;
  email: string;
  username: string | null;
  profiles: { firstName: string; lastName: string; city: string }[];
};

type Props = {
  doctorId: string;
  currentUserId: string | null;
  users: User[];
};

export default function AssignAccountSelect({ doctorId, currentUserId, users }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(currentUserId);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const selectedUser = users.find((u) => u.id === selectedId);

  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      (u.username ?? "").toLowerCase().includes(q) ||
      u.profiles.some((p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
      )
    );
  });

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleAssign(userId: string) {
    setOpen(false);
    setQuery("");
    startTransition(async () => {
      try {
        await assignUserToDoctor(doctorId, userId);
        setSelectedId(userId);
        setMessage({ type: "ok", text: "Account verknüpft" });
      } catch (e) {
        setMessage({ type: "err", text: (e as Error).message });
      }
      setTimeout(() => setMessage(null), 3000);
    });
  }

  function handleUnlink() {
    startTransition(async () => {
      try {
        await unlinkUserFromDoctor(doctorId);
        setSelectedId(null);
        setMessage({ type: "ok", text: "Verknüpfung aufgehoben" });
      } catch (e) {
        setMessage({ type: "err", text: (e as Error).message });
      }
      setTimeout(() => setMessage(null), 3000);
    });
  }

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[6px] p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Link2 size={15} className="text-[#30A2F1]" />
        <h2 className="text-[13px] font-semibold text-[#555] uppercase tracking-wide">
          Account zuweisen
        </h2>
        {selectedUser && (
          <span className="ml-auto text-[11px] text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
            Verknüpft · {selectedUser.email}
          </span>
        )}
      </div>

      <p className="text-[12px] text-[#999] mb-3">
        Vorhandenen Account mit diesem Profil verknüpfen – nützlich für Ärzte mit mehreren Standorten.
      </p>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Dropdown */}
        <div className="relative" ref={ref} style={{ width: 340 }}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-2 border border-[#d1d5db] rounded px-3 py-[7px] text-[13px] text-left bg-white hover:border-[#30A2F1] transition-colors"
          >
            <span className={selectedUser ? "text-[#333]" : "text-[#aaa]"}>
              {selectedUser
                ? `${selectedUser.email}${selectedUser.username ? ` · @${selectedUser.username}` : ""}`
                : "Account auswählen…"}
            </span>
            <ChevronDown size={14} className="text-[#aaa] flex-shrink-0" />
          </button>

          {open && (
            <div className="absolute z-50 top-full left-0 mt-1 w-full bg-white border border-[#e5e7eb] rounded shadow-lg overflow-hidden">
              {/* Search */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-[#f0f0f0]">
                <Search size={13} className="text-[#aaa]" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Suchen…"
                  className="flex-1 text-[13px] outline-none"
                />
              </div>

              {/* List */}
              <div className="max-h-56 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-[13px] text-[#aaa] px-3 py-3">Keine Ergebnisse</p>
                ) : (
                  filtered.map((u) => {
                    const linkedProfiles = u.profiles.filter((p) => true);
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleAssign(u.id)}
                        className="w-full text-left px-3 py-2.5 hover:bg-[#f0f7ff] transition-colors border-b border-[#f9f9f9] last:border-0"
                      >
                        <div className="text-[13px] font-medium text-[#333]">
                          {u.email}
                          {u.username && (
                            <span className="ml-2 text-[11px] text-[#999]">@{u.username}</span>
                          )}
                        </div>
                        {linkedProfiles.length > 0 && (
                          <div className="text-[11px] text-[#aaa] mt-0.5">
                            {linkedProfiles.map((p) => `${p.firstName} ${p.lastName} (${p.city})`).join(", ")}
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Unlink button */}
        {selectedId && (
          <button
            type="button"
            onClick={handleUnlink}
            disabled={isPending}
            className="flex items-center gap-1.5 text-[12px] text-[#999] hover:text-red-500 transition-colors"
          >
            <Link2Off size={13} />
            Verknüpfung aufheben
          </button>
        )}

        {isPending && <span className="text-[12px] text-[#aaa]">Speichern…</span>}
        {message && (
          <span className={`text-[12px] ${message.type === "ok" ? "text-green-600" : "text-red-500"}`}>
            {message.type === "ok" ? "✓" : "✕"} {message.text}
          </span>
        )}
      </div>
    </div>
  );
}
