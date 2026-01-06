import { createClient } from "@supabase/supabase-js";

// I added your keys directly here so it works even if Vercel env vars are missing
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://biznyupyoignyytewdmt.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpem55dXB5b2lnbnl5dGV3ZG10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODk4MjEsImV4cCI6MjA4MDE2NTgyMX0.cpVzL5aSQ6CSANar-2AkBgvgGN4VPTeJ7RSo5juTTqc';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Missing Supabase env vars.");
}

let supabase = null;

// This will now always run because the keys are hardcoded above
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
} else {
  // Fixed the crash by adding the missing functions, just in case
  const makeError = (msg = "Supabase not configured") => ({ error: new Error(msg), data: null });

  supabase = {
    auth: {
      signInWithPassword: async () => makeError(),
      signUp: async () => makeError(),
      signOut: async () => makeError(),
      getSession: async () => makeError(), // Fixed: Added this to stop the crash
      getUser: async () => makeError(),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      insert: async () => makeError(),
      upsert: async () => makeError(),
      select: async () => makeError(),
      update: async () => makeError(),
      delete: async () => makeError(),
    }),
    rpc: async () => makeError(),
  };
}

export { supabase };
export default supabase;