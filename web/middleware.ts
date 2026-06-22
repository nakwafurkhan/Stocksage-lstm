import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Protects the dashboard (and future signed-in areas). Unauthenticated visitors
 * are redirected to /sign-in with a redirect back to where they were going.
 * This only checks for the session cookie's presence — the server still
 * validates the session on every request.
 */
export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/watchlist",
    "/watchlist/:path*",
    "/portfolio",
    "/portfolio/:path*",
  ],
};
