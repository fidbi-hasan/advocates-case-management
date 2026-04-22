import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing. Please add them to .env.local");
  }

  _supabase = createClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
}

/**
 * Lazily-initialised Supabase client.
 * Using a getter avoids calling `createClient("")` at module-evaluation
 * time, which throws when env vars are absent (e.g. during `next build`
 * on Vercel before env vars are injected).
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabase(), prop, receiver);
  },
});
