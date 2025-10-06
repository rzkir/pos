import { createBrowserClient } from "@supabase/ssr";

import { createClient as createServerClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = () =>
  createBrowserClient(supabaseUrl!, supabaseKey!);

export const createAnonServerClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase env (URL/ANON KEY) not configured");
  }
  return createServerClient(supabaseUrl, supabaseKey);
};

export const createAdminServerClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase service role env not configured");
  }
  return createServerClient(supabaseUrl, serviceRoleKey);
};
