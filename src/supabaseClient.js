import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Warn early — prevents silent failures
  console.warn(
    "Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(SUPABASE_URL ?? "", SUPABASE_ANON_KEY ?? "", {
  auth: {
    // disable automatic token refresh / session persistence in dev until URL validated
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  // use default fetch but surface network errors for easier debugging
  global: {
    fetch: (...args) =>
      globalThis.fetch(...args).catch((err) => {
        console.error("Network fetch failed (supabase):", err);
        throw err;
      }),
  },
});

export async function testConnection() {
  try {
    const { data, error } = await supabase.from("profiles").select("id").limit(1);
    if (error) {
      console.error("❌ DB check failed:", error.message);
      return false;
    }
    console.log("✅ DB connected, profiles table accessible");
    return true;
  } catch (err) {
    console.error("❌ Connection test failed:", err);
    return false;
  }
}