import { Card } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";

interface ComparisonOption {
  name: string;
  pros: string[];
  cons: string[];
}

interface ComparisonRowProps {
  component: string;
  option1: ComparisonOption & { recommendation?: string };
  option2: ComparisonOption & { recommendation?: string };
  recommendation?: string;
}

export function ComparisonTable() {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-border">
            <th className="text-left p-3 font-semibold">对比项</th>
            <th className="text-left p-3 font-semibold">选项 A</th>
            <th className="text-left p-3 font-semibold">选项 B</th>
          </tr>
        </thead>
        <tbody>
          {/* Rows will be passed as children or props */}
        </tbody>
      </table>
    </div>
  );
}

export function ComparisonRow({
  component,
  option1,
  option2,
  recommendation,
}: ComparisonRowProps) {
  return (
    <Card className="my-6 overflow-hidden">
      <div className="bg-muted/50 px-6 py-4 border-b">
        <h4 className="font-semibold text-lg">{component}</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="font-semibold text-lg">{option1.name}</h5>
            {option1.recommendation && (
              <Badge variant="default">推荐</Badge>
            )}
          </div>
          
          <div>
            <h6 className="text-sm font-medium text-green-600 mb-2">✅ 优点</h6>
            <ul className="space-y-1">
              {option1.pros.map((pro, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h6 className="text-sm font-medium text-red-600 mb-2">❌ 缺点</h6>
            <ul className="space-y-1">
              {option1.cons.map((con, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="font-semibold text-lg">{option2.name}</h5>
            {option2.recommendation && (
              <Badge variant="default">推荐</Badge>
            )}
          </div>
          
          <div>
            <h6 className="text-sm font-medium text-green-600 mb-2">✅ 优点</h6>
            <ul className="space-y-1">
              {option2.pros.map((pro, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h6 className="text-sm font-medium text-red-600 mb-2">❌ 缺点</h6>
            <ul className="space-y-1">
              {option2.cons.map((con, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {recommendation && (
        <div className="bg-primary/5 px-6 py-4 border-t">
          <p className="text-sm">
            <span className="font-semibold">💡 建议：</span>
            {recommendation}
          </p>
        </div>
      )}
    </Card>
  );
}
