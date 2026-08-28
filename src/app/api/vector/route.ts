export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GeminiBrain } from '@/lib/gemini';
import { verifyRequestAuth, requireAuthResponse } from '@/lib/server-auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
    try {
        const auth = await verifyRequestAuth(request); if (!auth) return requireAuthResponse();
        const { success } = await checkRateLimit(`rl_vector:${auth.uid}`);
        if (!success) return NextResponse.json({ message: 'Rate limit exceeded. Try again later.' }, { status: 429 });
        const body = await request.json();
        const { action, text, moduleId, queryText } = body;
        const userId = auth.uid;

        if (action === 'index') {
            if (!text) return NextResponse.json({ message: "text required for indexing." }, { status: 400 });

            // Note: In client-side code, GeminiBrain.embedText might fetch from /api/gemini/embed
            // But we can call the logic directly if we want to avoid double API calls.
            // For simplicity in this sprint, we'll assume the client-side VectorBrain passes the embedding or we fetch it here.

            // Directly getting embedding via the same logic to avoid extra hop if keys are available
            const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
            let embedding;

            if (GEMINI_API_KEY) {
                const embeddingEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`;
                console.log('[/api/vector] Indexing — embedding endpoint:', embeddingEndpoint.split('?')[0]);
                const response = await fetch(embeddingEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: "models/text-embedding-004",
                        content: { parts: [{ text }] }
                    })
                });
                if (!response.ok) {
                    console.error(`[/api/vector] Embedding error: ${response.status} ${response.statusText}`);
                    throw new Error(`Embedding API error: ${response.status}`);
                }
                const data = await response.json();
                embedding = data.embedding.values;
                console.log('[/api/vector] Indexing — embedding generated, dims:', embedding?.length);
            } else {
                embedding = new Array(768).fill(0);
            }

            const { error } = await supabase.from('knowledge_embeddings').insert({
                student_id: userId,
                module_id: moduleId,
                content: text,
                embedding,
                metadata: { source: 'neural-ingestion', timestamp: new Date().toISOString() }
            });

            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        if (action === 'search') {
            if (!queryText) return NextResponse.json({ message: "queryText required for search." }, { status: 400 });

            const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
            let embedding;

            if (GEMINI_API_KEY) {
                const embeddingEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`;
                console.log('[/api/vector] Search — embedding endpoint:', embeddingEndpoint.split('?')[0]);
                const response = await fetch(embeddingEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: "models/text-embedding-004",
                        content: { parts: [{ text: queryText }] }
                    })
                });
                if (!response.ok) {
                    console.error(`[/api/vector] Search embedding error: ${response.status} ${response.statusText}`);
                    throw new Error(`Embedding API error: ${response.status}`);
                }
                const data = await response.json();
                embedding = data.embedding.values;
                console.log('[/api/vector] Search — embedding generated, dims:', embedding?.length);
            } else {
                embedding = new Array(768).fill(0);
            }

            const { data, error } = await supabase.rpc('match_knowledge', {
                query_embedding: embedding,
                match_threshold: 0.3, // Lowered threshold for broader matching in educational context
                match_count: 5,
                p_student_id: userId
            });

            if (error) throw error;
            return NextResponse.json({ results: data });
        }

        return NextResponse.json({ message: "Invalid action." }, { status: 400 });
    } catch (error: any) {
        console.error('Vector API Error:', error);
        return NextResponse.json({ message: "Vector operation failed.", error: error.message }, { status: 500 });
    }
}

