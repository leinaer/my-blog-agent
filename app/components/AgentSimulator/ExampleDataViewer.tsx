"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/lib/utils";

interface ExampleDataViewerProps {
  exampleData?: string;
  exampleDataType?: "code" | "data" | "text";
  scenarioName: string;
}

export function ExampleDataViewer({ 
  exampleData, 
  exampleDataType = "text",
  scenarioName 
}: ExampleDataViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!exampleData) return null;

  const getTitle = () => {
    switch (exampleDataType) {
      case "code":
        return "📝 示例代码";
      case "data":
        return "📊 示例数据";
      default:
        return "📄 示例内容";
    }
  };

  const getLanguage = () => {
    switch (exampleDataType) {
      case "code":
        return "python";
      case "data":
        return "csv";
      default:
        return "text";
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {getTitle()}
            <span className="text-xs text-muted-foreground font-normal">
              （{scenarioName}场景使用的示例）
            </span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? "收起 ▲" : "展开 ▼"}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="relative">
            <pre className={cn(
              "bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed",
              "max-h-[400px] overflow-y-auto"
            )}>
              <code className={`language-${getLanguage()} text-zinc-100`}>
                {exampleData}
              </code>
            </pre>
            
            {/* Info tooltip */}
            <div className="absolute top-2 right-2 bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
              {exampleDataType === "code" ? "Python" : exampleDataType === "data" ? "CSV" : "Text"}
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            💡 提示：您可以在上方输入框中修改需求，AI将基于此示例数据进行分析。您也可以替换为自己的代码或数据。
          </p>
        </CardContent>
      )}
    </Card>
  );
}
