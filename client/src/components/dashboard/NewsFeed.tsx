import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface NewsFeedProps {
  onSettings: () => void;
}

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  time: string;
}

export default function NewsFeed({ onSettings }: NewsFeedProps) {
  const { data: news, isLoading } = useQuery<NewsItem[]>({
    queryKey: ["/api/news"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/news?limit=2");
      const data = await res.json();
      return data.data || [];
    },
    refetchInterval: 30000,
  });

  return (
    <Card className="h-36 shadow-md3-1 rounded-md3-md border-border">
      <CardContent className="p-3 h-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium">НОВОСТИ</span>
          <button
            onClick={onSettings}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="material-icons text-xs">settings</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
        ) : news && news.length > 0 ? (
          <div className="space-y-2 overflow-hidden h-24">
            {news.map((item) => (
              <div
                key={item.id}
                className="text-xs hover:bg-surface-container px-1 py-0.5 rounded transition-colors cursor-pointer"
              >
                <div className="font-medium truncate">{item.title}</div>
                <div className="text-muted-foreground text-[10px] truncate">
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">Нет новостей</div>
        )}
      </CardContent>
    </Card>
  );
}
