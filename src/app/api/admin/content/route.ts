// TOP OF FILE - NO IMPORTS THAT INITIALIZE FIREBASE
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

// Lazy initialization - only runs when request comes in
let db: any = null;

async function getDb() {
  if (db) return db;
  
  const admin = await import('firebase-admin');
  
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      }),
    });
  }
  
  db = admin.firestore();
  return db;
}

/**
 * Admin Content API — Upload, list, delete institution content
 */
export async function POST(req: NextRequest) {
    try {
        const database = await getDb();
        const { requireRole } = await import('@/lib/rbac');
        const { ContentService } = await import('@/lib/services/content-service');
        const body = await req.json();
        const { userId, institutionId, title, description, contentType, fileUrl, fileSizeBytes } = body;

        // RBAC check
        const { authorized } = await requireRole(userId, 'faculty', 'hod', 'admin');
        if (!authorized) {
            return NextResponse.json({ error: 'Unauthorized. Faculty or above required.' }, { status: 403 });
        }

        if (!institutionId || !title || !contentType) {
            return NextResponse.json({ error: 'Missing required fields: institutionId, title, contentType' }, { status: 400 });
        }

        const content = await ContentService.createContent({
            institution_id: institutionId,
            title,
            description: description || '',
            content_type: contentType,
            file_url: fileUrl || null,
            file_size_bytes: fileSizeBytes || null,
            uploaded_by: userId,
        });

        if (!content) {
            return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
        }

        return NextResponse.json({ success: true, content });
    } catch (error: any) {
        console.error('Admin Content API Error:', error);
        return NextResponse.json({ error: error.message || 'Content operation failed' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const database = await getDb();
        const { requireRole } = await import('@/lib/rbac');
        const { ContentService } = await import('@/lib/services/content-service');
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const institutionId = searchParams.get('institutionId');
        const cohortId = searchParams.get('cohortId') || undefined;

        // RBAC check
        const { authorized } = await requireRole(userId, 'faculty', 'hod', 'admin');
        if (!authorized) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        if (!institutionId) {
            return NextResponse.json({ error: 'institutionId required' }, { status: 400 });
        }

        const content = await ContentService.listContent(institutionId, cohortId);
        return NextResponse.json({ success: true, content });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const database = await getDb();
        const { requireRole } = await import('@/lib/rbac');
        const { ContentService } = await import('@/lib/services/content-service');
        const { userId, contentId } = await req.json();

        const { authorized } = await requireRole(userId, 'faculty', 'hod', 'admin');
        if (!authorized) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const deleted = await ContentService.deleteContent(contentId);
        return NextResponse.json({ success: deleted });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

