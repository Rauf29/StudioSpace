import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  const protectedRoutes = [
    "/add-studio",
    "/my-bookings",
    "/my-listings",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export { proxy as middleware };

export const config = {
  matcher: [
    "/add-studio/:path*",
    "/my-bookings/:path*",
    "/my-listings/:path*",
  ],
};
