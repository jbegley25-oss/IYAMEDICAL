import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limit state (per-process, resets on restart — adequate for single-instance)
const rateMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  "/api/intake/submit": { max: 5, windowMs: 60_000 },
  "/api/intake/chat": { max: 30, windowMs: 60_000 },
  "/api/intake/extract": { max: 10, windowMs: 60_000 },
  "/api/copilot": { max: 20, windowMs: 60_000 },
  "/api/contact": { max: 5, windowMs: 60_000 },
  "/api/analytics": { max: 30, windowMs: 60_000 },
};

function getRateLimit(pathname: string): { max: number; windowMs: number } | null {
  for (const [prefix, limit] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(prefix)) return limit;
  }
  return null;
}

function checkRateLimit(ip: string, pathname: string): boolean {
  const limit = getRateLimit(pathname);
  if (!limit) return true;

  const key = `${ip}:${pathname}`;
  const now = Date.now();
  const entry = rateMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + limit.windowMs });
    return true;
  }

  entry.count++;
  return entry.count <= limit.max;
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // ── Block sensitive paths ───────────────────────────────────────
  if (
    pathname.startsWith("/.env") ||
    pathname.startsWith("/.git") ||
    pathname.startsWith("/.next") ||
    pathname.includes("..") ||
    pathname.endsWith(".sql") ||
    pathname.endsWith(".log")
  ) {
    return new NextResponse(null, { status: 404 });
  }

  // ── Rate limiting on API routes ──────────────────────────────���──
  if (pathname.startsWith("/api/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip, pathname)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  // ── Security headers (defense in depth alongside next.config) ──
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Download-Options", "noopen");

  // Periodic cleanup of stale rate-limit entries
  if (Math.random() < 0.01) {
    const now = Date.now();
    for (const [key, entry] of rateMap) {
      if (now > entry.resetAt) rateMap.delete(key);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and _next internals
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
