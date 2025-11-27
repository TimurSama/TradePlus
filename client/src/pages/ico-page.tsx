import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/layout/Header";
import { Lightbulb } from "lucide-react";

interface ICOProject {
  id: number;
  name: string;
  ticker: string;
  logo: string;
  category: string[];
  description: string;
  raised: number;
  goal: number;
  price: string;
  endDate: string;
  startsIn?: string;
  website: string;
  stage: "upcoming" | "active" | "completed";
}

export default function ICOPage() {
  const [projects] = useState<ICOProject[]>([]);

  const getProgressPercent = (raised: number, goal: number) => {
    return Math.min(Math.round((raised / goal) * 100), 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-5">Токен-сейлы</h1>

          <Tabs defaultValue="active" className="mb-6">
            <TabsList className="mb-4 rounded-md3-md">
              <TabsTrigger value="active">Активные</TabsTrigger>
              <TabsTrigger value="upcoming">Предстоящие</TabsTrigger>
              <TabsTrigger value="completed">Завершенные</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4 mt-0">
              {projects.filter((p) => p.stage === "active").length > 0 ? (
                projects
                  .filter((p) => p.stage === "active")
                  .map((project) => (
                    <Card
                      key={project.id}
                      className="shadow-md3-2 rounded-md3-lg hover:shadow-md3-3 transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-md3-md bg-surface-container flex items-center justify-center border border-primary mr-3">
                              <span className="material-icons text-primary">
                                {project.logo}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium">{project.name}</h3>
                              <div className="flex items-center">
                                <span className="text-xs text-muted-foreground mr-2">
                                  {project.ticker}
                                </span>
                                <div className="flex">
                                  {project.category.map((cat, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="mr-1 text-xs bg-surface-container"
                                    >
                                      {cat}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">
                              {project.price}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Цена токена
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {project.description}
                        </p>

                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>${project.raised.toLocaleString()}</span>
                            <span>${project.goal.toLocaleString()}</span>
                          </div>
                          <Progress
                            value={getProgressPercent(
                              project.raised,
                              project.goal
                            )}
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>
                              {getProgressPercent(project.raised, project.goal)}%
                              Собрано
                            </span>
                            <span>Завершится {project.endDate}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="flex-1 rounded-md3-md"
                              >
                                Детали
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-md3-lg">
                              <DialogHeader>
                                <DialogTitle className="flex items-center">
                                  <span className="material-icons text-primary mr-2">
                                    {project.logo}
                                  </span>
                                  {project.name} ({project.ticker})
                                </DialogTitle>
                                <DialogDescription>
                                  Детали токен-сейла и информация об инвестициях
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-1">
                                    Описание проекта
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {project.description}
                                  </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-xs text-muted-foreground">
                                      Цена токена
                                    </h4>
                                    <p className="font-medium">{project.price}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-xs text-muted-foreground">
                                      Дата окончания
                                    </h4>
                                    <p className="font-medium">
                                      {project.endDate}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-xs text-muted-foreground">
                                      Веб-сайт
                                    </h4>
                                    <p className="font-medium">
                                      {project.website}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-xs text-muted-foreground">
                                      Собрано
                                    </h4>
                                    <p className="font-medium">
                                      ${project.raised.toLocaleString()} / $
                                      {project.goal.toLocaleString()}
                                    </p>
                                  </div>
                                </div>

                                <Button className="w-full rounded-md3-md">
                                  Участвовать в токен-сейле
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button className="flex-1 rounded-md3-md">
                            Инвестировать
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <Card className="shadow-md3-2 rounded-md3-lg">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Нет активных токен-сейлов
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4 mt-0">
              {projects.filter((p) => p.stage === "upcoming").length > 0 ? (
                projects
                  .filter((p) => p.stage === "upcoming")
                  .map((project) => (
                    <Card
                      key={project.id}
                      className="shadow-md3-2 rounded-md3-lg"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-md3-md bg-surface-container flex items-center justify-center border border-primary mr-3">
                              <span className="material-icons text-primary">
                                {project.logo}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium">{project.name}</h3>
                              <div className="flex items-center">
                                <span className="text-xs text-muted-foreground mr-2">
                                  {project.ticker}
                                </span>
                                <div className="flex">
                                  {project.category.map((cat, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="mr-1 text-xs bg-surface-container"
                                    >
                                      {cat}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">
                              {project.price}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Цена токена
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {project.description}
                        </p>

                        <div className="mb-3">
                          <Badge
                            variant="outline"
                            className="bg-primary/10 text-primary border-0 mb-2"
                          >
                            Начнется через {project.startsIn}
                          </Badge>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              Цель: ${project.goal.toLocaleString()}
                            </span>
                            <span>Завершится {project.endDate}</span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full rounded-md3-md"
                        >
                          Установить напоминание
                        </Button>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <Card className="shadow-md3-2 rounded-md3-lg">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Нет предстоящих токен-сейлов
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-0">
              {projects.filter((p) => p.stage === "completed").length > 0 ? (
                projects
                  .filter((p) => p.stage === "completed")
                  .map((project) => (
                    <Card
                      key={project.id}
                      className="shadow-md3-2 rounded-md3-lg"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-md3-md bg-surface-container flex items-center justify-center border border-border mr-3">
                              <span className="material-icons text-muted-foreground">
                                {project.logo}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium">{project.name}</h3>
                              <div className="flex items-center">
                                <span className="text-xs text-muted-foreground mr-2">
                                  {project.ticker}
                                </span>
                                <div className="flex">
                                  {project.category.map((cat, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="mr-1 text-xs bg-surface-container"
                                    >
                                      {cat}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{project.price}</div>
                            <div className="text-xs text-muted-foreground">
                              Финальная цена
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <Badge
                            variant="outline"
                            className="bg-surface-container text-muted-foreground border-0 mb-2"
                          >
                            Сейл завершен
                          </Badge>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              Собрано: ${project.raised.toLocaleString()}
                            </span>
                            <span>Завершен {project.endDate}</span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full rounded-md3-md"
                        >
                          Просмотреть проект
                        </Button>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <Card className="shadow-md3-2 rounded-md3-lg">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Нет завершенных токен-сейлов
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <Card className="shadow-md3-2 rounded-md3-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Зачем инвестировать в токен-сейлы?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start">
                  <span className="material-icons text-primary text-xs mr-2 mt-1">
                    check_circle
                  </span>
                  <span>
                    Ранний доступ к инновационным блокчейн-проектам с высоким
                    потенциалом роста
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-primary text-xs mr-2 mt-1">
                    check_circle
                  </span>
                  <span>
                    Выгодные цены на токены до листинга на биржах и широкого
                    доступа рынка
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-primary text-xs mr-2 mt-1">
                    check_circle
                  </span>
                  <span>
                    Поддержка проектов, соответствующих вашим ценностям и
                    интересам в блокчейн-пространстве
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
