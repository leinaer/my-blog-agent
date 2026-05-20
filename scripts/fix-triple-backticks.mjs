import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  console.log(`Fixing ${path.basename(filePath)}...`);
  
  // Replace any sequence of &#96; with a single &#96;
  content = content.replace(/(&#96;)+/g, '&#96;');
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Fixed ${path.basename(filePath)}`);
}

// Fix both files
fixFile(path.join(process.cwd(), 'content/blog/agent-architecture.mdx'));
fixFile(path.join(process.cwd(), 'content/blog/prompt-engineering.mdx'));

console.log('\nFixed all multiple backticks!');
