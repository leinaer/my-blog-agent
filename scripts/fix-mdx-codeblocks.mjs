import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'content/blog/agent-architecture.mdx');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Starting fix...');

// Replace all ```typescript ... ``` blocks with <pre> tags (handle Windows line endings)
const typescriptPattern = /```typescript\r?\n([\s\S]*?)```/g;
let tsCount = 0;
content = content.replace(typescriptPattern, (match, code) => {
  tsCount++;
  // Escape curly braces to prevent MDX parsing errors
  const escapedCode = code
    .replace(/{/g, '&#123;')
    .replace(/}/g, '&#125;')
    .trim();
  return `<div className="bg-zinc-900 p-4 rounded-lg my-4 overflow-x-auto">
<pre className="text-zinc-100 text-sm leading-relaxed">${escapedCode}</pre>
</div>`;
});

console.log(`Replaced ${tsCount} TypeScript code blocks`);

// Replace all ```json ... ``` blocks with <pre> tags  
const jsonPattern = /```json\r?\n([\s\S]*?)```/g;
let jsonCount = 0;
content = content.replace(jsonPattern, (match, code) => {
  jsonCount++;
  // Escape curly braces to prevent MDX parsing errors
  const escapedCode = code
    .replace(/{/g, '&#123;')
    .replace(/}/g, '&#125;')
    .trim();
  return `<div className="bg-zinc-900 p-4 rounded-lg my-4 overflow-x-auto">
<pre className="text-zinc-100 text-sm leading-relaxed">${escapedCode}</pre>
</div>`;
});

console.log(`Replaced ${jsonCount} JSON code blocks`);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed agent-architecture.mdx');
