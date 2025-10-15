import { NextResponse } from "next/server";

import { createAnonServerClient } from "@/lib/supabase";

export async function POST() {
  const supabase = createAnonServerClient();
  try {
    await supabase.auth.signOut();
  } catch {}

  const response = NextResponse.json({ success: true });

  // Explicitly clear app cookies used by middleware
  const expired = "Thu, 01 Jan 1970 00:00:00 GMT";
  response.headers.append(
    "Set-Cookie",
    `app-auth=; Path=/; Expires=${expired}; HttpOnly; SameSite=Lax`
  );
  response.headers.append(
    "Set-Cookie",
    `app-role=; Path=/; Expires=${expired}; HttpOnly; SameSite=Lax`
  );

  // Attempt to clear potential Supabase SSR cookies if present
  response.headers.append(
    "Set-Cookie",
    `sb-access-token=; Path=/; Expires=${expired}; HttpOnly; SameSite=Lax`
  );
  response.headers.append(
    "Set-Cookie",
    `sb-refresh-token=; Path=/; Expires=${expired}; HttpOnly; SameSite=Lax`
  );

  return response;
}
