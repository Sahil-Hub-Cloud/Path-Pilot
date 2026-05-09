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
  try {
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, source })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `Server responded with ${response.status}`);
    }

    const result = await response.json();
    
    // Judge0 result processing
    const stdout = result.stdout || '';
    const stderr = result.stderr || result.compile_output || '';
    const output = [stdout, stderr].filter(Boolean).join('\n');
    
    return {
      language,
      version: 'judge0',
      run: {
        stdout,
        stderr,
        code: result.status?.id === 3 ? 0 : 1,
        signal: result.status?.description || 'Unknown',
        output
      }
    };
  } catch (err: any) {
    console.error('executeCode failed:', err);
    throw new Error(err.message || 'Connection to execution engine failed.');
  }
}
