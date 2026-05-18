import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request });
  const isPublicAdminAuthPage = pathname === "/admin/login" || pathname === "/admin/forgot-password";

  // Public auth pages should be accessible without a session.
  if (isPublicAdminAuthPage) {
    if (token && (token.role === "admin" || token.role === "editor")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Check if user is trying to access /admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Optional: Check for specific role
    if (token.role !== "admin" && token.role !== "editor") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

