import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface RiskMetric {
  name: string;
  value: string;
  percentage: number;
  isPositive?: boolean;
}

interface RiskDashboardProps {
  onSettings: () => void;
}

export default function RiskDashboard({ onSettings }: RiskDashboardProps) {
  const [metrics, setMetrics] = useState<RiskMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const simulatedMetrics: RiskMetric[] = [
      { name: "Использовано маржи", value: "0%", percentage: 0 },
      { name: "PnL", value: "$0.00", percentage: 0, isPositive: true },
      { name: "Волатильность", value: "Низкая", percentage: 20 },
    ];

    setTimeout(() => {
      setMetrics(simulatedMetrics);
      setLoading(false);
    }, 900);

    const interval = setInterval(() => {
      if (!loading) {
        setMetrics((prev) =>
          prev.map((metric) => {
            if (Math.random() > 0.6) {
              const change = Math.random() * 6 - 3;
              const newPercentage = Math.max(
                5,
                Math.min(95, metric.percentage + change)
              );

              if (metric.name === "Использовано маржи") {
                return {
                  ...metric,
                  value: `${Math.round(newPercentage)}%`,
                  percentage: newPercentage,
                };
              } else if (metric.name === "PnL") {
                const pnlValue = parseFloat(metric.value.replace("$", ""));
                const newPnl = pnlValue + (Math.random() * 20 - 10);
                return {
                  ...metric,
                  value: `$${newPnl.toFixed(2)}`,
                  percentage: Math.abs(newPnl) / 1000,
                  isPositive: newPnl >= 0,
                };
              }
            }

            return metric;
          })
        );
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <Card className="h-36 shadow-md3-1 rounded-md3-md border-border">
      <CardContent className="p-3 h-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium">РИСКИ</span>
          <button
            onClick={onSettings}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="material-icons text-xs">settings</span>
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex justify-between mb-1">
                  <div className="h-3 w-20 bg-surface-container rounded"></div>
                  <div className="h-3 w-10 bg-surface-container rounded"></div>
                </div>
                <div className="h-1 bg-surface-container rounded-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {metrics.map((metric, index) => (
              <div key={index} className="text-xs">
                <div className="flex justify-between mb-1">
                  <span>{metric.name}</span>
                  <span
                    className={
                      metric.isPositive
                        ? "text-green-600 dark:text-green-400"
                        : metric.value.includes("-")
                        ? "text-red-600 dark:text-red-400"
                        : ""
                    }
                  >
                    {metric.value}
                  </span>
                </div>
                <Progress value={metric.percentage} className="h-1" />
              </div>
            ))}

            <div className="text-xs mt-1.5">
              <div className="flex justify-between mb-1">
                <span>Stop-Loss</span>
                <span className="text-red-600 dark:text-red-400">-5.2%</span>
              </div>
              <div className="flex justify-between">
                <span>Take-Profit</span>
                <span className="text-green-600 dark:text-green-400">
                  +12.5%
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
