const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Headings / Dark Text
    content = content.replace(/text-\[\#2C1A0E\]/g, 'text-gray-900 dark:text-gray-100');
    // Secondary Text
    content = content.replace(/text-\[\#5C3D1E\]/g, 'text-gray-800 dark:text-gray-300');
    // Muted Text
    content = content.replace(/text-\[\#8B6E52\]/g, 'text-gray-600 dark:text-gray-400');
    
    // Backgrounds for stat cards, etc.
    content = content.replace(/bg-white/g, 'bg-white dark:bg-gray-800');
    
    // Borders
    content = content.replace(/border-\[\#B48C5A\]\/25/g, 'border-[#B48C5A]/25 dark:border-gray-700');
    content = content.replace(/border-\[\#B48C5A\]\/20/g, 'border-[#B48C5A]/20 dark:border-gray-700');
    content = content.replace(/border-\[\#B48C5A\]\/30/g, 'border-[#B48C5A]/30 dark:border-gray-700');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed', filePath);
    }
  }
});
