import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./lib/auth/auth" 


// Role-based protected path rules
const protectedRoutes: Record<string, string[]> = {
  "/admin": ["admin"],
  "/student": ["student"],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route needs protection
  const protectedRoute = Object.entries(protectedRoutes).find(([route]) =>
    pathname.startsWith(route)
  );

  if (!protectedRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const [, allowedRoles] = protectedRoute;
  if (!allowedRoles.includes(payload.role)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", payload.userId);
  requestHeaders.set("x-user-role", payload.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*"],
};
