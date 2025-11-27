import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2, TrendingUp, Sync, Shield } from "lucide-react";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");

  useEffect(() => {
    if (user && !isLoading) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 flex flex-col lg:flex-row items-center">
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0 lg:pr-8">
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Trader+PLUS
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Ваш профессиональный торговый опыт
            </p>
            <p className="text-muted-foreground">
              Все-в-одном платформа для крипто, акций и фьючерсов с расширенной
              аналитикой
            </p>
          </div>

          <div className="space-y-4">
            <Card className="shadow-md3-1 rounded-md3-lg">
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-md3-md bg-surface-container flex items-center justify-center border border-primary mr-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      Расширенный анализ рынка
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Визуализация данных в реальном времени с AI-прогнозами
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md3-1 rounded-md3-lg">
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-md3-md bg-surface-container flex items-center justify-center border border-primary mr-3">
                    <Sync className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      Интеграция с несколькими биржами
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Бесшовная торговля на всех крупных биржах
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md3-1 rounded-md3-lg">
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-md3-md bg-surface-container flex items-center justify-center border border-primary mr-3">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      Расширенное управление рисками
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Комплексный дашборд рисков с метриками волатильности
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <Card className="shadow-md3-2 rounded-md3-lg">
            <CardHeader>
              <CardTitle>Вход / Регистрация</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-6 rounded-md3-md">
                  <TabsTrigger value="login">Вход</TabsTrigger>
                  <TabsTrigger value="register">Регистрация</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-0">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">
                      Добро пожаловать
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Войдите в свой аккаунт
                    </p>
                  </div>
                  <LoginForm />
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Нет аккаунта?{" "}
                      <button
                        className="text-primary hover:underline"
                        onClick={() => setActiveTab("register")}
                      >
                        Создать
                      </button>
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="register" className="mt-0">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">
                      Создать аккаунт
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Присоединяйтесь к следующему поколению трейдеров
                    </p>
                  </div>
                  <RegisterForm />
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Уже есть аккаунт?{" "}
                      <button
                        className="text-primary hover:underline"
                        onClick={() => setActiveTab("login")}
                      >
                        Войти
                      </button>
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
