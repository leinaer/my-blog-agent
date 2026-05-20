"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { NeuralNetwork } from "./components/animations/NeuralNetwork";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/Card";
import { Button } from "./components/ui/Button";
import { Badge } from "./components/ui/Badge";

const features = [
  {
    title: "Agent模拟器",
    description: "交互式模拟AI Agent的完整工作流程，从意图识别到工具调用再到结果生成。",
    icon: "🤖",
    href: "/simulator",
  },
  {
    title: "架构解析",
    description: "通过可视化流程图深入了解AI Agent的内部架构和数据流转过程。",
    icon: "🏗️",
    href: "/architecture",
  },
  {
    title: "技术博客",
    description: "学习AI Agent相关概念、提示词工程和最佳实践。",
    icon: "📚",
    href: "/blog",
  },
];

const aiConcepts = [
  {
    term: "LLM",
    fullForm: "Large Language Model",
    description: "大型语言模型，能够理解和生成人类语言",
  },
  {
    term: "Agent",
    fullForm: "Autonomous Agent",
    description: "能够自主感知环境并采取行动的智能体",
  },
  {
    term: "Prompt",
    fullForm: "Input Prompt",
    description: "用于引导AI模型生成特定输出的输入文本",
  },
  {
    term: "Tool Use",
    fullForm: "Tool Usage",
    description: "Agent调用外部工具扩展自身能力",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Animation */}
      <NeuralNetwork />

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4">AI Agent Learning Platform</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AI Agent
              </span>
              <br />
              交互与原理可视化平台
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl mx-auto text-lg text-muted-foreground"
          >
            通过可视化的方式探索AI Agent的工作原理，交互式体验从意图识别到工具调用的完整流程。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/simulator">
              <Button size="lg" className="w-full sm:w-auto">
                开始体验
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                了解更多
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">核心功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={feature.href}>
                <Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer">
                  <CardHeader>
                    <div className="text-4xl mb-2">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Concepts Section */}
      <section className="relative z-10 container mx-auto px-4 py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">AI核心概念</h2>
          <p className="text-center text-muted-foreground mb-12">
            快速了解AI Agent相关的核心术语和概念
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiConcepts.map((concept, index) => (
              <motion.div
                key={concept.term}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant="secondary">{concept.term}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {concept.fullForm}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{concept.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">准备好开始了吗？</h2>
          <p className="text-muted-foreground">
            立即体验AI Agent模拟器，亲手操作一个完整的Agent工作流程。
          </p>
          <Link href="/simulator">
            <Button size="lg">
              进入模拟器 →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
