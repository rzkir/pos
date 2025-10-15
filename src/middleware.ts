import { NextRequest, NextResponse } from "next/server";

const publicRoutes = new Set<string>([
  "/", // home: system management overview
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
  // Prefer Supabase SSR cookies when present, fallback to app-auth cookie set on client sign-in
  const access = req.cookies.get("sb-access-token")?.value;
  const refresh = req.cookies.get("sb-refresh-token")?.value;
  const appAuth = req.cookies.get("app-auth")?.value;
  return Boolean((access && refresh) || appAuth === "1");
}

function getAppRole(
  req: NextRequest
): "super-admins" | "admins" | "manager" | "karyawan" | null {
  const role = req.cookies.get("app-role")?.value;
  if (
    role === "super-admins" ||
    role === "admins" ||
    role === "manager" ||
    role === "karyawan"
  )
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

  // Helper to resolve role-based home
  const role = isAuthed ? getAppRole(req) : null;
  const roleToPath: Record<
    NonNullable<ReturnType<typeof getAppRole>>,
    string
  > = {
    admins: "/dashboard/admins",
    karyawan: "/dashboard/karyawan",
    manager: "/dashboard/manager",
    "super-admins": "/dashboard/super-admins",
  } as const;

  const authenticatedHome = role
    ? roleToPath[role]
    : DEFAULT_AUTHENTICATED_REDIRECT;

  // If authed and on root, honor next param or send to authenticated home
  if (isAuthed && pathname === "/") {
    const url = req.nextUrl.clone();
    const nextParam = url.searchParams.get("next");
    if (nextParam) {
      // Safely split path and query
      const [nextPath, nextQuery = ""] = nextParam.split("?");
      url.pathname = nextPath || authenticatedHome;
      url.search = nextQuery ? `?${nextQuery}` : "";
    } else {
      url.pathname = authenticatedHome;
      url.search = "";
    }
    return NextResponse.redirect(url);
  }

  // If authed and visiting signup, send to role home
  if (isAuthed && pathname === "/signup") {
    const url = req.nextUrl.clone();
    url.pathname = authenticatedHome;
    return NextResponse.redirect(url);
  }

  // If authed and on /signin with ?next=, honor next; otherwise allow /signin
  if (isAuthed && pathname === "/signin") {
    const url = req.nextUrl.clone();
    const nextParam = url.searchParams.get("next");
    if (nextParam) {
      const [nextPath, nextQuery = ""] = nextParam.split("?");
      url.pathname = nextPath || authenticatedHome;
      url.search = nextQuery ? `?${nextQuery}` : "";
      return NextResponse.redirect(url);
    }
  }

  // If authed and visiting generic /dashboard, route to role-specific dashboard
  if (isAuthed && pathname === "/dashboard") {
    const url = req.nextUrl.clone();
    url.pathname = authenticatedHome;
    url.search = "";
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
      const isManagerPath = pathname.startsWith("/dashboard/manager");

      const expectedPath = roleToPath[role];

      const pathMatchesRole =
        (role === "admins" && isAdminsPath) ||
        (role === "karyawan" && isKaryawanPath) ||
        (role === "manager" && isManagerPath) ||
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
