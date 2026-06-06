export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { auth as adminAuth, db as adminDb } from '@/lib/firebase-admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function generateUniqueCode(collegeName: string) {
  // Take first 3 letters of collegeName, capitalized, fallback to 'COL'
  const prefix = collegeName
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 3)
    .toUpperCase()
    .padEnd(3, 'X');

  let code = '';
  let exists = true;
  let attempts = 0;

  while (exists && attempts < 100) {
    attempts++;
    const digits = Math.floor(100 + Math.random() * 900).toString(); // 3 random digits
    code = `${prefix}${digits}`;

    // Check if it exists in Supabase colleges table
    const { data, error } = await supabase
      .from('colleges')
      .select('college_code')
      .eq('college_code', code)
      .maybeSingle();

    if (!data && !error) {
      exists = false;
    }
  }

  return code;
}

export async function POST(req: NextRequest) {
  try {
    const { collegeName, location, contactEmail, studentCount, password } = await req.json();

    if (!collegeName || !location || !contactEmail || !studentCount || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // 1. Generate unique 6-digit code
    const collegeCode = await generateUniqueCode(collegeName);
    console.log(`Generated college code for ${collegeName}: ${collegeCode}`);

    // 2. Save to Supabase 'colleges' table
    const { data: collegeData, error: dbError } = await supabase
      .from('colleges')
      .insert({
        college_name: collegeName,
        location,
        contact_email: contactEmail,
        student_count: parseInt(studentCount, 10),
        college_code: collegeCode
      })
      .select()
      .single();

    if (dbError) {
      console.error('Supabase save error:', dbError);
      return NextResponse.json({ error: 'Failed to save college to database: ' + dbError.message }, { status: 500 });
    }

    // 3. Create Firebase user for the college admin
    let userRecord;
    try {
      userRecord = await adminAuth.createUser({
        email: contactEmail,
        password: password,
        displayName: collegeName,
      });
      console.log('Firebase user created for college admin:', userRecord.uid);
    } catch (authError: any) {
      console.error('Firebase Auth creation error:', authError);
      // Clean up Supabase record on failure to keep consistency
      await supabase.from('colleges').delete().eq('college_code', collegeCode);
      return NextResponse.json({ error: 'Auth failed: ' + (authError.message || 'Email might be in use') }, { status: 400 });
    }

    // 4. Save/Update user profile in Firestore
    try {
      await adminDb.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: contactEmail,
        displayName: collegeName,
        role: 'college',
        collegeCode: collegeCode,
        collegeName: collegeName,
        createdAt: new Date().toISOString()
      });
      console.log('Firestore user profile created for college admin.');
    } catch (fsError: any) {
      console.error('Firestore save error:', fsError);
      // We don't delete auth user here to allow manual recovery, but log it
    }

    // 5. Email the code using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Path Pilot <onboarding@resend.dev>',
          to: [contactEmail],
          subject: 'Your Path Pilot College Admin Code',
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #2C1A0E; background-color: #FDF6EC; border-radius: 12px; border: 1.5px solid rgba(180,140,90,0.35);">
              <h2 style="color: #006B7A;">Welcome to Path Pilot, ${collegeName}!</h2>
              <p>Your institution has been successfully registered.</p>
              <p>Here is your unique 6-digit College Code for student onboarding:</p>
              <div style="font-size: 32px; font-weight: 800; color: #006B7A; letter-spacing: 4px; margin: 20px 0; padding: 10px 20px; background-color: #EDE4D3; display: inline-block; border-radius: 8px;">
                ${collegeCode}
              </div>
              <p>Share this code with your students. They will use it to link their profiles to your institution during onboarding or profile editing.</p>
              <p>You can sign in to your College Dashboard at: <a href="https://path-pilot-11255.vercel.app/auth" style="color: #006B7A; font-weight: 700; text-decoration: none;">path-pilot-11255.vercel.app/auth</a> using your email and password.</p>
              <hr style="border: none; border-top: 1px solid rgba(180,140,90,0.3); margin: 20px 0;" />
              <p style="font-size: 12px; color: #8B6E52;">The Path Pilot Team</p>
            </div>
          `
        });
        console.log(`Email successfully sent to ${contactEmail}`);
      } catch (mailError) {
        console.error('Failed to send email:', mailError);
      }
    } else {
      console.warn('RESEND_API_KEY not found, email sending skipped.');
    }

    return NextResponse.json({
      success: true,
      collegeCode,
      collegeId: collegeData.id,
      userId: userRecord.uid
    });

  } catch (error: any) {
    console.error('Registration crash:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
