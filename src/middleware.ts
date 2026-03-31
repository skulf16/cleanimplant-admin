import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // ── Domain-Context in Header schreiben ──────────────────────────────
  // Wird in Layouts und Server Components via headers() ausgelesen
  const isDotDe =
    hostname === "mycleandent.de" ||
    hostname === "www.mycleandent.de" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1";

  const domain = isDotDe ? "DE" : "COM";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-domain", domain);
  requestHeaders.set("x-hostname", hostname);

  // ── Auth-Schutz ──────────────────────────────────────────────────────
  const session = await auth();

  // Member-Portal: Login erforderlich
  if (pathname.startsWith("/account")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Admin-Bereich: nur ADMIN
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if ((session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
