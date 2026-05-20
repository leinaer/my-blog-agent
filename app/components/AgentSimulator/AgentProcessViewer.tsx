"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { ProcessStep } from "@/lib/agent-simulator";

interface AgentProcessViewerProps {
  steps: ProcessStep[];
}

export function AgentProcessViewer({ steps }: AgentProcessViewerProps) {
  const getStatusColor = (status: ProcessStep["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "running":
        return "bg-blue-500 animate-pulse";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-300 dark:bg-gray-600";
    }
  };

  const getStatusBadge = (status: ProcessStep["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">完成</Badge>;
      case "running":
        return <Badge variant="secondary">进行中</Badge>;
      case "error":
        return <Badge className="bg-red-500">错误</Badge>;
      default:
        return <Badge variant="outline">等待中</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Agent 执行流程</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="absolute left-4 top-8 w-0.5 h-8 bg-border" />
              )}
              
              <div className="flex items-start gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getStatusColor(
                    step.status
                  )}`}
                >
                  {step.status === "completed" ? "✓" : index + 1}
                </div>
                
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{step.name}</span>
                    {getStatusBadge(step.status)}
                  </div>
                  {step.description && (
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
