// proxy.ts
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // En développement → on garde /slug/... visible
  if (
    process.env.NODE_ENV === "development" ||
    hostname.includes("localhost")
  ) {
    return NextResponse.next();
  }

  // En production → tentative de détection du slug depuis le hostname
  let slug: string | null = null;

  const parts = hostname.split(".");
  if (parts.length >= 3) {
    // sous-domaine → ex: pizza-roma.example.com → slug = pizza-roma
    slug = parts[0];
  } else if (parts.length === 2) {
    // domaine apex → ex: pizza-roma.bj
    // Pour l'instant on prend le premier mot, mais idéalement → table de mapping
    slug = parts[0];
  }

  // Si on a un slug ET que l'URL ne commence pas déjà par /slug
  if (
    slug &&
    !pathname.startsWith(`/${slug}`) &&
    pathname !== "/_next" &&
    !pathname.startsWith("/api")
  ) {
    const newPath = `/${slug}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(new URL(newPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
