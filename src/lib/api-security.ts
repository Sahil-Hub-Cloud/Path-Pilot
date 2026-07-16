export function stripHtml(input: string): string {
  if (!input) return '';
  return input.replace(/<\/?[^>]+(>|$)/g, '');
}

export function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function hasMaliciousPatterns(input: string): boolean {
  const patterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /onerror=/gi,
    /onload=/gi,
    /onmouseover=/gi,
    /data:text\/html/gi,
    /\x00/g, // null bytes
    /\.\.\//g, // ../
    /\.\.\\/g, // ..\
    /~/g, // ~
    /\/etc\//g, // /etc/
    /\/proc\//g, // /proc/
    /__proto__/g, // __proto__
    /constructor/gi // constructor
  ];
  return patterns.some(pattern => pattern.test(input));
}

export function validateLength(input: string, maxLength: number): boolean {
  if (!input) return true;
  return input.length <= maxLength;
}

export function validateCollegeCode(code: string): boolean {
  return /^[A-Z0-9]{2,10}$/.test(code);
}

export const LIMITS = {
  DISPLAY_NAME: 50,
  BIO: 500,
  CODE: 100 * 1024, // 100kb
  STDIN: 10 * 1024, // 10kb
};

// Judge0 sandbox configuration hardener
export const judge0SandboxConfig = {
  cpu_time_limit: 5, // 5 seconds
  memory_limit: 256000, // 256 MB
  max_file_size: 100, // 100 kb
  enable_network: false,
};

export function isCodeMalicious(code: string): boolean {
  const blockedKeywords = [
    'require(', 'import ', 'fs.', 'child_process', 'process.',
    '__dirname', '__filename', 'eval(', 'Function(', 'exec(', 
    'spawn(', 'fetch(', 'XMLHttpRequest', 'WebSocket', 'module.exports',
    'global.', 'process.env'
  ];
  
  const systemCalls = [
    'fork', 'execve', 'mount', 'umount', 'reboot', 'shutdown', 'ptrace'
  ];

  const reverseShellPatterns = [
    'nc -e', 'bash -i', '/dev/tcp', 'curl ', 'wget '
  ];
  
  const allBlocked = [...blockedKeywords, ...systemCalls, ...reverseShellPatterns];
  return allBlocked.some(keyword => code.includes(keyword));
}

export function hardenCode(code: string): string {
  if (isCodeMalicious(code)) {
    throw new Error('Malicious code detected');
  }
  return `'use strict';\n${code}`;
}

export function stripProcessOutput(output: string, maxLen: number = 10240): string {
  if (!output) return '';
  return output.length > maxLen ? output.slice(0, maxLen) + '... (truncated)' : output;
}
