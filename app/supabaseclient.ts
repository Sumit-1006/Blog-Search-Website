// app/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY as string;

function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Supabase URL and Anon Key must be defined in environment variables.");
    throw new Error("Supabase environment variables are not set.");
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  return supabase;
}

export { getSupabase };
