import { NextResponse } from "next/server";

import { createAdminServerClient } from "@/lib/supabase";

const ACCOUNTS_TABLE =
  (process.env.NEXT_PUBLIC_TABLE_ACCOUNTS as string) || "accounts";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  console.warn(
    "Supabase URL or Service Role Key is missing. /api/signup will fail."
  );
}

export async function POST(request: Request) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json(
      { error: "Server misconfigured: missing Supabase env" },
      { status: 500 }
    );
  }

  let body: {
    fullName?: string;
    display_name?: string;
    email?: string;
    password?: string;
    role?: "super-admins" | "admins" | "karyawan";
  };
  try {
    body = await request.json();
  } catch (err) {
    console.error("/api/signup JSON parse error:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const fullName = (body?.fullName || body?.display_name || "").trim();
    const email = (body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");
    const role = body?.role as
      | "super-admins"
      | "admins"
      | "karyawan"
      | undefined;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const admin = createAdminServerClient();

    // Create the user (email confirmation disabled by using admin API)
    const { data: created, error: createError } =
      await admin.auth.admin.createUser({
        email,
        password,
        user_metadata: { full_name: fullName },
        email_confirm: true,
      });
    if (createError || !created?.user) {
      console.error("/api/signup createUser error:", createError);
      return NextResponse.json(
        { error: createError?.message || "Failed to create user" },
        { status: 400 }
      );
    }

    const userId = created.user.id;

    // Insert profile row bypassing RLS with service role
    const { error: insertError } = await admin.from(ACCOUNTS_TABLE).insert({
      uid: userId,
      display_name: fullName,
      email,
      ...(role ? { role } : {}),
    });

    if (insertError) {
      console.error("/api/signup insert profile error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("/api/signup unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
