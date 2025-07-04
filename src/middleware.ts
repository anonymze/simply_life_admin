// app/api/_middleware.js
import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = ["https://localhost:3000", "http://localhost:3000"];

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // console.log(req.headers);

  // Set CORS headers
  const origin = req.headers.get("origin");
  // console.log("origin", origin);
  if (origin && allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: res.headers,
    });
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
