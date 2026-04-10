"use client";

import { signOut } from "next-auth/react";
export default function MemberHeader() {
  return (
    <header
      className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 border-b"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cleanimplant-logo.png"
          alt="mycleandent"
          className="h-7 sm:h-9 w-auto object-contain"
        />
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-[11px] sm:text-[13px] font-semibold tracking-widest px-3 sm:px-5 py-1.5 sm:py-2 rounded transition-colors"
        style={{
          backgroundColor: "#1e5f8e",
          color: "#ffffff",
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2a7ab5")}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1e5f8e")}
      >
        ABMELDEN
      </button>
    </header>
  );
}
