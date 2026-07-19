import { NextRequest, NextResponse } from 'next/server';
import { hub } from '@/lib/services';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const validServices = ['vernacular'];

// Next.js 15: params is a Promise
export async function POST(
    req: NextRequest,
    context: { params: Promise<{ service: string }> }
) {
    // 1. Await params
    const { service } = await context.params;

    // 2. Validate Service Name
    if (!validServices.includes(service as any)) {
        return NextResponse.json({ error: `Unknown service: ${service}` }, { status: 404 });
    }

    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    try {
        switch (service) {
            case 'vernacular':
                if (body.action === 'detect') {
                    const detection = await hub.vernacularAI.detectLanguage(body.text);
                    return NextResponse.json({ success: true, detection });
                }
                const response = await hub.vernacularAI.generateResponse(body.prompt, body.language);
                return NextResponse.json({ success: true, response });

            default:
                return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
