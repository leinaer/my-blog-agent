"use client";

import { useCallback, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  NodeProps,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/lib/utils";

// Custom node components with enhanced styling
function InputNode({ data }: NodeProps) {
  return (
    <div className={cn(
      "px-4 py-3 shadow-lg rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white border-2 border-blue-700 min-w-[140px]",
      data.highlighted && "ring-4 ring-blue-300 scale-110"
    )}>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-white" />
      <div className="font-semibold text-sm">{data.icon} {data.label}</div>
      <div className="text-xs opacity-80 mt-1">{data.description}</div>
    </div>
  );
}

function ProcessNode({ data }: NodeProps) {
  return (
    <div className={cn(
      "px-4 py-3 shadow-lg rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white border-2 border-purple-700 min-w-[140px]",
      data.highlighted && "ring-4 ring-purple-300 scale-110"
    )}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-white" />
      <div className="font-semibold text-sm">{data.icon} {data.label}</div>
      <div className="text-xs opacity-80 mt-1">{data.description}</div>
    </div>
  );
}

function LLMNode({ data }: NodeProps) {
  return (
    <div className={cn(
      "px-4 py-3 shadow-lg rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-2 border-indigo-700 min-w-[160px]",
      data.highlighted && "ring-4 ring-indigo-300 scale-110"
    )}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-white" />
      <Handle type="target" position={Position.Bottom} className="w-3 h-3 bg-white" />
      <div className="font-semibold text-sm">{data.icon} {data.label}</div>
      <div className="text-xs opacity-80 mt-1">{data.description}</div>
    </div>
  );
}

function MemoryNode({ data }: NodeProps) {
  return (
    <div className={cn(
      "px-4 py-3 shadow-lg rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-2 border-cyan-700 min-w-[140px]",
      data.highlighted && "ring-4 ring-cyan-300 scale-110"
    )}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-white" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-white" />
      <div className="font-semibold text-sm">{data.icon} {data.label}</div>
      <div className="text-xs opacity-80 mt-1">{data.description}</div>
    </div>
  );
}

function ToolNode({ data }: NodeProps) {
  return (
    <div className={cn(
      "px-4 py-3 shadow-lg rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white border-2 border-green-700 min-w-[140px]",
      data.highlighted && "ring-4 ring-green-300 scale-110"
    )}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-white" />
      <div className="font-semibold text-sm">{data.icon} {data.label}</div>
      <div className="text-xs opacity-80 mt-1">{data.description}</div>
    </div>
  );
}

function ReflectionNode({ data }: NodeProps) {
  return (
    <div className={cn(
      "px-4 py-3 shadow-lg rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white border-2 border-pink-700 min-w-[140px]",
      data.highlighted && "ring-4 ring-pink-300 scale-110"
    )}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-white" />
      <div className="font-semibold text-sm">{data.icon} {data.label}</div>
      <div className="text-xs opacity-80 mt-1">{data.description}</div>
    </div>
  );
}

function OutputNode({ data }: NodeProps) {
  return (
    <div className={cn(
      "px-4 py-3 shadow-lg rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white border-2 border-orange-700 min-w-[140px]",
      data.highlighted && "ring-4 ring-orange-300 scale-110"
    )}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-white" />
      <div className="font-semibold text-sm">{data.icon} {data.label}</div>
      <div className="text-xs opacity-80 mt-1">{data.description}</div>
    </div>
  );
}

const nodeTypes = {
  input: InputNode,
  process: ProcessNode,
  llm: LLMNode,
  memory: MemoryNode,
  tool: ToolNode,
  reflection: ReflectionNode,
  output: OutputNode,
};

// Enhanced nodes with more detail
const initialNodes: Node[] = [
  // Perception Layer
  {
    id: "user-input",
    type: "input",
    data: { label: "用户输入", description: "User Input", icon: "📝" },
    position: { x: 50, y: 250 },
  },
  {
    id: "intent-recognition",
    type: "process",
    data: { label: "意图识别", description: "Intent Classification", icon: "🎯" },
    position: { x: 250, y: 150 },
  },
  {
    id: "entity-extraction",
    type: "process",
    data: { label: "实体提取", description: "Named Entity Recognition", icon: "🏷️" },
    position: { x: 250, y: 350 },
  },
  
  // Cognition Layer
  {
    id: "llm-core",
    type: "llm",
    data: { label: "LLM核心引擎", description: "Large Language Model", icon: "🧠" },
    position: { x: 500, y: 250 },
  },
  {
    id: "memory-system",
    type: "memory",
    data: { label: "记忆系统", description: "Short & Long-term Memory", icon: "💾" },
    position: { x: 500, y: 450 },
  },
  {
    id: "task-planning",
    type: "process",
    data: { label: "任务规划", description: "Task Decomposition", icon: "📋" },
    position: { x: 750, y: 150 },
  },
  {
    id: "reflection",
    type: "reflection",
    data: { label: "反思机制", description: "Self-Evaluation", icon: "🔄" },
    position: { x: 750, y: 350 },
  },
  
  // Action Layer
  {
    id: "tool-selector",
    type: "process",
    data: { label: "工具选择", description: "Tool Selection", icon: "🔧" },
    position: { x: 1000, y: 100 },
  },
  {
    id: "search-tool",
    type: "tool",
    data: { label: "搜索引擎", description: "Web Search API", icon: "🔍" },
    position: { x: 1200, y: 50 },
  },
  {
    id: "database-tool",
    type: "tool",
    data: { label: "数据库", description: "Vector Database", icon: "🗄️" },
    position: { x: 1200, y: 150 },
  },
  {
    id: "api-tool",
    type: "tool",
    data: { label: "外部API", description: "Third-party APIs", icon: "🌐" },
    position: { x: 1200, y: 250 },
  },
  {
    id: "result-integration",
    type: "process",
    data: { label: "结果整合", description: "Result Aggregation", icon: "📊" },
    position: { x: 1000, y: 350 },
  },
  {
    id: "output",
    type: "output",
    data: { label: "输出生成", description: "Final Response", icon: "✨" },
    position: { x: 1000, y: 500 },
  },
];

const initialEdges: Edge[] = [
  // Perception to Cognition
  { id: "e1-2", source: "user-input", target: "intent-recognition", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e1-3", source: "user-input", target: "entity-extraction", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e2-4", source: "intent-recognition", target: "llm-core", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e3-4", source: "entity-extraction", target: "llm-core", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  
  // LLM and Memory interaction
  { id: "e4-5", source: "llm-core", target: "memory-system", animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeDasharray: "5,5" } },
  { id: "e5-4", source: "memory-system", target: "llm-core", animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeDasharray: "5,5" } },
  
  // Planning and Reflection
  { id: "e4-6", source: "llm-core", target: "task-planning", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e6-7", source: "task-planning", target: "reflection", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e7-4", source: "reflection", target: "llm-core", animated: true, markerEnd: { type: MarkerType.ArrowClosed }, label: "迭代优化", labelStyle: { fill: "#ec4899", fontWeight: 600 } },
  
  // Tool execution
  { id: "e6-8", source: "task-planning", target: "tool-selector", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e8-9", source: "tool-selector", target: "search-tool", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e8-10", source: "tool-selector", target: "database-tool", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e8-11", source: "tool-selector", target: "api-tool", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  
  // Result integration
  { id: "e9-12", source: "search-tool", target: "result-integration", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e10-12", source: "database-tool", target: "result-integration", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e11-12", source: "api-tool", target: "result-integration", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e12-13", source: "result-integration", target: "output", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
];

// Detailed information for each node
const nodeDetails: Record<string, { title: string; description: string; tech: string[]; workflow: string[]; code?: string }> = {
  "user-input": {
    title: "用户输入层",
    description: "接收用户的自然语言请求，支持多模态输入（文本、语音、图像）。",
    tech: ["WebSocket实时通信", "音频转文字(Whisper)", "图像识别(CLVIP)"],
    workflow: ["接收原始输入", "预处理和清洗", "格式标准化"],
  },
  "intent-recognition": {
    title: "意图识别",
    description: "使用分类模型判断用户的真实意图，如查询、创作、分析等。",
    tech: ["BERT分类器", "Few-shot Learning", "Zero-shot Classification"],
    workflow: ["文本编码", "意图分类", "置信度评估"],
  },
  "llm-core": {
    title: "LLM核心引擎",
    description: "大型语言模型作为Agent的大脑，负责推理、决策和内容生成。",
    tech: ["GPT-4/Claude/Gemini", "Transformer架构", "Chain-of-Thought推理"],
    workflow: ["Prompt构建", "上下文管理", "Token生成"],
    code: `from openai import OpenAI

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": prompt}]
)`,
  },
  "memory-system": {
    title: "记忆系统",
    description: "存储和检索历史对话、用户偏好和领域知识，支持长期记忆。",
    tech: ["向量数据库(Pinecone/Chroma)", "嵌入模型(text-embedding)", "RAG检索增强"],
    workflow: ["文本向量化", "相似度搜索", "上下文注入"],
  },
  "reflection": {
    title: "反思机制",
    description: "自我评估执行结果，发现错误并迭代优化，提高输出质量。",
    tech: ["Self-Reflection Prompting", "Critique Model", "ReAct框架"],
    workflow: ["结果评估", "问题识别", "计划调整"],
  },
};

export default function ArchitecturePage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Animation demo mode
  const playDemo = useCallback(async () => {
    setIsPlaying(true);
    const demoPath = [
      "user-input",
      "intent-recognition",
      "llm-core",
      "task-planning",
      "tool-selector",
      "search-tool",
      "result-integration",
      "output",
    ];

    for (const nodeId of demoPath) {
      setHighlightedNodes((prev) => new Set(prev).add(nodeId));
      const node = nodes.find((n) => n.id === nodeId);
      if (node) setSelectedNode(node);
      
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    setHighlightedNodes(new Set());
    setIsPlaying(false);
  }, [nodes]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Agent 架构解析</h1>
            <p className="text-muted-foreground">
              三层架构：感知层 → 认知层 → 行动层，完整展示Agent内部工作原理
            </p>
          </div>
          <Button onClick={playDemo} disabled={isPlaying} size="lg">
            {isPlaying ? "演示中..." : "▶ 播放演示"}
          </Button>
        </motion.div>

        {/* Legend */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500" />
                <span>输入层</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-500" />
                <span>处理层</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-indigo-500" />
                <span>LLM核心</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-cyan-500" />
                <span>记忆系统</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500" />
                <span>工具层</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-pink-500" />
                <span>反思机制</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-500" />
                <span>输出层</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="h-[600px] border rounded-lg bg-card"
        >
          <ReactFlow
            nodes={nodes.map((node) => ({
              ...node,
              data: {
                ...node.data,
                highlighted: highlightedNodes.has(node.id),
              },
            }))}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
          >
            <Background color="#888" gap={20} />
            <Controls />
          </ReactFlow>
        </motion.div>

        {/* Node Details Panel */}
        <AnimatePresence mode="wait">
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{selectedNode.data.icon}</span>
                    {selectedNode.data.label}
                    <Badge variant="secondary">{selectedNode.type}</Badge>
                  </CardTitle>
                  <CardDescription>{selectedNode.data.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {nodeDetails[selectedNode.id] ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">功能说明</h4>
                        <p className="text-muted-foreground">{nodeDetails[selectedNode.id].description}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">常用技术</h4>
                        <div className="flex flex-wrap gap-2">
                          {nodeDetails[selectedNode.id].tech.map((tech) => (
                            <Badge key={tech} variant="outline">{tech}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">工作流程</h4>
                        <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                          {nodeDetails[selectedNode.id].workflow.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      {nodeDetails[selectedNode.id].code && (
                        <div>
                          <h4 className="font-semibold mb-2">代码示例</h4>
                          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm text-zinc-100">
                            <code>{nodeDetails[selectedNode.id].code}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">点击节点查看详细信息...</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Architecture Layers Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>三层架构详解</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-semibold">1</div>
                    <h4 className="font-semibold">感知层 (Perception)</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    负责接收和理解用户输入，包括意图识别、实体提取、情感分析等。将非结构化输入转化为结构化信息。
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>多模态输入处理</li>
                    <li>语义理解</li>
                    <li>上下文感知</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 font-semibold">2</div>
                    <h4 className="font-semibold">认知层 (Cognition)</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Agent的核心思考区域，LLM进行推理决策，记忆系统提供上下文，反思机制确保质量。
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>LLM推理引擎</li>
                    <li>长短期记忆</li>
                    <li>任务分解规划</li>
                    <li>自我反思优化</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-semibold">3</div>
                    <h4 className="font-semibold">行动层 (Action)</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    执行具体操作，调用外部工具获取数据，整合结果并生成最终响应给用户。
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>智能工具选择</li>
                    <li>并行工具执行</li>
                    <li>结果聚合整合</li>
                    <li>格式化输出</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
