import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  console.log(`Restoring ${path.basename(filePath)}...`);
  
  // Restore backticks in Mermaid charts (outside <pre> tags)
  content = content.replace(/&#96;/g, '`');
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Restored ${path.basename(filePath)}`);
}

// Fix both files
fixFile(path.join(process.cwd(), 'content/blog/agent-architecture.mdx'));
fixFile(path.join(process.cwd(), 'content/blog/prompt-engineering.mdx'));

console.log('\nAll backticks restored!');
