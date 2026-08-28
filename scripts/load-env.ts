export {};
// load-env: Next.js already loads .env.local; kept for manual script runs (dotenv removed)
// Use: node --env-file=.env.local scripts/xxx.ts
import { readFileSync } from 'fs';
const parse = (s: string) => s.split('\n').forEach(l => {
  const m = l.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] ||= m[2].replace(/^["']|["']$/g, '');
});
try { parse(readFileSync('.env.local','utf8')); } catch {}
try { parse(readFileSync('.env','utf8')); } catch {}
