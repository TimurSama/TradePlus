import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/layout/Header";
import { Link } from "wouter";
import { Star, TrendingUp, Shield, School, Handshake, Map, CheckCircle } from "lucide-react";

export default function OverviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="mb-8">
            <Card className="shadow-md3-3 rounded-md3-lg">
              <CardContent className="p-6">
                <h1 className="text-3xl font-bold mb-2">
                  Революционный Trading Experience
                </h1>
                <p className="text-muted-foreground text-lg mb-6">
                  Универсальная платформа для профессиональных и начинающих
                  трейдеров
                </p>

                <div className="bg-surface-container rounded-md3-lg p-4 mb-6">
                  <div className="h-48 flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Интерактивная демонстрация
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  <Link href="/dashboard">
                    <Button className="rounded-md3-md">
                      Попробовать демо-версию
                    </Button>
                  </Link>
                  <Link href="#platform-power">
                    <Button variant="outline" className="rounded-md3-md">
                      Узнать больше
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Value Proposition Section */}
          <section className="mb-8" id="platform-power">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-primary" />
              Мощность платформы
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <Card className="shadow-md3-1 rounded-md3-lg hover:shadow-md3-2 transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-md3-md bg-surface-container flex items-center justify-center border border-primary mr-3">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">
                        Расширенный анализ рынка
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Визуализация данных в реальном времени с AI-прогнозами и
                        анализом ликвидности
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md3-1 rounded-md3-lg hover:shadow-md3-2 transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-md3-md bg-surface-container flex items-center justify-center border border-primary mr-3">
                      <span className="material-icons text-primary">sync</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">
                        Интеграция с несколькими биржами
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Бесшовная торговля на всех крупных биржах с единым
                        отслеживанием портфеля
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md3-1 rounded-md3-lg hover:shadow-md3-2 transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-md3-md bg-surface-container flex items-center justify-center border border-primary mr-3">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">
                        Расширенное управление рисками
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Комплексный дашборд рисков с метриками волатильности и
                        автоматизацией стоп-лоссов
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md3-1 rounded-md3-lg hover:shadow-md3-2 transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-md3-md bg-surface-container flex items-center justify-center border border-primary mr-3">
                      <School className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">
                        Образовательный хаб
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Персонализированные пути обучения с практическими
                        упражнениями и менторством экспертов
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Dashboard Preview Section */}
          <section className="mb-8">
            <Card className="shadow-md3-2 rounded-md3-lg">
              <CardHeader>
                <CardTitle>Мощный дашборд</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Card className="bg-surface-container rounded-md3-md p-3 h-36">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium">НОВОСТИ</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Лента новостей о рынке
                    </div>
                  </Card>

                  <Card className="bg-surface-container rounded-md3-md p-3 h-36">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium">ЦЕНЫ</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Таблица цен в реальном времени
                    </div>
                  </Card>

                  <Card className="bg-surface-container rounded-md3-md p-3 h-36">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium">ГРАФИКИ</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Торговые графики
                    </div>
                  </Card>

                  <Card className="bg-surface-container rounded-md3-md p-3 h-36">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium">РИСКИ</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Дашборд рисков
                    </div>
                  </Card>
                </div>

                <Link href="/dashboard">
                  <Button className="w-full rounded-md3-md">
                    Открыть полный дашборд
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>

          {/* Roadmap Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Map className="h-5 w-5 mr-2 text-primary" />
              Дорожная карта разработки
            </h2>

            <div className="relative pl-6">
              <div className="absolute left-0 top-0 h-full w-0.5 bg-primary/30"></div>

              <div className="mb-5 relative">
                <div className="absolute -left-[25px] w-5 h-5 rounded-full bg-background border-2 border-primary"></div>
                <Card className="shadow-md3-1 rounded-md3-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary font-medium">Q1 2023</span>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-0">
                        ЗАВЕРШЕНО
                      </Badge>
                    </div>
                    <h3 className="font-medium mb-1">Запуск основной платформы</h3>
                    <p className="text-muted-foreground text-sm">
                      Базовая торговая функциональность с данными в реальном
                      времени с крупных бирж
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-5 relative">
                <div className="absolute -left-[25px] w-5 h-5 rounded-full bg-background border-2 border-primary"></div>
                <Card className="shadow-md3-1 rounded-md3-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary font-medium">Q3 2023</span>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-0">
                        ЗАВЕРШЕНО
                      </Badge>
                    </div>
                    <h3 className="font-medium mb-1">
                      Интеграция расширенной аналитики
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      AI-прогнозы рынка, продвинутые инструменты графиков и
                      образовательные материалы
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-5 relative">
                <div className="absolute -left-[25px] w-5 h-5 rounded-full bg-background border-2 border-primary"></div>
                <Card className="shadow-md3-1 rounded-md3-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary font-medium">Q1 2024</span>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-0">
                        ТЕКУЩИЙ
                      </Badge>
                    </div>
                    <h3 className="font-medium mb-1">
                      Социальная торговля и сообщества
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Функции копирования сделок, соревнования сообщества и
                      рейтинговая система трейдеров
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="relative">
                <div className="absolute -left-[25px] w-5 h-5 rounded-full bg-background border-2 border-border"></div>
                <Card className="shadow-md3-1 rounded-md3-lg">
                  <CardContent className="p-4">
                    <div className="text-muted-foreground font-medium mb-1">
                      Q4 2024
                    </div>
                    <h3 className="font-medium mb-1">
                      Инструменты институционального уровня
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Расширенное управление рисками, API-доступ для
                      институциональных трейдеров и алгоритмическая торговля
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Partnership Value Section */}
          <section className="mb-8">
            <Card className="shadow-md3-2 rounded-md3-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Handshake className="h-5 w-5 mr-2" />
                  Ценность для партнеров
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">
                    Для образовательных лидеров
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">
                          Эксклюзивный доступ к учебной программе
                        </h4>
                        <p className="text-muted-foreground text-xs">
                          Предоставьте вашим студентам ведущее торговое
                          образование и практические инструменты
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">
                          Институциональный аналитический дашборд
                        </h4>
                        <p className="text-muted-foreground text-xs">
                          Отслеживайте прогресс студентов с комплексной
                          аналитикой и метриками производительности
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">
                          Модель распределения доходов
                        </h4>
                        <p className="text-muted-foreground text-xs">
                          Зарабатывайте комиссию на обновлениях студентов
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">
                    Для отраслевых партнеров
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">
                          White-Label решения
                        </h4>
                        <p className="text-muted-foreground text-xs">
                          Настройте и переименуйте нашу платформу под вашу
                          организацию
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">
                          API интеграция
                        </h4>
                        <p className="text-muted-foreground text-xs">
                          Бесшовно подключите ваши существующие системы к нашей
                          торговой инфраструктуре
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">
                          Совместные маркетинговые возможности
                        </h4>
                        <p className="text-muted-foreground text-xs">
                          Совместные рекламные кампании и общая видимость
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full rounded-md3-md">
                  Запросить информацию о партнерстве
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Education Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <School className="h-5 w-5 mr-2 text-primary" />
              Образовательная экосистема
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <Card className="shadow-md3-2 rounded-md3-lg">
                <CardContent className="p-5">
                  <h3 className="font-medium mb-3">
                    Комплексные обучающие модули
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="bg-surface-container">
                      Начинающий
                    </Badge>
                    <Badge variant="outline" className="bg-surface-container">
                      Средний
                    </Badge>
                    <Badge variant="outline" className="bg-surface-container">
                      Продвинутый
                    </Badge>
                    <Badge variant="outline" className="bg-surface-container">
                      Эксперт
                    </Badge>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4">
                    Прогрессивные образовательные треки, адаптированные к
                    различным стилям торговли и уровням опыта, с практическими
                    упражнениями и симуляциями реального рынка.
                  </p>

                  <Progress value={75} className="h-1 mb-2" />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      75% пользователей завершают базовое обучение
                    </span>
                    <span className="text-muted-foreground">300+ уроков</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md3-1 rounded-md3-lg">
                <CardContent className="p-5">
                  <h3 className="font-medium mb-2">
                    Для преподавателей и менторов
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Создавайте индивидуальные курсы, отслеживайте прогресс
                    студентов и создавайте репутацию в сообществе Trader+PLUS.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="bg-surface-container rounded-md3-md p-3 flex-1">
                      <div className="flex items-center mb-2">
                        <span className="material-icons text-primary mr-2">
                          person
                        </span>
                        <span className="text-sm font-medium">
                          Стать инструктором
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Делитесь экспертизой и зарабатывайте на курсах
                      </p>
                    </div>

                    <div className="bg-surface-container rounded-md3-md p-3 flex-1">
                      <div className="flex items-center mb-2">
                        <span className="material-icons text-primary mr-2">
                          groups
                        </span>
                        <span className="text-sm font-medium">
                          Создать торговые сообщества
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Создавайте и управляйте эксклюзивными торговыми группами
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Call To Action */}
          <section className="mb-8">
            <Card className="shadow-md3-3 rounded-md3-lg">
              <CardContent className="p-6">
                <div className="text-center mb-5">
                  <h2 className="text-xl font-bold mb-2">
                    Готовы изменить свою торговлю?
                  </h2>
                  <p className="text-muted-foreground">
                    Присоединяйтесь к следующему поколению трейдеров и
                    инвесторов
                  </p>
                </div>

                <div className="flex flex-col gap-3 mb-5">
                  <Link href="/dashboard">
                    <Button className="w-full rounded-md3-md">
                      Попробовать демо сейчас
                    </Button>
                  </Link>

                  <Link href="/learn">
                    <Button variant="outline" className="w-full rounded-md3-md">
                      Изучить образовательные ресурсы
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-surface-container border border-primary"></div>
                    <div className="w-8 h-8 rounded-full bg-surface-container border border-primary"></div>
                    <div className="w-8 h-8 rounded-full bg-surface-container border border-primary"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    +2,500 трейдеров присоединились в этом месяце
                  </span>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
