"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";

const blogPosts = [
  {
    slug: "what-is-ai-agent",
    title: "AI Agent 是什么？",
    description: "AI Agent（人工智能代理）是一种能够自主感知环境、做出决策并采取行动以实现特定目标的智能系统。",
    date: "2026-05-16",
    tags: ["AI Agent"],
  },
  {
    slug: "prompt-engineering",
    title: "提示词工程基础",
    description: "提示词工程（Prompt Engineering）是设计和优化输入提示，以引导AI模型生成期望输出的技术和艺术。",
    date: "2026-05-16",
    tags: ["提示词"],
  },
  {
    slug: "agent-architecture",
    title: "AI Agent 架构详解",
    description: "AI Agent的核心架构包含多个关键组件，它们协同工作以实现智能化的任务执行。",
    date: "2026-05-16",
    tags: ["架构"],
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">技术博客</h1>
          <p className="text-muted-foreground">
            探索AI Agent相关概念、技术和最佳实践
          </p>
        </motion.div>

        {/* Blog Posts */}
        <div className="space-y-6">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      <span className="text-sm text-muted-foreground ml-auto">
                        {post.date}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {post.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
