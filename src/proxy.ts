import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Domain-Konfiguration ──────────────────────────────────────────────────────
//
// Lokal (Entwicklung):
//   Port 3000 → Öffentliche Seite (mycleandent.de)
//   Port 3001 → Member-Bereich   (member.cleanimplant.com)
//   Port 3002 → Admin-Bereich    (admin.mycleandent.de)
//
// Produktion:
//   mycleandent.de / mycleandent.com → Öffentlich
//   member.cleanimplant.com           → Member
//   admin.mycleandent.de              → Admin

const MEMBER_HOSTS = [
  "member.cleanimplant.com",
  "members.cleanimplant.com",
  "cleanimplant-members.vercel.app",
  "cleanimplant-members-",  // Preview-URLs: cleanimplant-members-<hash>-...-projects.vercel.app
  "localhost:3001",
  "127.0.0.1:3001",
];

const ADMIN_HOSTS = [
  "admin.mycleandent.de",
  "cleanimplant-admin.vercel.app",
  "cleanimplant-admin-git-main-info-59699660s-projects.vercel.app",
  "localhost:3002",
  "127.0.0.1:3002",
];

function isMemberDomain(host: string) {
  return MEMBER_HOSTS.some(h => host.includes(h));
}

function isAdminDomain(host: string) {
  return ADMIN_HOSTS.some(h => host.includes(h));
}

const { auth } = NextAuth(authConfig);

export default auth(function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") ?? req.nextUrl.hostname;

  const memberDomain = isMemberDomain(host);
  const adminDomain  = isAdminDomain(host);

  const isDotDe =
    host.includes("mycleandent.de") ||
    host.includes("mycleandent.com") ||
    host.includes("localhost:3000") ||
    host.includes("127.0.0.1:3000");

  const domain = isDotDe ? "DE" : "COM";

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-domain", domain);
  requestHeaders.set("x-hostname", host);
  requestHeaders.set("x-is-member-domain", memberDomain ? "1" : "0");
  requestHeaders.set("x-is-admin-domain",  adminDomain  ? "1" : "0");

  // ── Admin-Domain ──────────────────────────────────────────────────────────
  if (adminDomain) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    // Nur /admin/*, /login und /api/* erlaubt
    const previewMode = req.nextUrl.searchParams.get("preview") === "1";
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/api/") ||
      pathname === "/login" ||
      pathname === "/forgot" ||
      pathname === "/reset" ||
      (pathname.startsWith("/zahnarzt/") && previewMode)
    ) {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }
    // Alles andere → /admin
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // ── Member-Domain ─────────────────────────────────────────────────────────
  if (memberDomain) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/account", req.url));
    }
    const previewMode = req.nextUrl.searchParams.get("preview") === "1";
    if (
      pathname.startsWith("/account") ||
      pathname.startsWith("/api/") ||
      pathname === "/login" ||
      pathname === "/forgot" ||
      pathname === "/reset" ||
      (pathname.startsWith("/zahnarzt/") && previewMode)
    ) {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }
    // Alles andere (inkl. /admin) → /account
    return NextResponse.redirect(new URL("/account", req.url));
  }

  // ── Öffentliche Domain ────────────────────────────────────────────────────
  // /account und /admin sind gesperrt
  if (pathname.startsWith("/account") || pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf|pdf|mp4|webm)).*)"],
};
