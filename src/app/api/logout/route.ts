import { NextResponse } from "next/server";

import { createAnonServerClient } from "@/lib/supabase";

export async function POST() {
  const supabase = createAnonServerClient();
  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}
