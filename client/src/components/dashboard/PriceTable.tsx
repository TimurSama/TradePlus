import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface PriceTableProps {
  onSettings: () => void;
}

interface MarketData {
  symbol: string;
  price: number | null;
  change: number | null;
}

export default function PriceTable({ onSettings }: PriceTableProps) {
  const { data: markets, isLoading } = useQuery<MarketData[]>({
    queryKey: ["/api/markets"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/markets?limit=5");
      const data = await res.json();
      return data.data || [];
    },
    refetchInterval: 5000,
  });

  return (
    <Card className="h-36 shadow-md3-1 rounded-md3-md border-border">
      <CardContent className="p-3 h-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium">ЦЕНЫ</span>
          <button
            onClick={onSettings}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="material-icons text-xs">settings</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
        ) : markets && markets.length > 0 ? (
          <div className="space-y-1">
            {markets.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-xs mb-1 hover:bg-surface-container px-1 py-0.5 rounded transition-colors cursor-pointer"
              >
                <span>{item.symbol}</span>
                <div className="flex items-center">
                  <span
                    className={
                      item.change && item.change >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {item.price
                      ? `$${item.price.toLocaleString("ru-RU", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 4,
                        })}`
                      : "-"}
                  </span>
                  {item.change !== null && (
                    <span
                      className={`ml-2 text-[10px] ${
                        item.change >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {item.change >= 0 ? "+" : ""}
                      {item.change.toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">Нет данных</div>
        )}
      </CardContent>
    </Card>
  );
}
