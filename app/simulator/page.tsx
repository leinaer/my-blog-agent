"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { AgentConfig } from "@/app/components/AgentSimulator/AgentConfig";
import { AgentTerminal } from "@/app/components/AgentSimulator/AgentTerminal";
import { AgentProcessViewer } from "@/app/components/AgentSimulator/AgentProcessViewer";
import { ExampleDataViewer } from "@/app/components/AgentSimulator/ExampleDataViewer";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { scenarios, Scenario, Tool, LogEntry, ProcessStep, AgentState } from "@/lib/agent-simulator";
import { cn } from "@/lib/utils";

export default function SimulatorPage() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("travel");
  const [isRunning, setIsRunning] = useState(false);
  
  // 获取当前选中的场景
  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];
  
  const [tools, setTools] = useState<Tool[]>(selectedScenario.tools);
  const [userInput, setUserInput] = useState(selectedScenario.defaultInput);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [steps, setSteps] = useState<ProcessStep[]>(selectedScenario.steps);
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [progress, setProgress] = useState(0);

  // 当切换场景时，重置状态
  useEffect(() => {
    setTools(selectedScenario.tools.map(t => ({ ...t })));
    setUserInput(selectedScenario.defaultInput);
    setLogs([]);
    setSteps(selectedScenario.steps.map(s => ({ ...s, status: "pending" as const })));
    setAgentState("idle");
    setProgress(0);
  }, [selectedScenarioId]);

  const toggleTool = useCallback((toolId: string) => {
    setTools((prev) =>
      prev.map((tool) =>
        tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool
      )
    );
  }, []);

  const startSimulation = useCallback(async () => {
    setIsRunning(true);
    setLogs([]);
    setSteps(selectedScenario.steps.map(s => ({ ...s, status: "pending" })));
    setProgress(0);

    const enabledTools = tools.filter((t) => t.enabled);
    const generator = selectedScenario.simulate(userInput, enabledTools);

    for await (const result of generator) {
      setLogs(result.logs);
      setSteps(result.steps);
      setAgentState(result.agentState);
      setProgress(result.progress);
    }

    setIsRunning(false);
  }, [userInput, tools, selectedScenario]);

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setLogs([]);
    setAgentState("idle");
    setSteps(selectedScenario.steps.map(s => ({ ...s, status: "pending" })));
    setProgress(0);
  }, [selectedScenario]);

  const getStateBadge = (state: AgentState) => {
    switch (state) {
      case "thinking":
        return <Badge variant="secondary">思考中...</Badge>;
      case "executing":
        return <Badge className="bg-blue-500">执行中...</Badge>;
      case "completed":
        return <Badge className="bg-green-500">已完成</Badge>;
      case "error":
        return <Badge className="bg-red-500">错误</Badge>;
      default:
        return <Badge variant="outline">就绪</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">AI Agent 模拟器</h1>
              <p className="text-muted-foreground mt-1">
                交互式体验不同场景下Agent的完整工作流程
              </p>
            </div>
            {getStateBadge(agentState)}
          </div>
        </motion.div>

        {/* Scenario Selector */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">选择场景</h2>
            {isRunning && (
              <span className="text-sm text-muted-foreground">请先停止当前运行</span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                onClick={() => {
                  if (!isRunning) {
                    setSelectedScenarioId(scenario.id);
                  }
                }}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedScenarioId === scenario.id && "ring-2 ring-primary bg-primary/5",
                  isRunning && "opacity-50 cursor-not-allowed"
                )}
              >
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{scenario.icon}</div>
                  <h3 className="font-semibold text-lg mb-1">{scenario.name}</h3>
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Config */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <AgentConfig
              tools={tools}
              onToggleTool={toggleTool}
              onStart={startSimulation}
              isRunning={isRunning}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">用户输入</CardTitle>
                <CardDescription>描述你的需求，Agent将为你处理</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={isRunning}
                  className="w-full min-h-[100px] p-3 rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="输入你的需求..."
                />
                
                {/* Progress Bar */}
                {isRunning && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">进度</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={startSimulation}
                    disabled={isRunning || !tools.some((t) => t.enabled)}
                    className="flex-1"
                  >
                    {isRunning ? "运行中..." : "开始执行"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetSimulation}
                    disabled={isRunning}
                  >
                    重置
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Example Data Viewer - 显示示例代码或数据 */}
            <ExampleDataViewer 
              exampleData={selectedScenario.exampleData}
              exampleDataType={selectedScenario.exampleDataType}
              scenarioName={selectedScenario.name}
            />
          </motion.div>

          {/* Right Column - Terminal and Process */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <AgentTerminal logs={logs} isRunning={isRunning} />
            <AgentProcessViewer steps={steps} />
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>工作原理</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-semibold">1</div>
                    <h4 className="font-semibold">意图识别</h4>
                  </div>
                  <p className="text-muted-foreground">
                    Agent分析用户输入，理解真实需求和目标，提取关键信息。
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 font-semibold">2</div>
                    <h4 className="font-semibold">工具调用</h4>
                  </div>
                  <p className="text-muted-foreground">
                    根据任务需求，选择合适的工具来获取信息和执行操作。
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-semibold">3</div>
                    <h4 className="font-semibold">结果生成</h4>
                  </div>
                  <p className="text-muted-foreground">
                    整合所有信息，生成结构化的最终结果返回给用户。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
