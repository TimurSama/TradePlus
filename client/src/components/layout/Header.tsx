import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function Header() {
  const { user, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4 border-b border-border bg-surface shadow-md3-1">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-4">
              <span className="material-icons">menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] bg-surface">
            <div className="flex flex-col gap-6 py-4">
              <Link href="/overview">
                <Button variant="ghost" className="w-full justify-start">
                  <span className="material-icons mr-2">info</span>
                  Overview
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  <span className="material-icons mr-2">dashboard</span>
                  Dashboard
                </Button>
              </Link>
              <Link href="/wallet">
                <Button variant="ghost" className="w-full justify-start">
                  <span className="material-icons mr-2">account_balance_wallet</span>
                  Wallet
                </Button>
              </Link>
              <Link href="/trade">
                <Button variant="ghost" className="w-full justify-start">
                  <span className="material-icons mr-2">candlestick_chart</span>
                  Trade
                </Button>
              </Link>
              <Link href="/learn">
                <Button variant="ghost" className="w-full justify-start">
                  <span className="material-icons mr-2">school</span>
                  Learn
                </Button>
              </Link>
              <Link href="/teachers">
                <Button variant="ghost" className="w-full justify-start">
                  <span className="material-icons mr-2">people</span>
                  Teachers
                </Button>
              </Link>
              <Link href="/news">
                <Button variant="ghost" className="w-full justify-start">
                  <span className="material-icons mr-2">newspaper</span>
                  News
                </Button>
              </Link>
              <Link href="/comparison">
                <Button variant="ghost" className="w-full justify-start">
                  <span className="material-icons mr-2">compare_arrows</span>
                  Exchange Comparison
                </Button>
              </Link>
              <Link href="/p2p">
                <Button variant="ghost" className="w-full justify-start">
                  <span className="material-icons mr-2">swap_horiz</span>
                  P2P Trading
                </Button>
              </Link>
              <Link href="/ico">
                <Button variant="ghost" className="w-full justify-start">
                  <span className="material-icons mr-2">token</span>
                  Token Sales
                </Button>
              </Link>
              <Link href="/friends">
                <Button variant="ghost" className="w-full justify-start">
                  <span className="material-icons mr-2">group</span>
                  Friends
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" className="w-full justify-start">
                  <span className="material-icons mr-2">person</span>
                  Profile
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" className="w-full justify-start">
                  <span className="material-icons mr-2">info</span>
                  About
                </Button>
              </Link>
              {user && (
                <Button 
                  variant="destructive" 
                  className="mt-auto"
                  onClick={() => logout()}
                >
                  <span className="material-icons mr-2">logout</span>
                  Выход
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex-1 flex justify-center items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <img src="/logo.png" alt="Trader Plus" className="h-8 w-auto" />
            </div>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-md3-md">
                    Вход
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-md3-lg">
                  <LoginForm onSuccess={() => setIsLoginOpen(false)} />
                </DialogContent>
              </Dialog>
              
              <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-md3-md">
                    Регистрация
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-md3-lg">
                  <RegisterForm onSuccess={() => setIsRegisterOpen(false)} />
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <>
              <Link href="/profile">
                <Button variant="ghost" className="rounded-md3-md">
                  {user.username}
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => logout()}
                className="rounded-md3-md"
              >
                Выход
              </Button>
            </>
          )}
        </div>
      </header>
    </>
  );
}
