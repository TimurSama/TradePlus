import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Header from "@/components/layout/Header";
import { UserPlus, Users, Search } from "lucide-react";

interface Friend {
  id: number;
  name: string;
  username: string;
  avatar?: string;
  status: "online" | "offline";
  lastActive?: string;
  tradeCount: number;
  pnl: string;
  isFavorite: boolean;
}

interface FriendRequest {
  id: number;
  name: string;
  username: string;
  avatar?: string;
  mutualFriends: number;
  date: string;
}

export default function FriendsPage() {
  const [friends] = useState<Friend[]>([]);
  const [requests] = useState<FriendRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFriends = searchTerm
    ? friends.filter(
        (friend) =>
          friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          friend.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : friends;

  const onlineFriends = filteredFriends.filter(
    (friend) => friend.status === "online"
  );
  const favoriteFriends = filteredFriends.filter(
    (friend) => friend.isFavorite
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold">Торговые друзья</h1>
            <Button className="rounded-md3-md">
              <UserPlus className="h-4 w-4 mr-1" />
              Добавить друга
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск друзей..."
                className="rounded-md3-md pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {requests.length > 0 && (
              <Card className="shadow-md3-2 rounded-md3-lg mb-4">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Запросы в друзья</CardTitle>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-0">
                      {requests.length} Новых
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {requests.map((request) => (
                      <div
                        key={request.id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback className="bg-surface-container">
                              {request.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{request.name}</div>
                            <div className="text-xs text-muted-foreground">
                              @{request.username} • {request.mutualFriends}{" "}
                              общих друзей
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-md3-md"
                          >
                            Игнорировать
                          </Button>
                          <Button size="sm" className="rounded-md3-md">
                            Принять
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="mb-4 rounded-md3-md">
              <TabsTrigger value="all">
                Все ({filteredFriends.length})
              </TabsTrigger>
              <TabsTrigger value="online">
                Онлайн ({onlineFriends.length})
              </TabsTrigger>
              <TabsTrigger value="favorites">
                Избранные ({favoriteFriends.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-0">
              {filteredFriends.length > 0 ? (
                filteredFriends.map((friend) => (
                  <FriendCard key={friend.id} friend={friend} />
                ))
              ) : (
                <Card className="shadow-md3-2 rounded-md3-lg">
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Нет друзей</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="online" className="space-y-4 mt-0">
              {onlineFriends.length > 0 ? (
                onlineFriends.map((friend) => (
                  <FriendCard key={friend.id} friend={friend} />
                ))
              ) : (
                <Card className="shadow-md3-2 rounded-md3-lg">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Нет друзей онлайн</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4 mt-0">
              {favoriteFriends.length > 0 ? (
                favoriteFriends.map((friend) => (
                  <FriendCard key={friend.id} friend={friend} />
                ))
              ) : (
                <Card className="shadow-md3-2 rounded-md3-lg">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Нет избранных друзей</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <Card className="shadow-md3-2 rounded-md3-lg mb-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Преимущества социальной торговли
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start">
                  <span className="material-icons text-primary text-xs mr-2 mt-1">
                    check_circle
                  </span>
                  <span>
                    Учитесь у успешных трейдеров, наблюдая за их стратегиями
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-primary text-xs mr-2 mt-1">
                    check_circle
                  </span>
                  <span>
                    Делитесь анализом и рыночными инсайтами с вашей торговой
                    сетью
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-primary text-xs mr-2 mt-1">
                    check_circle
                  </span>
                  <span>
                    Участвуйте в торговых соревнованиях с друзьями за награды
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

interface FriendCardProps {
  friend: Friend;
}

function FriendCard({ friend }: FriendCardProps) {
  return (
    <Card className="shadow-md3-2 rounded-md3-lg hover:shadow-md3-3 transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="relative mr-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-surface-container">
                  {friend.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-background ${
                  friend.status === "online"
                    ? "bg-green-500"
                    : "bg-muted-foreground"
                }`}
              ></div>
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="font-medium mr-2">{friend.name}</h3>
                {friend.isFavorite && (
                  <span className="material-icons text-primary text-xs">
                    favorite
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                @{friend.username}
              </div>
              <div className="text-xs text-muted-foreground">
                {friend.status === "online" ? (
                  <span className="text-green-500">Онлайн</span>
                ) : (
                  <span>Был(а) {friend.lastActive}</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`font-medium ${
                friend.pnl.startsWith("+")
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {friend.pnl}
            </div>
            <div className="text-xs text-muted-foreground">
              {friend.tradeCount} сделок
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            className="flex-1 rounded-md3-md"
          >
            <span className="material-icons text-sm mr-1">visibility</span>
            <span>Профиль</span>
          </Button>
          <Button className="flex-1 rounded-md3-md">
            <span className="material-icons text-sm mr-1">message</span>
            <span>Сообщение</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
