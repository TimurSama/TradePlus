import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Header from "@/components/layout/Header";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Crown, Star, MessageCircle, Users, Award, Zap, Shield } from "lucide-react";

const profileSchema = z.object({
  username: z.string().min(3, "Минимум 3 символа"),
  email: z.string().email("Неверный email").optional().or(z.literal("")),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

type UserLevel = "free" | "basic" | "premium" | "pro" | "vip";
type SubscriptionStatus = "none" | "active" | "expired";

interface UserLevelInfo {
  name: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  price?: number;
}

const USER_LEVELS: Record<UserLevel, UserLevelInfo> = {
  free: {
    name: "Бесплатный",
    icon: <Star className="h-5 w-5" />,
    color: "text-muted-foreground",
    features: [
      "Базовый доступ к платформе",
      "Просмотр рыночных данных",
      "Ограниченные функции обучения",
    ],
  },
  basic: {
    name: "Базовый",
    icon: <Zap className="h-5 w-5" />,
    color: "text-blue-500",
    features: [
      "Все функции бесплатного уровня",
      "Расширенная аналитика",
      "Доступ к базовым курсам",
      "Социальная торговля",
    ],
    price: 9.99,
  },
  premium: {
    name: "Премиум",
    icon: <Crown className="h-5 w-5" />,
    color: "text-yellow-500",
    features: [
      "Все функции базового уровня",
      "Приватный чат с учителями",
      "Доступ к премиум курсам",
      "Приоритетная поддержка",
      "Эксклюзивные стримы",
    ],
    price: 29.99,
  },
  pro: {
    name: "Профессионал",
    icon: <Award className="h-5 w-5" />,
    color: "text-purple-500",
    features: [
      "Все функции премиум уровня",
      "Приватный чат с трейдерами",
      "Персональное менторство",
      "API доступ",
      "Расширенная аналитика",
    ],
    price: 99.99,
  },
  vip: {
    name: "VIP",
    icon: <Shield className="h-5 w-5" />,
    color: "text-primary",
    features: [
      "Все функции профессионального уровня",
      "Приватный чат с разработчиками",
      "Приватный чат с основателями",
      "Ранний доступ к новым функциям",
      "Персональный менеджер",
      "Эксклюзивные события",
    ],
    price: 299.99,
  },
};

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(!user);
  const [userLevel, setUserLevel] = useState<UserLevel>(
    (user as any)?.subscriptionLevel || "free"
  );
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>(
    (user as any)?.subscriptionLevel && (user as any)?.subscriptionLevel !== "free"
      ? "active"
      : "none"
  );

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: (user as any)?.email || "",
      firstName: (user as any)?.firstName || "",
      lastName: (user as any)?.lastName || "",
      phone: (user as any)?.phone || "",
    },
  });

  const onSubmit = async (data: ProfileValues) => {
    try {
      const res = await apiRequest("PUT", "/api/user", {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });
      const json = await res.json();
      if (json.success) {
        setIsEditing(false);
        toast({
          title: "Профиль обновлен",
          description: "Ваши данные успешно сохранены",
        });
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось сохранить профиль",
        variant: "destructive",
      });
    }
  };

  const currentLevel = USER_LEVELS[userLevel];
  const nextLevel = userLevel !== "vip" ? USER_LEVELS[getNextLevel(userLevel)] : null;

  function getNextLevel(level: UserLevel): UserLevel {
    const levels: UserLevel[] = ["free", "basic", "premium", "pro", "vip"];
    const currentIndex = levels.indexOf(level);
    return levels[Math.min(currentIndex + 1, levels.length - 1)] as UserLevel;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="mb-6">
            <TabsList className="rounded-md3-md">
              <TabsTrigger value="profile">Профиль</TabsTrigger>
              <TabsTrigger value="subscription">Подписка</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card className="shadow-md3-2 rounded-md3-lg">
                <CardHeader>
                  <CardTitle>Личный кабинет</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Имя пользователя</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Введите имя пользователя"
                                className="rounded-md3-md"
                                disabled={!isEditing}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Введите email"
                                className="rounded-md3-md"
                                disabled={!isEditing}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Имя</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Имя"
                                  className="rounded-md3-md"
                                  disabled={!isEditing}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Фамилия</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Фамилия"
                                  className="rounded-md3-md"
                                  disabled={!isEditing}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Телефон</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="+7 (999) 999-99-99"
                                className="rounded-md3-md"
                                disabled={!isEditing}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-3">
                        {isEditing ? (
                          <>
                            <Button
                              type="submit"
                              className="flex-1 rounded-md3-md"
                            >
                              Сохранить
                            </Button>
                            {user && (
                              <Button
                                type="button"
                                variant="outline"
                                className="rounded-md3-md"
                                onClick={() => {
                                  setIsEditing(false);
                                  form.reset();
                                }}
                              >
                                Отмена
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 rounded-md3-md"
                            onClick={() => setIsEditing(true)}
                          >
                            Редактировать
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="mt-6">
              <div className="space-y-6">
                <Card className="shadow-md3-2 rounded-md3-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Текущий уровень</CardTitle>
                      <Badge
                        variant="outline"
                        className={`${currentLevel.color} border-current`}
                      >
                        <div className="flex items-center gap-2">
                          {currentLevel.icon}
                          {currentLevel.name}
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="font-medium mb-3">Доступные функции:</div>
                      {currentLevel.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="material-icons text-primary text-sm mt-0.5">
                            check_circle
                          </span>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {nextLevel && (
                  <Card className="shadow-md3-2 rounded-md3-lg border-2 border-primary">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Следующий уровень</CardTitle>
                        <Badge className="bg-primary text-primary-foreground">
                          <div className="flex items-center gap-2">
                            {nextLevel.icon}
                            {nextLevel.name}
                          </div>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="font-medium mb-3">Дополнительные функции:</div>
                          {nextLevel.features
                            .filter(
                              (f) => !currentLevel.features.includes(f)
                            )
                            .map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="material-icons text-primary text-sm mt-0.5">
                                  add_circle
                                </span>
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                        </div>
                        {nextLevel.price && (
                          <div className="pt-4 border-t border-border">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-2xl font-bold">
                                ${nextLevel.price}
                              </span>
                              <span className="text-muted-foreground">/месяц</span>
                            </div>
                            <Button className="w-full rounded-md3-md">
                              <Crown className="h-4 w-4 mr-2" />
                              Перейти на {nextLevel.name}
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="shadow-md3-1 rounded-md3-lg">
                  <CardHeader>
                    <CardTitle>Все уровни</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(USER_LEVELS).map(([level, info]) => (
                        <Card
                          key={level}
                          className={`shadow-md3-1 rounded-md3-md ${
                            level === userLevel
                              ? "border-2 border-primary"
                              : "border-border"
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <div className={info.color}>{info.icon}</div>
                              <div className="font-medium">{info.name}</div>
                            </div>
                            {info.price && (
                              <div className="text-lg font-bold mb-2">
                                ${info.price}
                                <span className="text-sm text-muted-foreground font-normal">
                                  /мес
                                </span>
                              </div>
                            )}
                            <Button
                              variant={level === userLevel ? "default" : "outline"}
                              className="w-full rounded-md3-md mt-2"
                              disabled={level === userLevel}
                            >
                              {level === userLevel ? "Текущий" : "Выбрать"}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
