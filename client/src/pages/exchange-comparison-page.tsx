import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface ExchangePrice {
  exchange: string;
  price: number | null;
  volume24h?: number;
  change24h?: number;
}

interface SymbolComparison {
  symbol: string;
  prices: Record<string, number | null>;
  maxPrice: number | null;
  minPrice: number | null;
  difference: number | null;
  higherExchange: string | null;
  lowerExchange: string | null;
  timestamp: string;
}

const EXCHANGES = [
  "bybit",
  "binance",
  "okx",
  "kucoin",
  "gateio",
  "huobi",
  "kraken",
  "bitget",
  "mexc",
];

export default function ExchangeComparisonPage() {
  const [selectedSymbol, setSelectedSymbol] = useState("BTC/USDT");
  const [searchSymbol, setSearchSymbol] = useState("");

  const { data: popularSymbols = [] } = useQuery<string[]>({
    queryKey: ["/api/symbols/popular"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/symbols/popular");
      const data = await res.json();
      return data.data || [];
    },
  });

  const { data: comparison, isLoading } = useQuery<SymbolComparison>({
    queryKey: ["/api/prices", selectedSymbol],
    queryFn: async () => {
      const res = await apiRequest(
        "GET",
        `/api/prices/${encodeURIComponent(selectedSymbol)}`
      );
      const data = await res.json();
      return data.data || null;
    },
    refetchInterval: 5000,
    enabled: !!selectedSymbol,
  });

  const handleSymbolSearch = () => {
    if (searchSymbol.trim()) {
      setSelectedSymbol(searchSymbol.trim().toUpperCase());
    }
  };

  const sortedPrices = comparison
    ? Object.entries(comparison.prices)
        .map(([exchange, price]) => ({
          exchange,
          price: price as number | null,
        }))
        .filter((p) => p.price !== null)
        .sort((a, b) => (b.price || 0) - (a.price || 0))
    : [];

  const maxPrice = comparison?.maxPrice || null;
  const minPrice = comparison?.minPrice || null;
  const difference = comparison?.difference || null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Сравнение цен по биржам</h1>
            <p className="text-muted-foreground">
              Сравните цены криптовалют на всех 9 биржах в реальном времени
            </p>
          </div>

          <Card className="shadow-md3-2 rounded-md3-lg mb-6">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                  <SelectTrigger className="flex-1 rounded-md3-md">
                    <SelectValue placeholder="Выберите пару" />
                  </SelectTrigger>
                  <SelectContent>
                    {popularSymbols && popularSymbols.length > 0
                      ? popularSymbols.slice(0, 20).map((symbol) => (
                          <SelectItem key={symbol} value={symbol}>
                            {symbol}
                          </SelectItem>
                        ))
                      : null}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Или введите пару (например, BTC/USDT)"
                  className="flex-1 rounded-md3-md"
                  value={searchSymbol}
                  onChange={(e) => setSearchSymbol(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSymbolSearch();
                    }
                  }}
                />
                <Button onClick={handleSymbolSearch} className="rounded-md3-md">
                  Поиск
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <Card className="shadow-md3-2 rounded-md3-lg">
              <CardContent className="p-12">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          ) : comparison ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="shadow-md3-1 rounded-md3-lg">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      Максимальная цена
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                      ${maxPrice?.toLocaleString("ru-RU", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 8,
                      }) || "-"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {comparison.higherExchange || "-"}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md3-1 rounded-md3-lg">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      Минимальная цена
                    </div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                      ${minPrice?.toLocaleString("ru-RU", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 8,
                      }) || "-"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {comparison.lowerExchange || "-"}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md3-1 rounded-md3-lg">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      Разница
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {difference !== null
                        ? `${difference.toFixed(2)}%`
                        : "-"}
                    </div>
                    {difference !== null && difference > 1 && (
                      <div className="text-xs text-primary">
                        Возможность арбитража
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-md3-2 rounded-md3-lg">
                <CardHeader>
                  <CardTitle>Цены на всех биржах</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {EXCHANGES.map((exchange) => {
                      const price = comparison.prices[exchange];
                      const isMax = exchange === comparison.higherExchange;
                      const isMin = exchange === comparison.lowerExchange;
                      const isValid = price !== null;

                      return (
                        <div
                          key={exchange}
                          className={`p-4 rounded-md3-md flex items-center justify-between ${
                            isMax
                              ? "bg-green-500/10 border border-green-500/20"
                              : isMin
                              ? "bg-red-500/10 border border-red-500/20"
                              : "bg-surface-container"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md3-md bg-surface-container-high flex items-center justify-center font-bold text-sm">
                              {exchange.toUpperCase().slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-medium capitalize">
                                {exchange}
                              </div>
                              {isMax && (
                                <Badge className="bg-green-500 text-white border-0 text-xs">
                                  Макс
                                </Badge>
                              )}
                              {isMin && (
                                <Badge className="bg-red-500 text-white border-0 text-xs">
                                  Мин
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {isValid ? (
                              <>
                                <div className="font-bold text-lg">
                                  ${price?.toLocaleString("ru-RU", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 8,
                                  })}
                                </div>
                                {maxPrice && minPrice && (
                                  <div className="text-xs text-muted-foreground">
                                    {price! > (maxPrice + minPrice) / 2 ? (
                                      <span className="text-green-600 dark:text-green-400 flex items-center justify-end gap-1">
                                        <ArrowUpRight className="h-3 w-3" />
                                        Выше среднего
                                      </span>
                                    ) : (
                                      <span className="text-red-600 dark:text-red-400 flex items-center justify-end gap-1">
                                        <ArrowDownRight className="h-3 w-3" />
                                        Ниже среднего
                                      </span>
                                    )}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-muted-foreground">Нет данных</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="shadow-md3-2 rounded-md3-lg">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  Выберите торговую пару для сравнения
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

