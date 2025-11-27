import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, TrendingUp, TrendingDown, ArrowRight, BarChart3 } from "lucide-react";
import TradingChart from "@/components/dashboard/TradingChart";
import RiskDashboard from "@/components/dashboard/RiskDashboard";

interface MarketData {
  symbol: string;
  price: number | null;
  change: number | null;
  volume: number | null;
  difference: number | null;
  exchanges: number;
}

interface ExchangePrice {
  exchange: string;
  price: number | null;
}

interface SymbolComparison {
  symbol: string;
  prices: Record<string, number | null>;
  maxPrice: number | null;
  minPrice: number | null;
  difference: number | null;
  higherExchange: string | null;
  lowerExchange: string | null;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedSymbol, setSelectedSymbol] = useState("BTC/USDT");

  const { data: markets, isLoading } = useQuery<MarketData[]>({
    queryKey: ["/api/markets"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/markets?limit=10");
      const data = await res.json();
      return data.data || [];
    },
    refetchInterval: 5000,
  });

  const { data: popularSymbols = [] } = useQuery<string[]>({
    queryKey: ["/api/symbols/popular"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/symbols/popular");
      const data = await res.json();
      return data.data || [];
    },
  });

  const { data: comparison, isLoading: isLoadingComparison } = useQuery<SymbolComparison>({
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

  const sortedPrices = comparison
    ? Object.entries(comparison.prices)
        .map(([exchange, price]) => ({
          exchange,
          price: price as number | null,
        }))
        .filter((p) => p.price !== null)
        .sort((a, b) => (b.price || 0) - (a.price || 0))
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <section className="mb-8">
            <Card className="shadow-md3-2 rounded-md3-lg">
              <CardHeader>
                <CardTitle>
                  Добро пожаловать{user ? `, ${user.username}` : ""}!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Ваш портфель готов к торговле
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link href="/wallet">
                    <Button variant="outline" className="rounded-md3-md">
                      Кошелек
                    </Button>
                  </Link>
                  <Link href="/trade">
                    <Button className="rounded-md3-md">
                      Торговля
                    </Button>
                  </Link>
                  <Link href="/comparison">
                    <Button variant="outline" className="rounded-md3-md">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Сравнение бирж
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <TradingChart onSettings={() => {}} />
            <RiskDashboard onSettings={() => {}} />
          </div>

          <section className="mb-8">
            <Card className="shadow-md3-2 rounded-md3-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Сравнение цен по биржам</CardTitle>
                  <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                    <SelectTrigger className="w-40 rounded-md3-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {popularSymbols && popularSymbols.length > 0
                        ? popularSymbols.slice(0, 15).map((symbol) => (
                            <SelectItem key={symbol} value={symbol}>
                              {symbol}
                            </SelectItem>
                          ))
                        : null}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingComparison ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : comparison ? (
                  <>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-surface-container rounded-md3-md">
                        <div className="text-xs text-muted-foreground mb-1">Макс</div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          ${comparison.maxPrice?.toLocaleString("ru-RU", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 6,
                          }) || "-"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {comparison.higherExchange || "-"}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-surface-container rounded-md3-md">
                        <div className="text-xs text-muted-foreground mb-1">Мин</div>
                        <div className="text-lg font-bold text-red-600 dark:text-red-400">
                          ${comparison.minPrice?.toLocaleString("ru-RU", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 6,
                          }) || "-"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {comparison.lowerExchange || "-"}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-surface-container rounded-md3-md">
                        <div className="text-xs text-muted-foreground mb-1">Разница</div>
                        <div className="text-lg font-bold">
                          {comparison.difference !== null
                            ? `${comparison.difference.toFixed(2)}%`
                            : "-"}
                        </div>
                        {comparison.difference !== null && comparison.difference > 1 && (
                          <div className="text-xs text-primary mt-1">
                            Арбитраж
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {EXCHANGES.map((exchange) => {
                        const price = comparison.prices[exchange];
                        const isMax = exchange === comparison.higherExchange;
                        const isMin = exchange === comparison.lowerExchange;

                        return (
                          <div
                            key={exchange}
                            className={`p-3 rounded-md3-md flex items-center justify-between ${
                              isMax
                                ? "bg-green-500/10 border border-green-500/20"
                                : isMin
                                ? "bg-red-500/10 border border-red-500/20"
                                : "bg-surface-container"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-md3-md bg-surface-container-high flex items-center justify-center font-bold text-xs">
                                {exchange.toUpperCase().slice(0, 2)}
                              </div>
                              <span className="font-medium capitalize text-sm">
                                {exchange}
                              </span>
                            </div>
                            <div className="text-right">
                              {price !== null ? (
                                <div className="font-bold">
                                  ${price.toLocaleString("ru-RU", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 6,
                                  })}
                                </div>
                              ) : (
                                <div className="text-muted-foreground text-sm">
                                  Нет данных
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Link href="/comparison">
                      <Button variant="outline" className="w-full mt-4 rounded-md3-md">
                        Подробное сравнение
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    Выберите торговую пару
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <section className="mb-8">
            <Card className="shadow-md3-2 rounded-md3-lg">
              <CardHeader>
                <CardTitle>Рыночные данные</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : markets && markets.length > 0 ? (
                  <div className="space-y-3">
                    {markets.map((market) => (
                      <div
                        key={market.symbol}
                        className="p-4 bg-surface-container rounded-md3-md flex justify-between items-center hover:bg-surface-container-high transition-colors cursor-pointer"
                        onClick={() => setSelectedSymbol(market.symbol)}
                      >
                        <div>
                          <div className="font-medium">{market.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            {market.exchanges} бирж
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {market.price
                              ? `$${market.price.toLocaleString("ru-RU", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 8,
                                })}`
                              : "-"}
                          </div>
                          {market.change !== null && (
                            <div
                              className={`text-sm flex items-center justify-end gap-1 ${
                                market.change >= 0
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {market.change >= 0 ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              <span>
                                {market.change >= 0 ? "+" : ""}
                                {market.change.toFixed(2)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    Нет данных о рынках
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
