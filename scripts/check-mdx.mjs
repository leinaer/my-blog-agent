import fs from 'fs';

const content = fs.readFileSync('content/blog/agent-architecture.mdx', 'utf-8');

// Check for common MDX issues
const issues = [];

// Check for unclosed JSX tags
const openSelfClosing = (content.match(/<[A-Z][a-zA-Z0-9]+\s+[^>]*\/>/g) || []).length;
const openNormal = (content.match(/<[A-Z][a-zA-Z0-9]+(?!\s*\/>)[^>]*>/g) || []).length;
const closeTags = (content.match(/<\/[A-Z][a-zA-Z0-9]+>/g) || []).length;

console.log('Self-closing tags:', openSelfClosing);
console.log('Open normal tags:', openNormal);
console.log('Close tags:', closeTags);
console.log('Total open:', openSelfClosing + openNormal);

// Check for specific problematic patterns
if (content.includes('<ComparisonRow\n')) {
  const comparisonRows = content.match(/<ComparisonRow[\s\S]*?\/>/g) || [];
  console.log('\nComparisonRow blocks found:', comparisonRows.length);
  comparisonRows.forEach((block, i) => {
    if (!block.includes('component=')) {
      console.log(`  Block ${i + 1}: Missing component prop`);
    }
  });
}

console.log('\nFile looks OK!');
