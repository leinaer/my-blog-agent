import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import matter from "gray-matter";
import Link from "next/link";
import { TableOfContents } from "@/app/components/blog/TableOfContents";
import { CodeBlock } from "@/app/components/blog/CodeBlock";
import { InfoCard } from "@/app/components/blog/InfoCard";
import { ComparisonRow } from "@/app/components/blog/ComparisonTable";
import { Mermaid } from "@/app/components/blog/Mermaid";
import { Badge } from "@/app/components/ui/Badge";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPostContent(slug: string) {
  const filePath = path.join(process.cwd(), "content/blog", `${slug}.mdx`);
  
  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data: metadata, content } = matter(rawContent);
    return { content, metadata };
  } catch {
    return null;
  }
}

// Custom MDX components
const components = {
  pre: ({ children }: any) => children, // Remove default pre wrapper
  code: ({ className, children }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "text";
    
    // Recursively extract text content from React elements
    const extractText = (node: any): string => {
      if (typeof node === 'string') {
        return node;
      }
      if (typeof node === 'number') {
        return String(node);
      }
      if (!node || typeof node !== 'object') {
        return '';
      }
      // If it's a React element with props.children
      if ('props' in node && node.props?.children) {
        return extractText(node.props.children);
      }
      // If it's an array of children
      if (Array.isArray(node)) {
        return node.map(extractText).join('');
      }
      // If it has a children property
      if ('children' in node) {
        return extractText(node.children);
      }
      return '';
    };
    
    const code = extractText(children).replace(/\n$/, "");
    
    // If it's an inline code (no language specified)
    if (!match) {
      return <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
    }
    
    return (
      <CodeBlock
        language={language}
        code={code}
      />
    );
  },
  InfoCard,
  ComparisonRow,
  Mermaid,
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const result = await getPostContent(slug);

  if (!result) {
    notFound();
  }

  const { content, metadata } = result;
  
  // Extract title from content or frontmatter
  const title = metadata.title || content.match(/^# (.+)$/m)?.[1] || slug;
  const description = metadata.summary || content.match(/\*\*(.+?)\*\*/)?.[1] || "";
  const tags = Array.isArray(metadata.tags) ? metadata.tags : (metadata.tags ? metadata.tags.split(",").map((t: string) => t.trim()) : []);
  const readTime = metadata.readTime || "5分钟";
  const difficulty = metadata.difficulty || "中级";
  const date = metadata.date || new Date().toISOString().split("T")[0];

  // Get adjacent posts for navigation
  const allPosts = fs.readdirSync(path.join(process.cwd(), "content/blog"));
  const currentIndex = allPosts.findIndex(f => f.replace(".mdx", "") === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1].replace(".mdx", "") : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1].replace(".mdx", "") : null;

  return (
    <article className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-9">
            <header className="mb-8 pb-8 border-b">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              )}
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {title}
              </h1>
              
              {description && (
                <p className="text-lg text-muted-foreground mb-4">{description}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span>📅 {new Date(date).toLocaleDateString("zh-CN")}</span>
                <span>⏱️ {readTime}</span>
                <span>📊 {difficulty}</span>
              </div>
            </header>
            
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <MDXRemote 
                source={content}
                components={components}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [[rehypeHighlight, { detect: true }]],
                  },
                }}
              />
            </div>

            {/* Navigation Footer */}
            <footer className="mt-16 pt-8 border-t">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {prevPost ? (
                  <Link 
                    href={`/blog/${prevPost}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span>←</span>
                    <span className="text-sm">上一篇</span>
                  </Link>
                ) : (
                  <div />
                )}
                
                <Link 
                  href="/blog"
                  className="px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium"
                >
                  📚 返回博客列表
                </Link>
                
                {nextPost ? (
                  <Link 
                    href={`/blog/${nextPost}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="text-sm">下一篇</span>
                    <span>→</span>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </footer>
          </div>

          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block lg:col-span-3">
            <TableOfContents />
          </aside>
        </div>
      </div>
    </article>
  );
}
