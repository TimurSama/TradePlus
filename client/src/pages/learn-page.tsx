import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/layout/Header";
import { BookOpen, Play, Award } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  progress: number;
  lessons: number;
  duration: string;
  instructor: string;
}

export default function LearnPage() {
  const [courses] = useState<Course[]>([]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-8">
            <Card className="shadow-md3-2 rounded-md3-lg">
              <CardHeader>
                <CardTitle>Образовательный центр</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Ваш прогресс</span>
                    </div>
                    <span className="text-sm text-muted-foreground">0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Card className="bg-surface-container">
                    <CardContent className="p-3 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-lg font-bold">0</span>
                      <span className="text-xs text-muted-foreground">
                        Курсов начато
                      </span>
                    </CardContent>
                  </Card>

                  <Card className="bg-surface-container">
                    <CardContent className="p-3 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-lg font-bold">0</span>
                      <span className="text-xs text-muted-foreground">
                        Сертификатов
                      </span>
                    </CardContent>
                  </Card>
                </div>

                <Button className="w-full rounded-md3-md">
                  <Play className="h-4 w-4 mr-1" />
                  Начать обучение
                </Button>
              </CardContent>
            </Card>
          </section>

          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Ваши курсы</h2>
              <Button variant="ghost" size="sm" className="rounded-md3-md">
                Показать все
              </Button>
            </div>

            {courses.length > 0 ? (
              <div className="space-y-4">
                {courses.map((course) => (
                  <Card
                    key={course.id}
                    className="shadow-md3-2 rounded-md3-lg hover:shadow-md3-3 transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{course.title}</h3>
                        <div className="px-2 py-0.5 bg-surface-container rounded-full text-xs text-primary">
                          {course.level}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {course.description}
                      </p>

                      <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          <span>{course.lessons} Уроков</span>
                        </div>
                        <div className="flex items-center">
                          <span className="material-icons text-xs mr-1">
                            schedule
                          </span>
                          <span>{course.duration}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full bg-surface-container mr-1"></div>
                          <span className="text-xs">{course.instructor}</span>
                        </div>
                        <span className="text-xs">
                          {course.progress}% Завершено
                        </span>
                      </div>

                      <Progress value={course.progress} className="h-1 mb-3" />

                      <Button
                        className="w-full rounded-md3-md"
                        variant={course.progress > 0 ? "default" : "outline"}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        {course.progress > 0 ? "Продолжить" : "Начать"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-md3-2 rounded-md3-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-1">Нет активных курсов</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Начните обучение, выбрав курс из каталога
                  </p>
                  <Button className="rounded-md3-md">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Просмотреть каталог
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Рекомендуемые</h2>
              <Button variant="ghost" size="sm" className="rounded-md3-md">
                Показать все
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Card className="shadow-md3-2 rounded-md3-lg">
                <CardContent className="p-4">
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-surface-container rounded-full text-xs text-primary">
                    Популярно
                  </div>

                  <h3 className="font-medium mb-1">
                    Основы алгоритмической торговли
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Узнайте, как создавать, тестировать и развертывать
                    автоматизированные торговые стратегии
                  </p>

                  <div className="flex items-center text-xs text-muted-foreground mb-4">
                    <div className="flex items-center mr-3">
                      <BookOpen className="h-3 w-3 mr-1" />
                      <span>20 Уроков</span>
                    </div>
                    <div className="flex items-center">
                      <span className="material-icons text-xs mr-1">
                        schedule
                      </span>
                      <span>6 часов</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full rounded-md3-md">
                    <span className="material-icons text-sm mr-1">add_circle</span>
                    Добавить в библиотеку
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-md3-2 rounded-md3-lg">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-1">
                    Мастерство управления рисками
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Продвинутые техники для защиты капитала и максимизации
                    прибыли
                  </p>

                  <div className="flex items-center text-xs text-muted-foreground mb-4">
                    <div className="flex items-center mr-3">
                      <BookOpen className="h-3 w-3 mr-1" />
                      <span>15 Уроков</span>
                    </div>
                    <div className="flex items-center">
                      <span className="material-icons text-xs mr-1">
                        schedule
                      </span>
                      <span>4.5 часа</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full rounded-md3-md">
                    <span className="material-icons text-sm mr-1">add_circle</span>
                    Добавить в библиотеку
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
