const fs = require('fs');
const path = require('path');

const files = [
  'src/app/api/admin/content/route.ts',
  'src/app/api/admin/copilot/route.ts',
  'src/app/api/admin/exams/route.ts',
  'src/app/api/admin/setup/route.ts',
  'src/app/api/admin/skill-report/route.ts',
  'src/app/api/admin/syllabus/parse/route.ts'
];

const lazyDbCode = `// TOP OF FILE - NO IMPORTS THAT INITIALIZE FIREBASE
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

// Lazy initialization - only runs when request comes in
let db: any = null;

async function getDb() {
  if (db) return db;
  
  const admin = await import('firebase-admin');
  
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\\\n/g, '\\n'),
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      }),
    });
  }
  
  db = admin.firestore();
  return db;
}
`;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Extract all imports except next/server
  const importRegex = /import\s+\{[^\}]+\}\s+from\s+['"]([^'"]+)['"];?/g;
  let matches = [...content.matchAll(importRegex)];
  
  let imports = [];
  for (const match of matches) {
    if (!match[1].includes('next/server')) {
      imports.push(match[0]);
      content = content.replace(match[0] + '\\n', '');
      content = content.replace(match[0] + '\\r\\n', '');
      content = content.replace(match[0], '');
    }
  }
  
  // Remove empty import lines that might have been left
  content = content.replace(/^\s*[\r\n]/gm, '');
  
  // Replace top exports
  content = content.replace(/export const dynamic = 'force-dynamic';\r?\nexport const runtime = 'nodejs';\r?\n?/, '');
  // Replace NextRequest import since it's inside lazyDbCode
  content = content.replace(/import\s+\{\s*NextRequest,\s*NextResponse\s*\}\s+from\s+['"]next\/server['"];?\r?\n?/, '');
  
  // Create dynamic imports code
  let dynamicImports = '        const database = await getDb();\n';
  for (const imp of imports) {
    let parts = imp.match(/import\s+\{([^\}]+)\}\s+from\s+['"]([^'"]+)['"]/);
    if (parts) {
      let vars = parts[1].trim().split(',').map(v => {
        let vparts = v.trim().split(/\s+as\s+/);
        if (vparts.length > 1) {
          return `${vparts[0]}: ${vparts[1]}`;
        }
        return vparts[0];
      }).join(', ');
      
      dynamicImports += `        const { ${vars} } = await import('${parts[2]}');\n`;
    }
  }
  
  // Inject into GET, POST, PUT, DELETE
  content = content.replace(/export async function (GET|POST|PUT|DELETE)\(req: NextRequest\) \{\r?\n\s+try \{\r?\n/g, `export async function $1(req: NextRequest) {\n    try {\n${dynamicImports}`);
  
  // Clean up empty lines at the top
  content = content.replace(/^\s+/, '');
  
  // Final assembly
  fs.writeFileSync(file, lazyDbCode + '\\n' + content);
  console.log('Updated ' + file);
}
