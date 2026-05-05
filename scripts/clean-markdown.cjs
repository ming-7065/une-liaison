const fs = require('fs');
const path = require('path');

const dirs = [
  './src/content/products',
  './src/content/news',
  './src/content/blog',
];

// Fields to remove from all collections
const fieldsToRemove = [
  'title_ja',
  'title_en',
  'description_ja',
  'description_en',
  'features_ja',
  'features_en',
  'excerpt_ja',
  'excerpt_en',
];

function cleanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract frontmatter between ---
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return;
  
  const frontmatter = match[1];
  const rest = content.slice(match[0].length);
  
  // Parse YAML lines
  const lines = frontmatter.split('\n');
  const cleanedLines = [];
  let skipIndent = false;
  let indentLevel = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this line starts a field we want to remove
    const keyMatch = line.match(/^(\s*)(\w+):/);
    if (keyMatch) {
      const key = keyMatch[2];
      if (fieldsToRemove.includes(key)) {
        skipIndent = true;
        indentLevel = keyMatch[1].length;
        continue;
      }
      skipIndent = false;
    }
    
    // Skip continuation lines of a removed field (list items, etc.)
    if (skipIndent) {
      const currentIndent = line.match(/^(\s*)/)[1].length;
      if (currentIndent > indentLevel || (line.trim().startsWith('-') && currentIndent >= indentLevel)) {
        continue;
      }
      skipIndent = false;
    }
    
    cleanedLines.push(line);
  }
  
  // Remove trailing blank lines in frontmatter
  while (cleanedLines.length > 0 && cleanedLines[cleanedLines.length - 1] === '') {
    cleanedLines.pop();
  }
  
  const newContent = `---\n${cleanedLines.join('\n')}\n---${rest}`;
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log('Cleaned:', filePath);
}

dirs.forEach(dir => {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  files.forEach(f => cleanFile(path.join(dir, f)));
});

console.log('Done!');
