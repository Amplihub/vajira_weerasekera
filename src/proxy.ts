import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Next.js 16 Proxy (formerly Middleware). Optimistic, edge-safe gate: checks only
// for presence of the session cookie (no DB call). Full admin-email authorization
// is enforced server-side in src/lib/guard.ts on each admin page and /api/admin route.
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    const signInUrl = new URL("/admin/login", request.url);
    signInUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
}

export const config = {
  // Protect everything under /admin except the login page itself.
  matcher: ["/admin/((?!login).*)"],
};
