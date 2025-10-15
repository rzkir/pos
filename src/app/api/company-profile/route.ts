import { NextResponse } from "next/server";

import {
  createAnonServerClient,
  createAdminServerClient,
} from "@/lib/supabase";

type Role = "super-admins" | "admins" | "manager" | "karyawan";
type OwnerInfo = {
  uid: string;
  display_name: string;
  email: string;
  role: string;
};

function getRoleFromCookies(req: Request): Role | null {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader
        .split(/;\s*/)
        .filter(Boolean)
        .map((c) => {
          const idx = c.indexOf("=");
          const k = idx >= 0 ? c.slice(0, idx).trim() : c.trim();
          const v = idx >= 0 ? decodeURIComponent(c.slice(idx + 1)) : "";
          return [k, v];
        })
    );
    const role = cookies["app-role"] as Role | undefined;
    if (
      role === "super-admins" ||
      role === "admins" ||
      role === "manager" ||
      role === "karyawan"
    )
      return role;
    return null;
  } catch {
    return null;
  }
}

// GET: fetch single company profile (first row)
export async function GET() {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase
    .from("company_profile")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ data: null });

  // Enrich with owner account info if linked
  let owner: OwnerInfo | null = null;
  if (data.owner_uid) {
    const { data: ownerRow } = await supabase
      .from("accounts")
      .select("uid, display_name, email, role")
      .eq("uid", data.owner_uid as string)
      .maybeSingle();
    if (ownerRow) owner = ownerRow as OwnerInfo;
  }
  return NextResponse.json({ data: { ...data, owner } });
}

// UPSERT via POST: only admins and super-admins
export async function POST(request: Request) {
  const role = getRoleFromCookies(request);
  if (!(role === "admins" || role === "super-admins")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const allowedKeys = new Set([
    "company_name",
    "logo_url",
    "npwp",
    "address",
    "phone",
    "email",
    "website",
    "business_type",
    "owner_name",
    "owner_uid",
    "founded_at",
  ]);
  const payload: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    if (allowedKeys.has(k)) payload[k] = v;
  }

  const admin = createAdminServerClient();

  // Ensure there is only one row: upsert into id=1 or insert if none exists
  const { data: existing } = await admin
    .from("company_profile")
    .select("id")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await admin
      .from("company_profile")
      .update({ ...payload })
      .eq("id", existing.id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, id: existing.id });
  }

  const { data: inserted, error } = await admin
    .from("company_profile")
    .insert({ ...payload })
    .select("id")
    .maybeSingle();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, id: inserted?.id });
}

// PATCH: alias to POST for partial update
export async function PATCH(request: Request) {
  return POST(request);
}

// PUT: alias to POST for idempotent upsert
export async function PUT(request: Request) {
  return POST(request);
}
