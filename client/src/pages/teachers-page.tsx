import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Header from "@/components/layout/Header";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Users, Video, BookOpen, MessageCircle, Star, Calendar, Clock, Play } from "lucide-react";

interface Teacher {
  id: number;
  name: string;
  role: string;
  avatar?: string;
  rating: number;
  students: number;
  courses: number;
  specialties: string[];
  bio: string;
  isOnline: boolean;
  subscriptionRequired: boolean;
}

interface Stream {
  id: number;
  teacherId: number;
  title: string;
  description: string;
  scheduledTime: string;
  duration: number;
  status: "upcoming" | "live" | "ended";
  viewers?: number;
}

interface Lesson {
  id: number;
  teacherId: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  thumbnail?: string;
}

export default function TeachersPage() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("teachers");

  const { data: teachers = [] } = useQuery<Teacher[]>({
    queryKey: ["/api/teachers"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/teachers");
      const data = await res.json();
      return data.data || [];
    },
  });

  const { data: streams = [] } = useQuery<Stream[]>({
    queryKey: ["/api/streams"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/streams");
      const data = await res.json();
      return data.data || [];
    },
    refetchInterval: 30000,
  });

  const { data: lessons = [] } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/lessons");
      const data = await res.json();
      return data.data || [];
    },
  });

  const liveStreams = streams.filter((s) => s.status === "live");
  const upcomingStreams = streams.filter((s) => s.status === "upcoming");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Образовательный центр</h1>
            <p className="text-muted-foreground">
              Учитесь у лучших трейдеров, разработчиков и основателей платформы
            </p>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
            <TabsList className="rounded-md3-md">
              <TabsTrigger value="teachers">
                <Users className="h-4 w-4 mr-2" />
                Учителя
              </TabsTrigger>
              <TabsTrigger value="streams">
                <Video className="h-4 w-4 mr-2" />
                Стримы
              </TabsTrigger>
              <TabsTrigger value="lessons">
                <BookOpen className="h-4 w-4 mr-2" />
                Уроки
              </TabsTrigger>
            </TabsList>

            <TabsContent value="teachers" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachers.map((teacher) => (
                  <Card
                    key={teacher.id}
                    className="shadow-md3-2 rounded-md3-lg hover:shadow-md3-3 transition-shadow"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start mb-4">
                        <div className="relative">
                          <Avatar className="h-16 w-16 border-2 border-primary">
                            <AvatarFallback className="bg-surface-container text-primary">
                              {teacher.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {teacher.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{teacher.name}</h3>
                            {teacher.subscriptionRequired && (
                              <Badge variant="outline" className="bg-primary/10 text-primary border-0">
                                Premium
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {teacher.role}
                          </p>
                          <div className="flex items-center gap-2">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium">
                              {teacher.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {teacher.bio}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {teacher.specialties.slice(0, 3).map((spec, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-surface-container text-xs"
                          >
                            {spec}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Студентов:</span>
                          <span className="font-medium ml-1">{teacher.students}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Курсов:</span>
                          <span className="font-medium ml-1">{teacher.courses}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 rounded-md3-md"
                          onClick={() => {
                            if (teacher.subscriptionRequired && !user?.subscription) {
                              // Показать модальное окно подписки
                              return;
                            }
                            // Перейти к чату с учителем
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Чат
                        </Button>
                        <Button className="flex-1 rounded-md3-md">
                          Профиль
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="streams" className="mt-6">
              {liveStreams.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                    Прямой эфир
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {liveStreams.map((stream) => {
                      const teacher = teachers.find((t) => t.id === stream.teacherId);
                      return (
                        <Card
                          key={stream.id}
                          className="shadow-md3-2 rounded-md3-lg border-2 border-red-500"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start mb-3">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarFallback className="bg-surface-container">
                                  {(teacher?.name || "T")
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h3 className="font-medium mb-1">{stream.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {teacher?.name}
                                </p>
                              </div>
                              <Badge className="bg-red-500 text-white border-0">
                                LIVE
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {stream.description}
                            </p>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center text-muted-foreground">
                                <Users className="h-4 w-4 mr-1" />
                                {stream.viewers || 0} зрителей
                              </div>
                              <Button className="rounded-md3-md">
                                <Video className="h-4 w-4 mr-1" />
                                Смотреть
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Предстоящие стримы
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingStreams.map((stream) => {
                    const teacher = teachers.find((t) => t.id === stream.teacherId);
                    return (
                      <Card
                        key={stream.id}
                        className="shadow-md3-1 rounded-md3-lg hover:shadow-md3-2 transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start mb-3">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback className="bg-surface-container">
                                {(teacher?.name || "T")
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-medium mb-1">{stream.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {teacher?.name}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {stream.description}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(stream.scheduledTime).toLocaleString("ru-RU", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <Button variant="outline" className="rounded-md3-md">
                              Напомнить
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lessons" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lessons.map((lesson) => {
                  const teacher = teachers.find((t) => t.id === lesson.teacherId);
                  return (
                    <Card
                      key={lesson.id}
                      className="shadow-md3-1 rounded-md3-lg hover:shadow-md3-2 transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="h-32 bg-surface-container rounded-md3-md mb-3 flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="flex items-center mb-2">
                          <Badge variant="outline" className="bg-surface-container text-xs mr-2">
                            {lesson.level}
                          </Badge>
                          <Badge variant="outline" className="bg-surface-container text-xs">
                            {lesson.category}
                          </Badge>
                        </div>
                        <h3 className="font-medium mb-1">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {lesson.description}
                        </p>
                        <div className="flex items-center justify-between text-sm mb-3">
                          <div className="flex items-center text-muted-foreground">
                            <span className="material-icons text-xs mr-1">person</span>
                            {teacher?.name || "Преподаватель"}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {lesson.duration}
                          </div>
                        </div>
                        <Button className="w-full rounded-md3-md">
                          <Play className="h-4 w-4 mr-1" />
                          Начать урок
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

