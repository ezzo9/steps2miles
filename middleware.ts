import { NextRequest, NextResponse } from "next/server";

const CANONICAL_HOST = "steps2miles.org";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

// Forces every request onto https://steps2miles.org (no www, no http, and
// critically, this also catches the old stepstomiles.net domain: any
// hostname that isn't the canonical one 301s here, so as long as
// stepstomiles.net's DNS still points at this same deployment, old links
// and search results carry over instead of breaking). Skipped entirely on
// localhost/127.0.0.1 so local dev keeps working over plain http.
//
// Reads the Host and X-Forwarded-Proto headers directly rather than
// request.nextUrl, since nextUrl.hostname/protocol reflect how the platform
// terminates the connection (e.g. always "localhost"/"http:" in local dev)
// rather than what the client actually requested; the headers are the
// portable source of truth behind any reverse proxy.
export function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("host") ?? "";
  const hostname = hostHeader.split(":")[0];

  if (LOCAL_HOSTS.has(hostname)) {
    return NextResponse.next();
  }

  const forwardedProto = request.headers.get("x-forwarded-proto");
  const isHttps = forwardedProto
    ? forwardedProto === "https"
    : request.nextUrl.protocol === "https:";

  if (hostname !== CANONICAL_HOST || !isHttps) {
    const canonicalUrl = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      `https://${CANONICAL_HOST}`
    );
    return NextResponse.redirect(canonicalUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
