"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Tool } from "@/lib/agent-simulator";

interface AgentConfigProps {
  tools: Tool[];
  onToggleTool: (toolId: string) => void;
  onStart: () => void;
  isRunning: boolean;
}

export function AgentConfig({
  tools,
  onToggleTool,
  onStart,
  isRunning,
}: AgentConfigProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI Agent 配置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-3">可用工具</h4>
          <div className="space-y-2">
            {tools.map((tool) => (
              <label
                key={tool.id}
                className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
              >
                <input
                  type="checkbox"
                  checked={tool.enabled}
                  onChange={() => onToggleTool(tool.id)}
                  disabled={isRunning}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{tool.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {tool.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <Button
          onClick={onStart}
          disabled={isRunning || !tools.some((t) => t.enabled)}
          className="w-full"
        >
          {isRunning ? "运行中..." : "执行 Agent"}
        </Button>
      </CardContent>
    </Card>
  );
}
