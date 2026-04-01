import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const setSecurityHeaders = (response: NextResponse, request: NextRequest) => {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (request.nextUrl.protocol === "https:") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
};

export const middleware = async (request: NextRequest) => {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth") || pathname.startsWith("/signin")) {
    const response = NextResponse.next();
    setSecurityHeaders(response, request);
    return response;
  }

  if (!token) {
    if (pathname.startsWith("/api/")) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      setSecurityHeaders(response, request);
      return response;
    }

    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(signInUrl);
    setSecurityHeaders(response, request);
    return response;
  }

  const response = NextResponse.next();
  setSecurityHeaders(response, request);
  return response;
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};