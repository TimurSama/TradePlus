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
import { Newspaper, Building2, Globe, User, Heart, MessageCircle, Share2, Bookmark } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  category: "platform" | "exchange" | "international" | "user";
  source?: string;
  publishedAt: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  tags: string[];
}

export default function NewsPage() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("all");

  const { data: news = [], refetch } = useQuery<NewsItem[]>({
    queryKey: ["/api/news"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/news?limit=50");
      const data = await res.json();
      return data.data || [];
    },
    refetchInterval: 60000,
  });

  const platformNews = news.filter((item) => item.category === "platform");
  const exchangeNews = news.filter((item) => item.category === "exchange");
  const internationalNews = news.filter((item) => item.category === "international");
  const userNews = news.filter((item) => item.category === "user");

  const handleLike = async (newsId: number) => {
    if (!user) return;
    try {
      await apiRequest("POST", `/api/news/${newsId}/like`);
      refetch();
    } catch (error) {
      // Ошибка обрабатывается автоматически
    }
  };

  const handleBookmark = async (newsId: number) => {
    if (!user) return;
    try {
      await apiRequest("POST", `/api/news/${newsId}/bookmark`);
      refetch();
    } catch (error) {
      // Ошибка обрабатывается автоматически
    }
  };

  const NewsCard = ({ item }: { item: NewsItem }) => (
    <Card className="shadow-md3-1 rounded-md3-lg hover:shadow-md3-2 transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start mb-3">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarFallback className="bg-surface-container">
              {(item.author || "N")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{item.author}</span>
              {item.source && (
                <Badge variant="outline" className="bg-surface-container text-xs">
                  {item.source}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(item.publishedAt).toLocaleString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {item.imageUrl && (
          <div className="h-48 bg-surface-container rounded-md3-md mb-3 flex items-center justify-center">
            <Newspaper className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
        <p className="text-muted-foreground mb-3 line-clamp-3">{item.content}</p>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.map((tag, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="bg-surface-container text-xs"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(item.id)}
              className={`flex items-center gap-1 text-sm ${
                item.isLiked
                  ? "text-red-600 dark:text-red-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${item.isLiked ? "fill-current" : ""}`}
              />
              {item.likes || 0}
            </button>
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <MessageCircle className="h-4 w-4" />
              {item.comments || 0}
            </button>
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => handleBookmark(item.id)}
            className={`${
              item.isBookmarked
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bookmark
              className={`h-4 w-4 ${item.isBookmarked ? "fill-current" : ""}`}
            />
          </button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Лента новостей</h1>
            <p className="text-muted-foreground">
              Оставайтесь в курсе последних событий в мире криптовалют
            </p>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
            <TabsList className="rounded-md3-md">
              <TabsTrigger value="all">
                <Newspaper className="h-4 w-4 mr-2" />
                Все
              </TabsTrigger>
              <TabsTrigger value="platform">
                <Building2 className="h-4 w-4 mr-2" />
                Платформа
              </TabsTrigger>
              <TabsTrigger value="exchange">
                <Building2 className="h-4 w-4 mr-2" />
                Биржи
              </TabsTrigger>
              <TabsTrigger value="international">
                <Globe className="h-4 w-4 mr-2" />
                Международные
              </TabsTrigger>
              <TabsTrigger value="user">
                <User className="h-4 w-4 mr-2" />
                Пользователи
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-4">
                {news.length > 0 ? (
                  news.map((item) => <NewsCard key={item.id} item={item} />)
                ) : (
                  <Card className="shadow-md3-1 rounded-md3-lg">
                    <CardContent className="p-8 text-center">
                      <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Нет новостей</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="platform" className="mt-6">
              <div className="space-y-4">
                {platformNews.length > 0 ? (
                  platformNews.map((item) => <NewsCard key={item.id} item={item} />)
                ) : (
                  <Card className="shadow-md3-1 rounded-md3-lg">
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">
                        Нет новостей платформы
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="exchange" className="mt-6">
              <div className="space-y-4">
                {exchangeNews.length > 0 ? (
                  exchangeNews.map((item) => <NewsCard key={item.id} item={item} />)
                ) : (
                  <Card className="shadow-md3-1 rounded-md3-lg">
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">Нет новостей бирж</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="international" className="mt-6">
              <div className="space-y-4">
                {internationalNews.length > 0 ? (
                  internationalNews.map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))
                ) : (
                  <Card className="shadow-md3-1 rounded-md3-lg">
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">
                        Нет международных новостей
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="user" className="mt-6">
              <div className="space-y-4">
                {userNews.length > 0 ? (
                  userNews.map((item) => <NewsCard key={item.id} item={item} />)
                ) : (
                  <Card className="shadow-md3-1 rounded-md3-lg">
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">
                        Нет публикаций пользователей
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

