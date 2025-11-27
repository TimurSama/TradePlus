import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { Loader2, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";

interface MarketData {
  symbol: string;
  price: number | null;
  change: number | null;
  volume: number | null;
  difference: number | null;
  exchanges: number;
}

export default function HomePage() {
  const { data: markets, isLoading } = useQuery<MarketData[]>({
    queryKey: ["/api/markets"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/markets?limit=20");
      const data = await res.json();
      return data.data || [];
    },
    refetchInterval: 5000, // Обновление каждые 5 секунд
  });

  const { data: exchanges } = useQuery<string[]>({
    queryKey: ["/api/exchanges"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/exchanges");
      const data = await res.json();
      return data.data || [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="py-8 mb-8">
            <h1 className="text-4xl font-bold mb-2">Трекинг цен токенов</h1>
            <p className="text-muted-foreground text-lg">
              Отслеживайте цены на всех крупных биржах в реальном времени
            </p>
            {exchanges && exchanges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {exchanges.map((exchange) => (
                  <span
                    key={exchange}
                    className="px-3 py-1 bg-surface-container rounded-md3-md text-sm"
                  >
                    {exchange}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Markets Table */}
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
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium">Токен</th>
                        <th className="text-right py-3 px-4 font-medium">Цена</th>
                        <th className="text-right py-3 px-4 font-medium">Изменение</th>
                        <th className="text-right py-3 px-4 font-medium">Разница</th>
                        <th className="text-right py-3 px-4 font-medium">Биржи</th>
                        <th className="text-right py-3 px-4 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {markets.map((market) => (
                        <tr
                          key={market.symbol}
                          className="border-b border-border hover:bg-surface-container-low transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="font-medium">{market.symbol}</div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {market.price
                              ? `$${market.price.toLocaleString("ru-RU", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 8,
                                })}`
                              : "-"}
                          </td>
                          <td className="py-4 px-4 text-right">
                            {market.change !== null ? (
                              <div
                                className={`flex items-center justify-end gap-1 ${
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
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            {market.difference !== null ? (
                              <span className="text-primary font-medium">
                                {market.difference.toFixed(2)}%
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-muted-foreground">
                              {market.exchanges}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Link href={`/trade?symbol=${market.symbol}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-md3-md"
                              >
                                <ArrowUpRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Нет данных о рынках
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard">
              <Card className="hover:shadow-md3-3 transition-shadow cursor-pointer rounded-md3-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Дашборд</h3>
                  <p className="text-sm text-muted-foreground">
                    Полный обзор вашего портфеля и аналитика
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/trade">
              <Card className="hover:shadow-md3-3 transition-shadow cursor-pointer rounded-md3-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Торговля</h3>
                  <p className="text-sm text-muted-foreground">
                    Торгуйте на всех подключенных биржах
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/profile">
              <Card className="hover:shadow-md3-3 transition-shadow cursor-pointer rounded-md3-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Профиль</h3>
                  <p className="text-sm text-muted-foreground">
                    Настройте свой аккаунт и предпочтения
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
