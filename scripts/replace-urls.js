// Global find and replace script for API URLs
// Run this once to update all hardcoded localhost URLs

const fs = require('fs');
const path = require('path');

const OLD_URL = 'http://localhost:5000';
const NEW_PATTERN = "getApiUrl('')";
const IMPORT_STATEMENT = "import { getApiUrl } from '../config/api';";

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Check if file contains old URL
  if (content.includes(OLD_URL)) {
    // Add import if not present
    if (!content.includes("getApiUrl")) {
      const importMatch = content.match(/import .* from ['"].*['"];/);
      if (importMatch) {
        const insertPos = content.lastIndexOf(importMatch[0]) + importMatch[0].length;
        content = content.slice(0, insertPos) + '\n' + IMPORT_STATEMENT + content.slice(insertPos);
      }
    }

    // Replace URLs
    content = content.replace(/(['"`])http:\/\/localhost:5000([^'"`]*)\1/g, "getApiUrl('$2')");
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
    modified = true;
  }

  return modified;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules')) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      replaceInFile(filePath);
    }
  });
}

// Run from jobboard/src directory
const srcDir = path.join(__dirname, '../src');
console.log('Starting URL replacement...');
walkDir(srcDir);
console.log('Done!');
