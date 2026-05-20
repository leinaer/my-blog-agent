import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  console.log(`Fixing ${path.basename(filePath)}...`);
  
  // Step 1: Restore all HTML entities to original characters first
  content = content
    .replace(/&#96;/g, '`')
    .replace(/&amp;#123;/g, '{')
    .replace(/&amp;#125;/g, '}')
    .replace(/&amp;lt;/g, '<')
    .replace(/&amp;gt;/g, '>')
    .replace(/&amp;/g, '&');
  
  // Step 2: Now escape only the content inside <pre> tags
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

console.log('\nComplete fix applied!');
console.log('- Mermaid charts: backticks restored');
console.log('- <pre> tags: all special characters escaped');
