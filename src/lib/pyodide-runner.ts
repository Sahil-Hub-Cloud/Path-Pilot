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
      script.onerror = reject;
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
    await pyodide.loadPackagesFromImports(finalCode, { messageCallback: console.log, errorCallback: console.error });
    
    // Execute
    await pyodide.runPythonAsync(finalCode);

    const stdout = pyodide.runPython("sys.stdout.getvalue()");
    const stderr = pyodide.runPython("sys.stderr.getvalue()");

    return { stdout, stderr };
  } catch (err: any) {
    // If there's an EOF error despite our injection, give a helpful hint
    let errorMessage = err.message || 'Unknown error';
    if (errorMessage.includes('EOFError')) {
       errorMessage += '\n\n💡 Hint: This challenge uses function parameters instead of input(). Try: return not current';
    }
    return { stdout: '', stderr: errorMessage, error: errorMessage };
  }
}
