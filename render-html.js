const fs = require('fs');
const md = fs.readFileSync('docs/BUILD_LOG.md', 'utf8');
const lines = md.split('\n');

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function processInline(line) {
  return line
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

let html = `<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>BUILD_LOG — Une Liaison 改造歷程</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 960px; margin: 40px auto; padding: 0 24px; line-height: 1.75; color: #2d3748; background: #fff; }
h1 { font-size: 1.8em; color: #1a202c; border-bottom: 3px solid #48bb78; padding-bottom: 10px; margin-top: 0; }
h2 { font-size: 1.4em; color: #2d3748; margin-top: 40px; border-left: 4px solid #48bb78; padding-left: 12px; }
h3 { font-size: 1.15em; color: #4a5568; margin-top: 28px; }
h4 { font-size: 1em; color: #718096; margin-top: 20px; }
p { margin: 12px 0; }
table { border-collapse: collapse; width: 100%; margin: 16px 0; font-size: 0.95em; }
th, td { border: 1px solid #e2e8f0; padding: 10px 14px; text-align: left; }
th { background: #edf2f7; font-weight: 600; }
tr:nth-child(even) { background: #f7fafc; }
code { background: #edf2f7; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; font-family: "SF Mono", Monaco, monospace; }
pre { background: #1a202c; color: #e2e8f0; padding: 20px; border-radius: 8px; overflow-x: auto; line-height: 1.5; }
pre code { background: none; padding: 0; color: inherit; }
a { color: #2b6cb0; text-decoration: none; }
a:hover { text-decoration: underline; }
blockquote { border-left: 4px solid #cbd5e0; margin: 20px 0; padding: 10px 20px; color: #718096; background: #f7fafc; border-radius: 0 8px 8px 0; }
hr { border: none; border-top: 2px solid #e2e8f0; margin: 36px 0; }
li { margin: 4px 0; }
</style></head>
<body>
`;

let inCode = false;
let codeLines = [];
let inTable = false;
let tableRows = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.startsWith('```')) {
    if (!inCode) {
      inCode = true;
      codeLines = [];
    } else {
      inCode = false;
      html += '<pre><code>' + escapeHtml(codeLines.join('\n')) + '</code></pre>\n';
    }
    continue;
  }

  if (inCode) {
    codeLines.push(line);
    continue;
  }

  // Table detection
  if (line.startsWith('|') && !line.startsWith('|  ')) {
    if (!inTable) {
      inTable = true;
      tableRows = [];
    }
    // Skip separator rows (|---|---|)
    if (!line.match(/^\|[\s\-:]+\|/)) {
      tableRows.push(line);
    }
    continue;
  } else if (inTable) {
    inTable = false;
    if (tableRows.length > 0) {
      html += '<table>\n';
      tableRows.forEach((row, idx) => {
        const cells = row.split('|').filter(c => c.trim() !== '');
        const tag = idx === 0 ? 'th' : 'td';
        html += '<tr>' + cells.map(c => `<${tag}>${processInline(c.trim())}</${tag}>`).join('') + '</tr>\n';
      });
      html += '</table>\n';
    }
  }

  if (line.trim() === '') {
    html += '<br>\n';
    continue;
  }

  if (line.startsWith('# ')) {
    html += `<h1>${processInline(line.slice(2))}</h1>\n`;
  } else if (line.startsWith('## ')) {
    html += `<h2>${processInline(line.slice(3))}</h2>\n`;
  } else if (line.startsWith('### ')) {
    html += `<h3>${processInline(line.slice(4))}</h3>\n`;
  } else if (line.startsWith('#### ')) {
    html += `<h4>${processInline(line.slice(5))}</h4>\n`;
  } else if (line.startsWith('---')) {
    html += '<hr>\n';
  } else if (line.startsWith('> ')) {
    html += `<blockquote>${processInline(line.slice(2))}</blockquote>\n`;
  } else if (line.startsWith('- ') || line.startsWith('* ')) {
    html += `<li>${processInline(line.slice(2))}</li>\n`;
  } else if (/^\d+\. /.test(line)) {
    html += `<li>${processInline(line.replace(/^\d+\. /, ''))}</li>\n`;
  } else {
    html += `<p>${processInline(line)}</p>\n`;
  }
}

// Close any open table
if (inTable && tableRows.length > 0) {
  html += '<table>\n';
  tableRows.forEach((row, idx) => {
    const cells = row.split('|').filter(c => c.trim() !== '');
    const tag = idx === 0 ? 'th' : 'td';
    html += '<tr>' + cells.map(c => `<${tag}>${processInline(c.trim())}</${tag}>`).join('') + '</tr>\n';
  });
  html += '</table>\n';
}

html += '</body></html>';

fs.writeFileSync('docs/BUILD_LOG.html', html);
console.log('BUILD_LOG.html generated successfully');