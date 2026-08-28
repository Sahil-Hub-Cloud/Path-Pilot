export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth, requireAuthResponse } from '@/lib/server-auth';
import { checkRateLimit } from '@/lib/rate-limit';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: NextRequest) {
  const auth = await verifyRequestAuth(req);
  if (!auth) return requireAuthResponse();
  const { success } = await checkRateLimit(`interview:${auth.uid}`);
  if (!success) return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
  if (!GROQ_API_KEY) return NextResponse.json({ error: 'AI offline' }, { status: 500 });

  const { topic, level = 'beginner', history = [] } = await req.json();
  if (!topic) return NextResponse.json({ error: 'topic required' }, { status: 400 });

  const system = `You are a mock interviewer from a top Indian product company. Level: ${level}. Ask ONE question at a time about ${topic}. Probe depth, then give 1-sentence feedback. Keep under 120 words.`;

  const messages = [{ role: 'system', content: system }, ...history.slice(-8), { role: 'user', content: `Start interview on ${topic}` }];

  const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
  for (const model of models) {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 400 }),
    });
    if (r.ok) {
      const j = await r.json();
      return NextResponse.json({ text: j.choices?.[0]?.message?.content || '' });
    }
  }
  return NextResponse.json({ error: 'Interview unavailable' }, { status: 502 });
}
