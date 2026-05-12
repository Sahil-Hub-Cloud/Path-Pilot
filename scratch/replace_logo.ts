import fs from 'fs';
import path from 'path';

const srcDir = 'd:/Chatbot/path-pilot/src';

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const files = getAllFiles(srcDir);

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('logo.png')) {
    const newContent = content.replace(/logo\.png/g, 'logo.webp');
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated: ${file}`);
  }
});
