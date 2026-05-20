import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  console.log(`Fixing ${path.basename(filePath)}...`);
  
  // Only replace backticks inside <pre> tags
  // Match <pre ...>...</pre> and replace backticks within
  content = content.replace(/(<pre[^>]*>)([\s\S]*?)(<\/pre>)/g, (match, openTag, codeContent, closeTag) => {
    const escapedCode = codeContent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/{/g, '&#123;')
      .replace(/}/g, '&#125;')
      .replace(/`/g, '&#96;');
    return openTag + escapedCode + closeTag;
  });
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Fixed ${path.basename(filePath)}`);
}

// Fix both files
fixFile(path.join(process.cwd(), 'content/blog/agent-architecture.mdx'));
fixFile(path.join(process.cwd(), 'content/blog/prompt-engineering.mdx'));

console.log('\nAll files fixed! Only replaced characters inside <pre> tags');
