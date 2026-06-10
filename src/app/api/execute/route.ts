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
    const { language, source, testCases } = await req.json();

    if (!language || !source) {
      return NextResponse.json({ error: 'Language and source code are required.' }, { status: 400 });
    }

    const languageId = languageMap[language.toLowerCase()] || 71;

    let finalSource = source;
    // Legacy support for Python input() injection if no testCases provided
    if (language.toLowerCase() === 'python' && source.includes('input(') && !testCases) {
      finalSource = `import sys\nfrom io import StringIO\nsys.stdin = StringIO('5\\n10\\n15\\n20\\nTrue\\nFalse\\nyes\\nno\\n')\n` + source;
    }

    const runJudge0 = async (stdin: string) => {
      const submitResponse = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=false', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language_id: languageId,
          source_code: finalSource,
          stdin: stdin || ''
        })
      });

      if (!submitResponse.ok) {
        throw new Error(await submitResponse.text());
      }

      const { token } = await submitResponse.json();

      let retries = 15;
      while (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const resultResponse = await fetch(`https://ce.judge0.com/submissions/${token}?base64_encoded=false&fields=stdout,stderr,status,compile_output`);
        
        if (resultResponse.ok) {
          const result = await resultResponse.json();
          if (result.status.id >= 3) {
            return result;
          }
        } else {
            throw new Error(await resultResponse.text());
        }
        retries--;
      }
      throw new Error('Code execution timed out.');
    };

    if (testCases && Array.isArray(testCases) && testCases.length > 0) {
      const results = [];
      for (const input of testCases) {
        const res = await runJudge0(input);
        results.push(res);
      }
      return NextResponse.json({ results });
    } else {
      const res = await runJudge0('');
      return NextResponse.json(res);
    }

  } catch (error: any) {
    console.error('API Execute Error:', error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}

