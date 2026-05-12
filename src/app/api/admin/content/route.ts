export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { ContentService } from '@/lib/services/content-service';

/**
 * Admin Content API — Upload, list, delete institution content
 */
export async function POST(req: NextRequest) {
    try {
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

