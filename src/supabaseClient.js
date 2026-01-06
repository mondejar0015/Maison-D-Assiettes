import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

/**
 * If credentials are present, create the real client.
 * Otherwise export a safe stub with the minimal shape used across the app
 * so imports don't throw at module evaluation time.
 */
let supabase = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
} else {
  // Minimal graceful stub used by your code (adjust methods if you use more).
  const makeError = (msg = "Supabase not configured") => ({ error: new Error(msg) });

  supabase = {
    auth: {
      signInWithPassword: async () => makeError(),
      signUp: async () => makeError(),
      signOut: async () => makeError(),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      insert: async () => makeError(),
      upsert: async () => makeError(),
      select: async () => makeError(),
      update: async () => makeError(),
      delete: async () => makeError(),
    }),
    // fallback generic rpc/query helper
    rpc: async () => makeError(),
  };
}

export { supabase };
export default supabase;