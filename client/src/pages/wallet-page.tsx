import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import { Plus, ArrowDown, ArrowUp } from "lucide-react";

interface Wallet {
  id: number;
  name: string;
  type: string;
  balance: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

export default function WalletPage() {
  const [wallets] = useState<Wallet[]>([]);
  const [connectedServices] = useState([]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          <section className="mb-8">
            <Card className="shadow-md3-2 rounded-md3-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Кошелек</CardTitle>
                  <Button variant="outline" size="sm" className="rounded-md3-md">
                    <Plus className="h-4 w-4 mr-1" />
                    Добавить актив
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    Общий баланс
                  </div>
                  <div className="text-2xl font-bold">$0.00</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Начните с пополнения баланса
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-md3-md">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    Пополнить
                  </Button>
                  <Button className="flex-1 rounded-md3-md">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    Вывести
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-8">
            <Tabs defaultValue="crypto" className="w-full">
              <TabsList className="grid grid-cols-3 rounded-md3-md">
                <TabsTrigger value="crypto">Крипто</TabsTrigger>
                <TabsTrigger value="fiat">Фиат</TabsTrigger>
                <TabsTrigger value="staking">Стейкинг</TabsTrigger>
              </TabsList>

              <TabsContent value="crypto" className="mt-4">
                <Card className="shadow-md3-2 rounded-md3-lg">
                  <CardContent className="p-0">
                    {wallets.length > 0 ? (
                      wallets.map((wallet) => (
                        <div
                          key={wallet.id}
                          className="p-4 border-b last:border-b-0 border-border flex items-center hover:bg-surface-container-low transition-colors cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mr-3">
                            <span className="material-icons text-primary">
                              {wallet.icon}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div className="font-medium">{wallet.name}</div>
                              <div className="font-medium">{wallet.balance}</div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <div className="text-muted-foreground">
                                {wallet.type}
                              </div>
                              <div
                                className={
                                  wallet.isPositive
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }
                              >
                                {wallet.isPositive ? "+" : ""}
                                {wallet.change}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
                          <span className="material-icons text-muted-foreground">
                            account_balance_wallet
                          </span>
                        </div>
                        <h3 className="font-medium mb-1">Нет активов</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Добавьте активы в ваш кошелек
                        </p>
                        <Button className="rounded-md3-md">
                          <Plus className="h-4 w-4 mr-1" />
                          Добавить актив
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fiat" className="mt-4">
                <Card className="shadow-md3-2 rounded-md3-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
                      <span className="material-icons text-muted-foreground">
                        account_balance
                      </span>
                    </div>
                    <h3 className="font-medium text-lg mb-1">
                      Нет фиатных счетов
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Подключите банковский счет или карту для пополнения и
                      вывода фиатной валюты
                    </p>
                    <Button variant="outline" className="rounded-md3-md">
                      <Plus className="h-4 w-4 mr-1" />
                      Добавить банковский счет
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="staking" className="mt-4">
                <Card className="shadow-md3-2 rounded-md3-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
                      <span className="material-icons text-muted-foreground">
                        savings
                      </span>
                    </div>
                    <h3 className="font-medium text-lg mb-1">
                      Нет активов в стейкинге
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Зарабатывайте пассивный доход, размещая криптовалютные
                      активы в стейкинге
                    </p>
                    <Button variant="outline" className="rounded-md3-md">
                      <Plus className="h-4 w-4 mr-1" />
                      Начать стейкинг
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          <section>
            <Card className="shadow-md3-2 rounded-md3-lg">
              <CardHeader>
                <CardTitle>Подключенные сервисы</CardTitle>
              </CardHeader>
              <CardContent>
                {connectedServices.length > 0 ? (
                  <div className="space-y-3">
                    {connectedServices.map((service: any) => (
                      <div
                        key={service.id}
                        className="p-4 border-b last:border-b-0 border-border flex items-center justify-between hover:bg-surface-container-low transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mr-3 text-primary font-bold">
                            {service.icon}
                          </div>
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-sm text-primary">
                              {service.status}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <span className="material-icons">more_vert</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Нет подключенных сервисов
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full mt-4 rounded-md3-md"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Подключить новый сервис
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
