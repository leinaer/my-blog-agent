"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  language: string;
  code: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ language, code, filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative group my-6", className)}>
      {filename && (
        <div className="bg-zinc-800 px-4 py-2 text-sm text-zinc-400 rounded-t-lg border-b border-zinc-700 flex items-center justify-between">
          <span className="font-mono">{filename}</span>
          <span className="text-xs text-zinc-500">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className={cn(
          "bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed",
          !filename && "rounded-lg"
        )}>
          <code className={`language-${language} text-zinc-100`}>{code}</code>
        </pre>
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "absolute top-2 right-2 transition-all duration-200",
            copied ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
          onClick={copy}
        >
          {copied ? (
            <span className="text-green-500">✓ 已复制</span>
          ) : (
            <span className="text-zinc-400 hover:text-zinc-100">📋 复制</span>
          )}
        </Button>
      </div>
    </div>
  );
}
