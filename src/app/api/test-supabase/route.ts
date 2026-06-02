import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * GET /api/test-supabase
 *
 * Quick health-check that verifies the Supabase client can reach the
 * remote project. It does NOT require any specific table to exist —
 * it simply runs a lightweight system-level query.
 */
export async function GET() {
  try {
    // A minimal query: fetch 1 row from any table via the REST API.
    // `from('_test_connection')` will return an empty set (table likely
    // doesn't exist), but the *absence* of a network / auth error proves
    // the client is properly configured.
    const { error } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1);

    // Supabase returns a PostgrestError when the table doesn't exist,
    // but the HTTP call itself succeeded — that's enough to confirm
    // connectivity + valid credentials. We treat "relation does not exist"
    // as a successful connection test.
    const tableNotFound =
      error?.message?.includes('does not exist') ||
      error?.message?.includes('Could not find the table');

    if (error && !tableNotFound) {
      return NextResponse.json(
        { status: 'error', message: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ status: 'Supabase Connected' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { status: 'error', message },
      { status: 500 },
    );
  }
}
