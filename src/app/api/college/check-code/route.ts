export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Code parameter is required' }, { status: 400 });
    }

    console.log(`API check-code: Querying Supabase for collegeCode = ${code}`);
    
    const { data, error } = await supabase
      .from('colleges')
      .select('id, college_name, college_code')
      .eq('college_code', code)
      .maybeSingle();

    if (error) {
      console.error('Supabase error checking college code:', error);
      throw error;
    }

    if (!data) {
      return NextResponse.json({ available: true, exists: false });
    } else {
      return NextResponse.json({
        available: false,
        exists: true,
        collegeId: data.id,
        collegeName: data.college_name
      });
    }
  } catch (error: any) {
    console.error('Error checking college code availability:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
