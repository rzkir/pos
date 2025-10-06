import { NextRequest, NextResponse } from "next/server";

const publicRoutes = new Set<string>([
  "/signin",
  "/signup",
  "/forgot-password",
]);

const DEFAULT_AUTHENTICATED_REDIRECT = "/dashboard";

const DEFAULT_UNAUTHENTICATED_REDIRECT = "/signin";

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/public") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".gif") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".txt") ||
    pathname.endsWith(".webp") ||
    pathname.endsWith(".json")
  );
}

function hasSupabaseSession(req: NextRequest): boolean {
  // Supabase SSR typically sets these cookies when authenticated
  const access = req.cookies.get("sb-access-token")?.value;
  const refresh = req.cookies.get("sb-refresh-token")?.value;
  // Fallback to custom app-auth cookie set on sign-in
  const appAuth = req.cookies.get("app-auth")?.value;
  return Boolean((access && refresh) || appAuth === "1");
}

function getAppRole(
  req: NextRequest
): "super-admins" | "admins" | "karyawan" | null {
  const role = req.cookies.get("app-role")?.value;
  if (role === "super-admins" || role === "admins" || role === "karyawan")
    return role;
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  const isPublic = publicRoutes.has(pathname);
  const isAuthed = hasSupabaseSession(req);

  // If not authed and trying to access a protected route
  if (!isAuthed && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = DEFAULT_UNAUTHENTICATED_REDIRECT;
    // Preserve the original destination for post-login redirect
    url.search = `?next=${encodeURIComponent(pathname + (search || ""))}`;
    return NextResponse.redirect(url);
  }

  // If authed and visiting public auth pages, send to generic app home
  if (isAuthed && (pathname === "/signin" || pathname === "/signup")) {
    const url = req.nextUrl.clone();
    url.pathname = DEFAULT_AUTHENTICATED_REDIRECT;
    return NextResponse.redirect(url);
  }

  // Enforce role-based access for dashboard subpaths
  if (isAuthed && pathname.startsWith("/dashboard/")) {
    const role = getAppRole(req);
    // Only gate if we know the role
    if (role) {
      const isAdminsPath = pathname.startsWith("/dashboard/admins");
      const isKaryawanPath = pathname.startsWith("/dashboard/karyawan");
      const isSuperAdminsPath = pathname.startsWith("/dashboard/super-admins");

      const roleToPath: Record<typeof role, string> = {
        admins: "/dashboard/admins",
        karyawan: "/dashboard/karyawan",
        "super-admins": "/dashboard/super-admins",
      } as const;

      const expectedPath = roleToPath[role];

      const pathMatchesRole =
        (role === "admins" && isAdminsPath) ||
        (role === "karyawan" && isKaryawanPath) ||
        (role === "super-admins" && isSuperAdminsPath);

      if (!pathMatchesRole) {
        const url = req.nextUrl.clone();
        url.pathname = expectedPath;
        url.search = ""; // avoid loops with ?next
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

// Exclude Next.js internals, assets, and direct file requests
export const config = {
  matcher: ["/((?!_next/|api/|.*\\..*$).*)"],
};
