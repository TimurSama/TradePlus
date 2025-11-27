import { useState } from "react";
import NewsFeed from "./NewsFeed";
import PriceTable from "./PriceTable";
import TradingChart from "./TradingChart";
import RiskDashboard from "./RiskDashboard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Maximize2, Minimize2 } from "lucide-react";

interface DashboardPanelProps {
  fullscreen?: boolean;
}

type PanelType = "news" | "prices" | "chart" | "risk";
type PanelConfig = {
  [key: string]: PanelType;
};

export default function DashboardPanel({ fullscreen = false }: DashboardPanelProps) {
  const [panelConfig, setPanelConfig] = useState<PanelConfig>({
    panel1: "news",
    panel2: "prices",
    panel3: "chart",
    panel4: "risk",
  });

  const [isFullscreen, setIsFullscreen] = useState(fullscreen);

  const renderPanel = (panelId: string, type: PanelType) => {
    switch (type) {
      case "news":
        return <NewsFeed onSettings={() => openSettings(panelId)} />;
      case "prices":
        return <PriceTable onSettings={() => openSettings(panelId)} />;
      case "chart":
        return <TradingChart onSettings={() => openSettings(panelId)} />;
      case "risk":
        return <RiskDashboard onSettings={() => openSettings(panelId)} />;
      default:
        return null;
    }
  };

  const openSettings = (panelId: string) => {
    document.getElementById(`settings-${panelId}`)?.click();
  };

  const updatePanelType = (panelId: string, type: PanelType) => {
    setPanelConfig((prev) => ({
      ...prev,
      [panelId]: type,
    }));
  };

  return (
    <div
      className={`${
        isFullscreen
          ? "fixed inset-0 z-50 bg-background pt-16 pb-14"
          : ""
      }`}
    >
      <div className={`${isFullscreen ? "h-full overflow-auto p-4" : ""}`}>
        <Card className="shadow-md3-2 rounded-md3-lg">
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Дашборд</h2>
              <Button
                variant="outline"
                size="sm"
                className="rounded-md3-md"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4 mr-1" />
                ) : (
                  <Maximize2 className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm">
                  {isFullscreen ? "Свернуть" : "Развернуть"}
                </span>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {Object.entries(panelConfig).map(([panelId, type]) => (
                <div key={panelId} className="relative">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        id={`settings-${panelId}`}
                        className="hidden"
                      >
                        Settings
                      </button>
                    </DialogTrigger>
                    <DialogContent className="rounded-md3-lg">
                      <DialogTitle>Настройки панели</DialogTitle>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Тип панели
                          </label>
                          <Select
                            value={type}
                            onValueChange={(value) =>
                              updatePanelType(panelId, value as PanelType)
                            }
                          >
                            <SelectTrigger className="rounded-md3-md">
                              <SelectValue placeholder="Выберите тип панели" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="news">Новости</SelectItem>
                              <SelectItem value="prices">Цены</SelectItem>
                              <SelectItem value="chart">График</SelectItem>
                              <SelectItem value="risk">Риски</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {renderPanel(panelId, type)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
