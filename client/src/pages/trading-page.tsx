import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function TradingPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const symbol = searchParams.get("symbol") || "BTC/USDT";
  const [orderType, setOrderType] = useState("market");
  const [amount, setAmount] = useState("");

  const { data: priceData, isLoading } = useQuery({
    queryKey: ["/api/prices", symbol],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/prices/${encodeURIComponent(symbol)}`);
      const data = await res.json();
      return data.data || null;
    },
    refetchInterval: 2000,
  });

  const { data: marketData } = useQuery({
    queryKey: ["/api/market-data", symbol],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/market-data/${encodeURIComponent(symbol)}`);
      const data = await res.json();
      return data.data || null;
    },
    refetchInterval: 10000,
  });

  const currentPrice = priceData?.maxPrice || priceData?.minPrice || marketData?.currentPrice || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <section className="mb-6">
            <Card className="shadow-md3-2 rounded-md3-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{symbol}</CardTitle>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mt-2" />
                    ) : (
                      <div className="text-2xl font-bold mt-2">
                        ${currentPrice.toLocaleString("ru-RU", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 8,
                        })}
                      </div>
                    )}
                  </div>
                  <Select defaultValue="1h">
                    <SelectTrigger className="w-24 rounded-md3-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1m</SelectItem>
                      <SelectItem value="5m">5m</SelectItem>
                      <SelectItem value="15m">15m</SelectItem>
                      <SelectItem value="1h">1h</SelectItem>
                      <SelectItem value="4h">4h</SelectItem>
                      <SelectItem value="1d">1d</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-surface-container rounded-md3-md flex items-center justify-center">
                  <p className="text-muted-foreground">График будет здесь</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-6">
            <Tabs defaultValue="spot" className="w-full">
              <TabsList className="grid grid-cols-3 rounded-md3-md">
                <TabsTrigger value="spot">Spot</TabsTrigger>
                <TabsTrigger value="futures">Futures</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
              </TabsList>

              <TabsContent value="spot" className="mt-4">
                <Card className="shadow-md3-2 rounded-md3-lg">
                  <CardContent className="p-6">
                    <div className="flex justify-between mb-4">
                      <Button
                        variant={orderType === "market" ? "default" : "outline"}
                        className="rounded-md3-md"
                        onClick={() => setOrderType("market")}
                      >
                        Market
                      </Button>
                      <Button
                        variant={orderType === "limit" ? "default" : "outline"}
                        className="rounded-md3-md"
                        onClick={() => setOrderType("limit")}
                      >
                        Limit
                      </Button>
                      <Button
                        variant={orderType === "stop" ? "default" : "outline"}
                        className="rounded-md3-md"
                        onClick={() => setOrderType("stop")}
                      >
                        Stop
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {orderType !== "market" && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Цена (USDT)
                          </label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="rounded-md3-md"
                            value={currentPrice}
                            readOnly
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Количество
                        </label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="rounded-md3-md"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {[25, 50, 75, 100].map((percent) => (
                          <Button
                            key={percent}
                            variant="outline"
                            size="sm"
                            className="rounded-md3-md"
                            onClick={() => {
                              // Calculate amount based on balance
                              setAmount("0");
                            }}
                          >
                            {percent}%
                          </Button>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Button className="flex-1 rounded-md3-md bg-green-600 hover:bg-green-700">
                          Купить
                        </Button>
                        <Button className="flex-1 rounded-md3-md bg-red-600 hover:bg-red-700">
                          Продать
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="futures" className="mt-4">
                <Card className="shadow-md3-2 rounded-md3-lg">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      Futures торговля будет доступна после верификации
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="options" className="mt-4">
                <Card className="shadow-md3-2 rounded-md3-lg">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      Options торговля скоро будет доступна
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
}
