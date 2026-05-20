import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'content/blog/agent-architecture.mdx');
let content = fs.readFileSync(filePath, 'utf-8');

// 在<pre>标签内，将&#96;替换回正常的反引号`
// 多次运行以确保所有都被替换
let prevContent = '';
while (prevContent !== content) {
  prevContent = content;
  content = content.replace(/(<pre[^>]*>[\s\S]*?)&#96;([\s\S]*?<\/pre>)/g, (match, before, after) => {
    return before + '`' + after;
  });
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed all backticks in <pre> tags');
