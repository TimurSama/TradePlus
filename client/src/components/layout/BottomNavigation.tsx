import { Link, useLocation } from "wouter";

export default function BottomNavigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const activeIconClass = "text-primary";
  const inactiveIconClass = "text-muted-foreground";

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around border-t border-border bg-surface shadow-md3-2 z-40">
      <Link href="/dashboard">
        <button className="flex flex-col items-center justify-center w-12">
          <span className={`material-icons text-sm ${isActive("/dashboard") ? activeIconClass : inactiveIconClass}`}>dashboard</span>
          <span className="text-xs mt-0.5">Dashboard</span>
        </button>
      </Link>

      <Link href="/p2p">
        <button className="flex flex-col items-center justify-center w-12">
          <span className={`material-icons text-sm ${isActive("/p2p") ? activeIconClass : inactiveIconClass}`}>swap_horiz</span>
          <span className="text-xs mt-0.5">P2P</span>
        </button>
      </Link>

      <Link href="/trade">
        <button className="flex flex-col items-center justify-center w-12 relative">
          <div className={`absolute -top-3 w-10 h-10 rounded-full bg-surface-container border-2 ${isActive("/trade") ? "border-primary" : "border-border"} flex items-center justify-center shadow-md3-2`}>
            <span className={`material-icons ${isActive("/trade") ? "text-primary" : "text-muted-foreground"}`}>candlestick_chart</span>
          </div>
          <span className="text-xs mt-6">Trade</span>
          <img src="/logo.png" alt="Trader Plus" className="h-6 w-auto absolute -bottom-12 left-1/2 transform -translate-x-1/2" />
        </button>
      </Link>

      <Link href="/ico">
        <button className="flex flex-col items-center justify-center w-12">
          <span className={`material-icons text-sm ${isActive("/ico") ? activeIconClass : inactiveIconClass}`}>token</span>
          <span className="text-xs mt-0.5">ICO</span>
        </button>
      </Link>

      <Link href="/friends">
        <button className="flex flex-col items-center justify-center w-12">
          <span className={`material-icons text-sm ${isActive("/friends") ? activeIconClass : inactiveIconClass}`}>group</span>
          <span className="text-xs mt-0.5">Friends</span>
        </button>
      </Link>

      <Link href="/profile">
        <button className="flex flex-col items-center justify-center w-12">
          <span className={`material-icons text-sm ${isActive("/profile") ? activeIconClass : inactiveIconClass}`}>person</span>
          <span className="text-xs mt-0.5">Profile</span>
        </button>
      </Link>
    </nav>
  );
}