let pyodideInstance: any = null;
let pyodideLoadPromise: Promise<any> | null = null;

export async function getPyodide(): Promise<any> {
  if (pyodideInstance) return pyodideInstance;
  if (!pyodideLoadPromise) {
    pyodideLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
      script.onload = async () => {
        try {
          const pyodide = await (window as any).loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
          });
          await pyodide.loadPackage('micropip');
          pyodideInstance = pyodide;
          resolve(pyodide);
        } catch (err) {
          reject(err);
        }
      };
      script.onerror = () => reject(new Error('Failed to load Python runtime from CDN. Check your internet connection.'));
      document.head.appendChild(script);
    });
  }
  return pyodideLoadPromise;
}

export async function executePythonClient(code: string): Promise<{ stdout: string, stderr: string, error?: string }> {
  try {
    const pyodide = await getPyodide();
    
    // Reset output streams
    pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
    `);

    let finalCode = code;
    // Auto-inject standard test inputs if the student uses input()
    if (finalCode.includes('input(')) {
        const injectCode = `import sys\nfrom io import StringIO\nsys.stdin = StringIO('5\\n10\\n15\\n20\\nTrue\\nFalse\\nyes\\nno\\n')\n`;
        finalCode = injectCode + finalCode;
    }

    // Attempt to auto-install any imported packages via micropip, or standard packages
    await pyodide.loadPackagesFromImports(finalCode, { messageCallback: () => {}, errorCallback: () => {} });
    
    // Execute
    await pyodide.runPythonAsync(finalCode);

    const stdout = pyodide.runPython("sys.stdout.getvalue()");
    const stderr = pyodide.runPython("sys.stderr.getvalue()");

    return { stdout, stderr };
  } catch (err: any) {
    // Build a meaningful error message from whatever we caught
    let errorMessage: string;
    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === 'string') {
      errorMessage = err;
    } else {
      try { errorMessage = JSON.stringify(err); } catch { errorMessage = String(err); }
    }

    // Extract the last line of Python traceback for cleaner output
    const lines = errorMessage.split('\n');
    const lastLine = lines[lines.length - 1]?.trim() || errorMessage;
    
    // If it's a Python error, show just the relevant part
    if (errorMessage.includes('Traceback') || errorMessage.includes('Error')) {
      // Keep the full traceback but make it readable
      errorMessage = lines.filter((l: string) => l.trim()).join('\n');
    }

    if (errorMessage.includes('EOFError')) {
       errorMessage += '\n\nHint: This challenge uses function parameters instead of input().';
    }

    // CDN / network errors
    if (errorMessage.includes('Failed to load') || errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('CDN')) {
      errorMessage = 'Python runtime failed to load. Check your internet connection and try again.';
    }

    return { stdout: '', stderr: errorMessage, error: errorMessage };
  }
}

export interface PyodideTestResult {
  description: string;
  passed: boolean;
  expected: string;
  actual: string;
}

export async function executePythonTestSuite(
  code: string,
  testCases: Array<{ input?: string; expectedOutput: string; description?: string }>
): Promise<{ results: PyodideTestResult[]; passedTests: number; totalTests: number }> {
  const results: PyodideTestResult[] = [];
  const pyodide = await getPyodide();

  for (const test of testCases) {
    try {
      // Reset streams for each test
      pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
      `);

      let finalCode = code;
      // Inject stdin if the test provides input
      if (test.input) {
        finalCode = `import sys\nfrom io import StringIO\nsys.stdin = StringIO('${test.input.replace(/'/g, "\\'")}\\n')\n` + finalCode;
      }

      await pyodide.loadPackagesFromImports(finalCode, { messageCallback: () => {}, errorCallback: () => {} });
      await pyodide.runPythonAsync(finalCode);

      const stdout = (pyodide.runPython("sys.stdout.getvalue()") as string).trim();
      const expected = test.expectedOutput.trim();
      const passed = stdout === expected;

      results.push({
        description: test.description || `Test`,
        passed,
        expected,
        actual: stdout
      });
    } catch (err: any) {
      let errorMsg: string;
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (typeof err === 'string') {
        errorMsg = err;
      } else {
        try { errorMsg = JSON.stringify(err); } catch { errorMsg = String(err); }
      }
      // Get last meaningful line from traceback
      const lastLine = errorMsg.split('\n').filter((l: string) => l.trim()).pop() || errorMsg;
      results.push({
        description: test.description || `Test`,
        passed: false,
        expected: test.expectedOutput.trim(),
        actual: `Error: ${lastLine}`
      });
    }
  }

  const passedTests = results.filter(r => r.passed).length;
  return { results, passedTests, totalTests: testCases.length };
}
