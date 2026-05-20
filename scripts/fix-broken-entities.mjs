import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  console.log(`Fixing ${path.basename(filePath)}...`);
  
  // Fix broken backtick entities (#96; should be &#96;)
  content = content.replace(/#96;/g, '&#96;');
  
  // Now replace any sequence of multiple &#96; with a single one
  content = content.replace(/(&#96;)+/g, '&#96;');
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Fixed ${path.basename(filePath)}`);
}

// Fix both files
fixFile(path.join(process.cwd(), 'content/blog/agent-architecture.mdx'));
fixFile(path.join(process.cwd(), 'content/blog/prompt-engineering.mdx'));

console.log('\nFixed all broken backtick entities!');
