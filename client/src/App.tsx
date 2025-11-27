import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import DashboardPage from "@/pages/dashboard-page";
import WalletPage from "@/pages/wallet-page";
import TradingPage from "@/pages/trading-page";
import LearnPage from "@/pages/learn-page";
import ProfilePage from "@/pages/profile-page";
import OverviewPage from "@/pages/overview-page";
import P2PPage from "@/pages/p2p-page";
import ICOPage from "@/pages/ico-page";
import FriendsPage from "@/pages/friends-page";
import AboutPage from "@/pages/about-page";
import TeachersPage from "@/pages/teachers-page";
import NewsPage from "@/pages/news-page";
import ExchangeComparisonPage from "@/pages/exchange-comparison-page";
import { ThemeProvider } from "next-themes";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/overview" component={OverviewPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/wallet" component={WalletPage} />
      <Route path="/trade" component={TradingPage} />
      <Route path="/learn" component={LearnPage} />
      <Route path="/teachers" component={TeachersPage} />
      <Route path="/news" component={NewsPage} />
      <Route path="/comparison" component={ExchangeComparisonPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/p2p" component={P2PPage} />
      <Route path="/ico" component={ICOPage} />
      <Route path="/friends" component={FriendsPage} />
      <Route path="/about" component={AboutPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
