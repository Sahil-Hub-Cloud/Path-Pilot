import fs from 'fs';
import path from 'path';

const srcDir = 'd:/Chatbot/path-pilot/src';

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const files = getAllFiles(srcDir);

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const iconMatches = content.match(/Fi[A-Z][a-zA-Z0-9]*/g);
  if (!iconMatches) return;

  const uniqueIcons = Array.from(new Set(iconMatches));
  const missingIcons = uniqueIcons.filter(icon => {
    // Check if the icon is imported
    const importRegex = new RegExp(`import\\s+{[^}]*\\b${icon}\\b[^}]*}\\s+from\\s+['"]react-icons/fi['"]`, 'g');
    return !importRegex.test(content);
  });

  if (missingIcons.length > 0) {
    console.log(`File: ${file}`);
    console.log(`Missing Icons: ${missingIcons.join(', ')}`);
    console.log('---');
  }
});
