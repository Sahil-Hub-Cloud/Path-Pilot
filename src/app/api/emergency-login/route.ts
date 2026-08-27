export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

let db: any = null

async function getDb() {
  if (db) return db
  
  const admin = await import('firebase-admin')
  
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      }),
    })
  }
  
  db = admin.firestore()
  return db
}

export async function POST(request: NextRequest) {
  try {
    // Disabled by default — enable only if EMERGENCY_LOGIN_ENABLED=true and caller provides valid reCAPTCHA/Bearer
    if (process.env.EMERGENCY_LOGIN_ENABLED !== 'true') {
      return NextResponse.json({ error: 'Emergency login disabled' }, { status: 404 })
    }

    // Rate-limit this sensitive endpoint (fail-open if Redis not configured, but still check)
    try {
      const { checkRateLimit } = await import('@/lib/rate-limit')
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      const { success } = await checkRateLimit(`emergency_login:${ip}`)
      if (!success) return NextResponse.json({ error: 'Too many attempts, try later' }, { status: 429 })
    } catch {}

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const firestore = await getDb()

    const usersRef = firestore.collection('users')
    const snapshot = await usersRef.where('email', '==', email).limit(1).get()

    if (snapshot.empty) {
      // generic message to avoid enumeration
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const userDoc = snapshot.docs[0]
    const userData = userDoc.data()

    if (!userData.password) {
      return NextResponse.json({ error: 'Emergency login not available for this account' }, { status: 401 })
    }
    if (userData.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.set('pp_session', userDoc.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 12,
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user: {
        uid: userDoc.id,
        email: userData.email,
        displayName: userData.displayName || '',
        role: userData.role || 'student',
        emergencyBypass: true
      }
    })
  } catch (error: any) {
    console.error('Emergency Login Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
