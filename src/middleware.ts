import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "nagarsetu_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(COOKIE)?.value);
  if (hasSession) return NextResponse.next();

  if (pathname.startsWith("/citizen")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/citizen/:path*", "/admin/:path*"],
};
