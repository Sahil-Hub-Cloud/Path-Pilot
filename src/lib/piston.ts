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

export async function executeCode(language: string, source: string, idToken?: string): Promise<PistonResponse> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (idToken) headers['Authorization'] = `Bearer ${idToken}`;

    const response = await fetch('/api/execute', {
      method: 'POST',
      headers,
      body: JSON.stringify({ language, code: source })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `Server responded with ${response.status}`);
    }

    const result = await response.json();
    
    const stdout = result.stdout || '';
    const stderr = result.stderr || result.compile_output || '';
    const output = [stdout, stderr].filter(Boolean).join('\n');

    // Judge0 status 3 = Accepted. Also treat as success if exit_code is 0 or stdout exists with no stderr.
    const statusId = typeof result.status === 'object' ? result.status?.id : null;
    const statusDesc = typeof result.status === 'object' ? result.status?.description : String(result.status || '');
    const isSuccess = statusId === 3
      || result.exit_code === 0
      || (stdout.length > 0 && !stderr);

    return {
      language,
      version: 'judge0',
      run: {
        stdout,
        stderr,
        code: isSuccess ? 0 : 1,
        signal: statusDesc || 'Unknown',
        output
      }
    };
  } catch (err: any) {
    console.error('executeCode failed:', err);
    throw new Error(err.message || 'Connection to execution engine failed.');
  }
}

export async function executeTestSuite(language: string, source: string, testCases: string[], idToken?: string): Promise<PistonResponse[]> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (idToken) headers['Authorization'] = `Bearer ${idToken}`;

    const response = await fetch('/api/execute', {
      method: 'POST',
      headers,
      body: JSON.stringify({ language, code: source, testSuite: testCases })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `Server responded with ${response.status}`);
    }

    const data = await response.json();
    if (!data.results) throw new Error("No test results returned.");

    return data.results.map((result: any) => {
      const stdout = result.stdout || '';
      const stderr = result.stderr || result.compile_output || '';
      const output = [stdout, stderr].filter(Boolean).join('\n');
      const statusId = typeof result.status === 'object' ? result.status?.id : null;
      const statusDesc = typeof result.status === 'object' ? result.status?.description : String(result.status || '');
      const isSuccess = statusId === 3
        || result.exit_code === 0
        || (stdout.length > 0 && !stderr);
      return {
        language,
        version: 'judge0',
        run: {
          stdout,
          stderr,
          code: isSuccess ? 0 : 1,
          signal: statusDesc || 'Unknown',
          output
        }
      };
    });
  } catch (err: any) {
    console.error('executeTestSuite failed:', err);
    throw new Error(err.message || 'Connection to execution engine failed.');
  }
}
