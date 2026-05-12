export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

const languageMap: Record<string, number> = {
  'python': 71,
  'javascript': 63,
  'typescript': 74,
  'java': 62,
  'cpp': 54,
  'c': 54,
  'go': 60,
  'rust': 73
};

export async function POST(req: NextRequest) {
  try {
    const { language, source } = await req.json();

    if (!language || !source) {
      return NextResponse.json({ error: 'Language and source code are required.' }, { status: 400 });
    }

    const languageId = languageMap[language.toLowerCase()] || 71;

    // 1. Submit code to Judge0
    const submitResponse = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=false', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language_id: languageId,
        source_code: source,
        stdin: ''
      })
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      return NextResponse.json({ error: `Judge0 Submission Failed: ${errorText}` }, { status: 500 });
    }

    const { token } = await submitResponse.json();

    // 2. Poll for results
    let retries = 15; // Increased retries for slower executions
    while (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const resultResponse = await fetch(`https://ce.judge0.com/submissions/${token}?base64_encoded=false&fields=stdout,stderr,status,compile_output`);
      
      if (resultResponse.ok) {
        const result = await resultResponse.json();
        
        // status.id => 1 (In Queue), 2 (Processing), >= 3 (Done/Error)
        if (result.status.id >= 3) {
          return NextResponse.json(result);
        }
      } else {
          const errorText = await resultResponse.text();
          return NextResponse.json({ error: `Judge0 Result Fetch Failed: ${errorText}` }, { status: 500 });
      }
      retries--;
    }

    return NextResponse.json({ error: 'Code execution timed out on Judge0.' }, { status: 504 });

  } catch (error: any) {
    console.error('API Execute Error:', error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}

