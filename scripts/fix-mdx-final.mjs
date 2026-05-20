import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'content/blog/agent-architecture.mdx');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Starting final fix...');

// Replace all <pre>{`...`}</pre> with <pre>...</pre> and escape braces
content = content.replace(/<pre className="text-zinc-100 text-sm leading-relaxed">\{`([\s\S]*?)`\}<\/pre>/g, (match, code) => {
  // Escape curly braces to prevent MDX parsing errors
  const escapedCode = code
    .replace(/{/g, '&#123;')
    .replace(/}/g, '&#125;');
  return `<pre className="text-zinc-100 text-sm leading-relaxed">${escapedCode}</pre>`;
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed agent-architecture.mdx - escaped all curly braces');
