"use client";

import { useEffect, useRef, useState } from "react";
import { Typewriter } from "./Typewriter";
import { LogEntry } from "@/lib/agent-simulator";
import { Button } from "../ui/Button";

interface AgentTerminalProps {
  logs: LogEntry[];
  isRunning: boolean;
}

export function AgentTerminal({ logs, isRunning }: AgentTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "error":
        return "text-red-500";
      default:
        return "text-blue-400";
    }
  };

  const getLogIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "✓";
      case "warning":
        return "⚠";
      case "error":
        return "✗";
      default:
        return "ℹ";
    }
  };

  const toggleDetail = (logId: string) => {
    setExpandedDetails((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm h-[500px] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-zinc-400 ml-2 text-xs">Agent Terminal</span>
        </div>
        <span className="text-zinc-500 text-xs">{logs.length} 条日志</span>
      </div>
      
      <div ref={terminalRef} className="flex-1 overflow-y-auto space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="space-y-1">
            <div className="flex items-start gap-2">
              <span className="text-zinc-600 text-xs whitespace-nowrap mt-0.5">
                [{log.timestamp.toLocaleTimeString()}]
              </span>
              <span className="text-zinc-500 mt-0.5">{getLogIcon(log.type)}</span>
              <span className={`flex-1 ${getLogColor(log.type)}`}>
                <Typewriter text={log.message} speed={8} />
              </span>
              {log.detail && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs text-zinc-500 hover:text-zinc-300"
                  onClick={() => toggleDetail(log.id)}
                >
                  {expandedDetails.has(log.id) ? "收起" : "详情"}
                </Button>
              )}
            </div>
            
            {log.detail && expandedDetails.has(log.id) && (
              <div className="ml-20 p-2 bg-zinc-800 rounded text-xs">
                <pre className="text-zinc-300 whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(JSON.parse(log.detail), null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
        
        {isRunning && (
          <div className="flex items-center gap-2 text-zinc-500">
            <span>[{new Date().toLocaleTimeString()}]</span>
            <span className="text-blue-400">{">"} </span>
            <span className="animate-pulse">▊</span>
          </div>
        )}
      </div>
    </div>
  );
}
