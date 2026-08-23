import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured');
  }

  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const supabaseClient = getClient();
    const value = Reflect.get(supabaseClient as object, prop, supabaseClient);
    return typeof value === 'function' ? value.bind(supabaseClient) : value;
  },
});

// ⚠️ IMPORTANT: Ensure ALL Supabase tables have Row Level Security (RLS) enabled
// and appropriate policies defined in the Supabase dashboard.
// Without RLS, the anon key provides full read/write access to all tables.
// https://supabase.com/docs/guides/auth/row-level-security
