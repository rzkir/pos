import { NextResponse } from "next/server";

import { createAnonServerClient } from "@/lib/supabase";

const ACCOUNTS_TABLE = process.env.NEXT_PUBLIC_TABLE_ACCOUNTS as string;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }

    const supabase = createAnonServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error)
      return NextResponse.json({ error: error.message }, { status: 401 });

    const userId = data.user?.id;
    if (userId) {
      const { data: existing } = await supabase
        .from(ACCOUNTS_TABLE)
        .select("uid")
        .eq("uid", userId)
        .maybeSingle();
      if (!existing?.uid) {
        const displayName =
          data.user?.user_metadata?.full_name || email.split("@")[0];
        await supabase
          .from(ACCOUNTS_TABLE)
          .insert({ uid: userId, display_name: displayName, email });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
