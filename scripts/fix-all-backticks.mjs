import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  console.log(`Fixing ${path.basename(filePath)}...`);
  
  // Replace all <pre>{`...`}</pre> with <pre>...</pre> and escape special characters
  content = content.replace(/<pre className="text-zinc-100 text-sm leading-relaxed">\{`([\s\S]*?)`\}<\/pre>/g, (match, code) => {
    // Escape special characters to prevent MDX parsing errors
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/{/g, '&#123;')
      .replace(/}/g, '&#125;')
      .replace(/`/g, '&#96;');  // Escape backticks
    return `<pre className="text-zinc-100 text-sm leading-relaxed">${escapedCode}</pre>`;
  });
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Fixed ${path.basename(filePath)}`);
}

// Fix both files
fixFile(path.join(process.cwd(), 'content/blog/agent-architecture.mdx'));
fixFile(path.join(process.cwd(), 'content/blog/prompt-engineering.mdx'));

console.log('\nAll files fixed! Escaped: &, <, >, {, }, and backticks');
