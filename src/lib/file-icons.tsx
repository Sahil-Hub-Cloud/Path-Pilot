import { FiFile, FiFileText, FiImage, FiDatabase, FiGlobe, FiCode, FiTerminal } from 'react-icons/fi';

const FILE_ICON_MAP: Record<string, { icon: React.ReactNode; color: string }> = {
  js:   { icon: null, color: '#F7DF1E' },
  jsx:  { icon: null, color: '#61DAFB' },
  ts:   { icon: null, color: '#3178C6' },
  tsx:  { icon: null, color: '#3178C6' },
  py:   { icon: null, color: '#3776AB' },
  java: { icon: null, color: '#ED8B00' },
  cpp:  { icon: null, color: '#00599C' },
  c:    { icon: null, color: '#A8B9CC' },
  go:   { icon: null, color: '#00ADD8' },
  rs:   { icon: null, color: '#CE422B' },
  rb:   { icon: null, color: '#CC342D' },
  php:  { icon: null, color: '#777BB4' },
  kt:   { icon: null, color: '#A97BFF' },
  swift:{ icon: null, color: '#FA7343' },
  html: { icon: null, color: '#E34F26' },
  css:  { icon: null, color: '#1572B6' },
  json: { icon: null, color: '#292929' },
  md:   { icon: null, color: '#083FA1' },
  yaml: { icon: null, color: '#CB171E' },
  yml:  { icon: null, color: '#CB171E' },
  sh:   { icon: null, color: '#4EAA25' },
  bash: { icon: null, color: '#4EAA25' },
  txt:  { icon: null, color: '#888899' },
  sql:  { icon: null, color: '#E38C00' },
  xml:  { icon: null, color: '#0060AC' },
  env:  { icon: null, color: '#ECD53F' },
  gitignore: { icon: null, color: '#F05032' },
};

export function getFileIcon(filename: string): { icon: React.ReactNode; color: string } {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const base = filename.split('/').pop()?.toLowerCase() || '';

  if (base === 'package.json') return { icon: null, color: '#CB3837' };
  if (base === 'tsconfig.json') return { icon: null, color: '#3178C6' };
  if (base === '.gitignore') return FILE_ICON_MAP.gitignore;
  if (base === 'dockerfile') return { icon: null, color: '#2496ED' };
  if (base === 'makefile') return { icon: null, color: '#427819' };

  return FILE_ICON_MAP[ext] || { icon: <FiFile size={12} />, color: '#888899' };
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()! : '';
}

export function getLanguageFromExtension(ext: string): string {
  const map: Record<string, string> = {
    py: 'python', js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
    java: 'java', cpp: 'cpp', c: 'c', go: 'go', rs: 'rust', rb: 'ruby',
    php: 'php', kt: 'kotlin', swift: 'swift', html: 'html', css: 'css',
    json: 'json', md: 'markdown', yaml: 'yaml', yml: 'yaml', sh: 'shell',
    bash: 'shell', sql: 'sql', xml: 'xml',
  };
  return map[ext.toLowerCase()] || 'plaintext';
}
