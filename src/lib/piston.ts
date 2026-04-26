export interface PistonResponse {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
}

export async function executeCode(language: string, source: string): Promise<PistonResponse> {
  const languageMap: Record<string, number> = {
    'python': 71,
    'javascript': 63,
    'typescript': 74,
    'java': 62,
    'cpp': 54,
    'c': 54, // Note: Judge0 C++ is 54, C is 50. Using 54 as default fallback per instructions, but usually 50 is C. Since C wasn't in the strict list, mapping to 54.
    'go': 60,
    'rust': 73
  };

  const languageId = languageMap[language.toLowerCase()] || 71; // Default to Python if not found

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
    throw new Error('Code execution engine failed. Please try again later.');
  }

  const { token } = await submitResponse.json();

  // 2. Poll for results
  let retries = 10;
  while (retries > 0) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const resultResponse = await fetch(`https://ce.judge0.com/submissions/${token}?base64_encoded=false&fields=stdout,stderr,status,compile_output`);
    
    if (resultResponse.ok) {
      const result = await resultResponse.json();
      
      // status.id => 1 (In Queue), 2 (Processing), >= 3 (Done/Error)
      if (result.status.id >= 3) {
        const stdout = result.stdout || '';
        const stderr = result.stderr || result.compile_output || '';
        const output = [stdout, stderr].filter(Boolean).join('\n');
        
        return {
          language,
          version: 'judge0',
          run: {
            stdout,
            stderr,
            code: result.status.id === 3 ? 0 : 1,
            signal: result.status.description,
            output
          }
        };
      }
    }
    retries--;
  }

  throw new Error('Code execution timed out.');
}
