import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface TradingChartProps {
  onSettings: () => void;
}

interface ChartDataPoint {
  time: number;
  value: number;
}

export default function TradingChart({ onSettings }: TradingChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const generateChartData = () => {
      const now = Date.now();
      const data: ChartDataPoint[] = [];
      let value = 30000 + Math.random() * 5000;

      for (let i = 0; i < 20; i++) {
        value = value + (Math.random() * 400 - 200);
        data.push({
          time: now - (19 - i) * 3600000,
          value,
        });
      }

      return data;
    };

    setTimeout(() => {
      setChartData(generateChartData());
      setLoading(false);
    }, 700);

    const interval = setInterval(() => {
      if (!loading && chartData.length > 0) {
        setChartData((prev) => {
          const lastValue = prev[prev.length - 1].value;
          const newValue = lastValue + (Math.random() * 400 - 200);

          const newData = [...prev.slice(1), { time: Date.now(), value: newValue }];
          return newData;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [loading, chartData.length]);

  const generatePath = () => {
    if (chartData.length === 0 || !svgRef.current) return "";

    const svgWidth = svgRef.current.clientWidth || 100;
    const svgHeight = svgRef.current.clientHeight || 50;

    const minValue = Math.min(...chartData.map((d) => d.value));
    const maxValue = Math.max(...chartData.map((d) => d.value));
    const range = maxValue - minValue;

    const yScale = (svgHeight * 0.9) / range;
    const xScale = svgWidth / (chartData.length - 1);

    return chartData
      .map((point, i) => {
        const x = i * xScale;
        const y =
          svgHeight -
          (point.value - minValue) * yScale -
          svgHeight * 0.05;
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  };

  const generateAreaPath = () => {
    if (chartData.length === 0 || !svgRef.current) return "";

    const linePath = generatePath();
    const svgWidth = svgRef.current.clientWidth || 100;
    const svgHeight = svgRef.current.clientHeight || 50;

    return `${linePath} L${svgWidth},${svgHeight} L0,${svgHeight} Z`;
  };

  return (
    <Card className="h-36 shadow-md3-1 rounded-md3-md border-border">
      <CardContent className="p-3 h-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium">ГРАФИК</span>
          <button
            onClick={onSettings}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="material-icons text-xs">settings</span>
          </button>
        </div>

        <div className="h-24 relative">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : (
            <svg
              ref={svgRef}
              className="w-full h-full"
              viewBox="0 0 100 50"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="chart-gradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
              <path
                className="stroke-primary stroke-2 fill-none"
                d={generatePath()}
              />
              <path
                className="fill-[url(#chart-gradient)] opacity-20"
                d={generateAreaPath()}
              />
            </svg>
          )}

          {!loading && chartData.length > 0 && (
            <div className="absolute bottom-1 right-1 text-xs opacity-70 text-muted-foreground">
              $
              {Math.round(
                chartData[chartData.length - 1]?.value
              ).toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
