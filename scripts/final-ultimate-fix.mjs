import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  console.log(`Ultimate fix for ${path.basename(filePath)}...`);
  
  // Step 1: Fix double-escaped entities
  content = content
    .replace(/&amp;amp;#123;/g, '&#123;')
    .replace(/&amp;amp;#125;/g, '&#125;')
    .replace(/&amp;amp;lt;/g, '&lt;')
    .replace(/&amp;amp;gt;/g, '&gt;')
    .replace(/&amp;amp;/g, '&amp;');
  
  // Step 2: Fix Mermaid charts - restore backticks
  content = content.replace(/chart=\{`#96;/g, 'chart={`');
  
  // Step 3: Fix <pre> tags - ensure proper escaping
  content = content.replace(/(<pre[^>]*>)([\s\S]*?)(<\/pre>)/g, (match, openTag, codeContent, closeTag) => {
    // First unescape everything
    let unescaped = codeContent
      .replace(/&#96;/g, '`')
      .replace(/&#123;/g, '{')
      .replace(/&#125;/g, '}')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    
    // Then properly escape
    let escaped = unescaped
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/{/g, '&#123;')
      .replace(/}/g, '&#125;')
      .replace(/`/g, '&#96;');
    
    return openTag + escaped + closeTag;
  });
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Fixed ${path.basename(filePath)}`);
}

// Fix both files
fixFile(path.join(process.cwd(), 'content/blog/agent-architecture.mdx'));
fixFile(path.join(process.cwd(), 'content/blog/prompt-engineering.mdx'));

console.log('\nUltimate fix complete!');
