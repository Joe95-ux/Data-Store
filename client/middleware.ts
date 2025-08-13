// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public pages that don't need auth
  const publicPaths = ["/login", "/register", "/onboarding"];
  const isPublicPath = publicPaths.includes(pathname);

  // Skip static files, Next.js internals, and APIs (API routes have their own auth checks)
  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/trpc")
  ) {
    return NextResponse.next();
  }

  // Get NextAuth token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect unauthenticated users to /login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For logged-in users, check onboarding status
  if (token) {
    const res = await fetch(`${process.env.API_URL}/api/user/${token.sub}`, {
      headers: { Authorization: `Bearer ${process.env.INTERNAL_API_KEY ?? ""}` },
    });

    if (!res.ok) {
      console.error("Failed to fetch user profile in middleware");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const user = await res.json();

    // If onboarding not completed and step is 0, redirect to onboarding unless already there
    if (!user.onboardingCompleted && user.onboardingStep === 0 && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    // Prevent logged-in users from accessing login/register
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|api|trpc).*)"],
};
