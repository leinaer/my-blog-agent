import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">AI Agent Lab</h3>
            <p className="text-sm text-muted-foreground">
              探索AI Agent的工作原理，通过交互式可视化学习前沿技术。
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/simulator" className="text-muted-foreground hover:text-primary">
                  Agent模拟器
                </Link>
              </li>
              <li>
                <Link href="/architecture" className="text-muted-foreground hover:text-primary">
                  架构解析
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                  技术博客
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">关于</h3>
            <p className="text-sm text-muted-foreground">
              本项目旨在通过可视化和交互演示，帮助开发者理解AI Agent的核心概念和工作流程。
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>Built with Next.js, React, and Framer Motion</p>
        </div>
      </div>
    </footer>
  );
}
