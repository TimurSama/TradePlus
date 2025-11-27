import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import { Search, Shield } from "lucide-react";

interface P2POffer {
  id: number;
  user: string;
  asset: string;
  price: string;
  payment: string[];
  available: string;
  limit: string;
  completed: number;
  rating: number;
}

export default function P2PPage() {
  const [offers] = useState<P2POffer[]>([]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-5">P2P Торговля</h1>

          <Tabs defaultValue="buy" className="mb-6">
            <TabsList className="w-full mb-4 rounded-md3-md">
              <TabsTrigger value="buy" className="flex-1">
                Купить
              </TabsTrigger>
              <TabsTrigger value="sell" className="flex-1">
                Продать
              </TabsTrigger>
            </TabsList>

            <Card className="shadow-md3-2 rounded-md3-lg mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <Select defaultValue="BTC">
                    <SelectTrigger className="rounded-md3-md">
                      <SelectValue placeholder="Выберите актив" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC">BTC</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="USDT">USDT</SelectItem>
                      <SelectItem value="SOL">SOL</SelectItem>
                      <SelectItem value="XRP">XRP</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="USD">
                    <SelectTrigger className="rounded-md3-md">
                      <SelectValue placeholder="Валюта" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="JPY">JPY</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="all">
                    <SelectTrigger className="rounded-md3-md">
                      <SelectValue placeholder="Способ оплаты" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все способы</SelectItem>
                      <SelectItem value="bank">Банковский перевод</SelectItem>
                      <SelectItem value="card">Карта</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="revolut">Revolut</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button className="rounded-md3-md">
                    <Search className="h-4 w-4 mr-1" />
                    Поиск
                  </Button>
                </div>

                <Input
                  placeholder="Введите сумму..."
                  className="rounded-md3-md"
                />
              </CardContent>
            </Card>

            <TabsContent value="buy" className="space-y-4 mt-0">
              {offers.length > 0 ? (
                offers.map((offer) => (
                  <Card
                    key={offer.id}
                    className="shadow-md3-2 rounded-md3-lg hover:shadow-md3-3 transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{offer.user}</span>
                            <Badge
                              variant="outline"
                              className="bg-primary/10 text-primary border-0 text-xs"
                            >
                              {offer.rating}% Положительных
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {offer.completed} сделок завершено
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            ${offer.price}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            за {offer.asset}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                        <div>
                          <div className="text-muted-foreground text-xs mb-1">
                            Способы оплаты
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {offer.payment.map((method, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="bg-surface-container text-xs"
                              >
                                {method}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs mb-1">
                            Доступно
                          </div>
                          <div className="font-medium">{offer.available}</div>
                          <div className="text-muted-foreground text-xs">
                            {offer.limit}
                          </div>
                        </div>
                      </div>

                      <Button className="w-full rounded-md3-md">
                        Купить {offer.asset}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="shadow-md3-2 rounded-md3-lg">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Нет доступных предложений
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="sell" className="space-y-4 mt-0">
              <Card className="shadow-md3-2 rounded-md3-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
                    <span className="material-icons text-muted-foreground">
                      storefront
                    </span>
                  </div>
                  <h3 className="text-lg font-medium mb-1">
                    Создать предложение на продажу
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Установите цену и предпочтения по оплате для начала продажи
                    криптовалютных активов
                  </p>
                  <Button className="rounded-md3-md">
                    Создать предложение
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="shadow-md3-2 rounded-md3-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Советы по безопасности P2P торговли
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start">
                  <span className="material-icons text-primary text-xs mr-2 mt-1">
                    check_circle
                  </span>
                  <span>
                    Всегда используйте эскроу-сервис платформы. Никогда не
                    переводите средства вне платформы.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-primary text-xs mr-2 mt-1">
                    check_circle
                  </span>
                  <span>
                    Проверяйте репутацию трейдера и количество завершенных
                    сделок перед началом.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-primary text-xs mr-2 mt-1">
                    check_circle
                  </span>
                  <span>
                    Ведите всю переписку в системе сообщений платформы.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Trader+PLUS P2P соединяет покупателей и продавцов напрямую.
              Платформа выступает в качестве безопасного эскроу-сервиса.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
