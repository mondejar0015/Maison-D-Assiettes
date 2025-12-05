import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://biznyupyoignyytewdmt.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpem55dXB5b2lnbnl5dGV3ZG10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODk4MjEsImV4cCI6MjA4MDE2NTgyMX0.cpVzL5aSQ6CSANar-2AkBgvgGN4VPTeJ7RSo5juTTqc";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ Supabase env vars missing. Check .env file contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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