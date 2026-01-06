import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (!SUPABASE_CONFIGURED) {
  // Do NOT hardcode keys here. Warn so dev can see the issue.
  // Important: if you previously committed keys, rotate the anon key in Supabase immediately.
  console.warn('Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
}

let supabase = null;

if (SUPABASE_CONFIGURED) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
} else {
  // Minimal graceful stub so imports won't throw in browser
  const makeError = (msg = 'Supabase not configured') => ({ error: new Error(msg) });
  const authStub = {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => makeError(),
    signUp: async () => makeError(),
    signOut: async () => makeError(),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  };
  const fromStub = () => ({
    select: async () => makeError(),
    insert: async () => makeError(),
    upsert: async () => makeError(),
    update: async () => makeError(),
    delete: async () => makeError(),
  });

  supabase = {
    auth: authStub,
    from: fromStub,
    rpc: async () => makeError(),
  };
}

export { supabase };
export default supabase;