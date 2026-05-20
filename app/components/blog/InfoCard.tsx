import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface InfoCardProps {
  type?: "info" | "warning" | "tip" | "example";
  title?: string;
  children: ReactNode;
  className?: string;
}

export function InfoCard({
  type = "info",
  title,
  children,
  className,
}: InfoCardProps) {
  const styles = {
    info: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
      icon: "💡",
      defaultTitle: "知识点",
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-950/30",
      border: "border-yellow-200 dark:border-yellow-800",
      icon: "⚠️",
      defaultTitle: "注意",
    },
    tip: {
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800",
      icon: "✨",
      defaultTitle: "技巧",
    },
    example: {
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-200 dark:border-purple-800",
      icon: "📝",
      defaultTitle: "示例",
    },
  };

  const style = styles[type] || styles.info;

  return (
    <div
      className={cn(
        "my-6 p-4 rounded-lg border",
        style.bg,
        style.border,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">{style.icon}</span>
        <div className="flex-1">
          {(title || style.defaultTitle) && (
            <h4 className="font-semibold mb-2">{title || style.defaultTitle}</h4>
          )}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
