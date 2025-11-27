import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Header from "@/components/layout/Header";
import { TrendingUp, Mail } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-8">
            <Card className="shadow-md3-2 rounded-md3-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-md3-md bg-surface-container flex items-center justify-center border-2 border-primary mr-4">
                    <TrendingUp className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Trader+PLUS</h1>
                    <p className="text-muted-foreground">
                      Торговая экосистема нового поколения
                    </p>
                  </div>
                </div>

                <p className="text-foreground mb-6">
                  Trader+PLUS — комплексная торговая платформа, созданная для
                  поддержки как начинающих, так и опытных трейдеров с
                  расширенной аналитикой, образовательными ресурсами и функциями
                  социальной торговли в единой экосистеме.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-0">
                    Все-в-одном
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-0">
                    AI-аналитика
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-0">
                    Образовательный центр
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-0">
                    Социальная торговля
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-0">
                    Управление рисками
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-surface-container p-3 rounded-md3-md">
                    <div className="text-2xl font-bold text-primary">9+</div>
                    <div className="text-xs text-muted-foreground">Бирж</div>
                  </div>
                  <div className="bg-surface-container p-3 rounded-md3-md">
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-xs text-muted-foreground">Поддержка</div>
                  </div>
                  <div className="bg-surface-container p-3 rounded-md3-md">
                    <div className="text-2xl font-bold text-primary">100K+</div>
                    <div className="text-xs text-muted-foreground">Пользователей</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Tabs defaultValue="features" className="mb-8">
            <TabsList className="w-full mb-4 rounded-md3-md">
              <TabsTrigger value="features" className="flex-1">
                Ключевые функции
              </TabsTrigger>
              <TabsTrigger value="mission" className="flex-1">
                Наша миссия
              </TabsTrigger>
              <TabsTrigger value="team" className="flex-1">
                Команда
              </TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="mt-0">
              <Card className="shadow-md3-2 rounded-md3-lg mb-4">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <FeatureItem
                      icon="analytics"
                      title="Расширенный анализ рынка"
                      description="AI-аналитика с визуализацией данных в реальном времени, анализом настроений и распознаванием рыночных паттернов для выявления торговых возможностей."
                    />

                    <FeatureItem
                      icon="school"
                      title="Комплексная обучающая платформа"
                      description="Структурированный образовательный контент для всех уровней опыта с интерактивными уроками, тестами и симуляциями торговли."
                    />

                    <FeatureItem
                      icon="shield"
                      title="Инструменты управления рисками"
                      description="Продвинутые функции оценки и управления рисками, включая стресс-тестирование портфеля, автоматические стоп-лоссы и анализ экспозиции."
                    />

                    <FeatureItem
                      icon="people"
                      title="Социальная торговая сеть"
                      description="Общайтесь с другими трейдерами, делитесь инсайтами, следите за успешными стратегиями и участвуйте в торговых соревнованиях."
                    />

                    <FeatureItem
                      icon="sync"
                      title="Интеграция с несколькими биржами"
                      description="Торгуйте на нескольких биржах из единого интерфейса с объединенным видом портфеля и синхронизированным управлением ордерами."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mission" className="mt-0">
              <Card className="shadow-md3-2 rounded-md3-lg mb-4">
                <CardContent className="p-5">
                  <h3 className="text-xl font-semibold mb-4">
                    Наша миссия и видение
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-primary mb-2">
                        Демократизация торговых знаний
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        Мы верим, что каждый должен иметь доступ к качественному
                        финансовому образованию и торговым инструментам. Наша
                        миссия — выровнять игровое поле, предоставляя
                        аналитику институционального уровня и образовательные
                        ресурсы всем трейдерам.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-primary mb-2">
                        Создание глобального торгового сообщества
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        Торговля не должна быть уединенной деятельностью. Мы
                        создаем совместную экосистему, где трейдеры могут
                        учиться друг у друга, делиться инсайтами и расти вместе.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-primary mb-2">
                        Пропаганда ответственной торговли
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        Мы продвигаем ответственный подход к торговле, который
                        ставит во главу угла управление рисками, непрерывное
                        образование и разработку долгосрочных стратегий.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <p className="text-sm italic text-center text-muted-foreground">
                        "Наше видение — стать ведущей торговой экосистемой
                        все-в-одном в мире, давая возможность миллионам трейдеров
                        достигать своих финансовых целей через образование,
                        технологии и сообщество."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="mt-0">
              <Card className="shadow-md3-2 rounded-md3-lg mb-4">
                <CardContent className="p-5">
                  <h3 className="text-xl font-semibold mb-4">
                    Команда лидеров
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <TeamMember
                      name="Alexandra Chen"
                      role="CEO & Основатель"
                      initials="AC"
                      description="Бывший менеджер хедж-фонда с 15+ годами опыта на финансовых рынках."
                    />

                    <TeamMember
                      name="Michael Rodriguez"
                      role="CTO"
                      initials="MR"
                      description="Бывший исследователь AI в Google с экспертизой в машинном обучении."
                    />

                    <TeamMember
                      name="Sarah Williams"
                      role="Главный образовательный директор"
                      initials="SW"
                      description="Отмеченный наградами финансовый педагог."
                    />

                    <TeamMember
                      name="David Patel"
                      role="Руководитель сообщества"
                      initials="DP"
                      description="Эксперт по построению сообществ."
                    />
                  </div>

                  <div className="text-center text-sm text-muted-foreground mb-4">
                    Поддерживается командой из 45+ профессионалов в области
                    разработки, дизайна, образования, маркетинга и поддержки
                    клиентов.
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline" className="bg-surface-container">
                      YCombinator S22
                    </Badge>
                    <Badge variant="outline" className="bg-surface-container">
                      Sequoia Backed
                    </Badge>
                    <Badge variant="outline" className="bg-surface-container">
                      FinTech Award 2023
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <section>
            <Card className="shadow-md3-2 rounded-md3-lg">
              <CardContent className="p-6">
                <div className="text-center mb-5">
                  <h2 className="text-xl font-bold mb-2">
                    Присоединяйтесь к торговой революции
                  </h2>
                  <p className="text-muted-foreground">
                    Испытайте технологии торговли нового поколения
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Button className="w-full rounded-md3-md">
                    Начать сейчас
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full rounded-md3-md"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Связаться с нами
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex">
      <div className="w-10 h-10 rounded-md3-md bg-surface-container flex items-center justify-center border border-border mr-3 flex-shrink-0">
        <span className="material-icons text-primary">{icon}</span>
      </div>
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}

interface TeamMemberProps {
  name: string;
  role: string;
  initials: string;
  description: string;
}

function TeamMember({ name, role, initials, description }: TeamMemberProps) {
  return (
    <div className="flex flex-col items-center">
      <Avatar className="h-16 w-16 mb-2 border-2 border-primary">
        <AvatarFallback className="bg-surface-container text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>
      <h4 className="font-medium">{name}</h4>
      <div className="text-primary text-xs mb-1">{role}</div>
      <p className="text-muted-foreground text-xs text-center">
        {description}
      </p>
    </div>
  );
}
