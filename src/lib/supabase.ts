import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing environment variables. Supabase features disabled.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ⚠️ IMPORTANT: Ensure ALL Supabase tables have Row Level Security (RLS) enabled
// and appropriate policies defined in the Supabase dashboard.
// Without RLS, the anon key provides full read/write access to all tables.
// https://supabase.com/docs/guides/auth/row-level-security
