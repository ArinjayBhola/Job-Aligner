"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "glass border-b border-white/10 py-3"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="hidden sm:inline-block">JobAligner AI</span>
        </div>
        
        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground/80">
          <Link href="#features" className="hover:text-primary transition-colors duration-200">Features</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors duration-200">Pricing</Link>
          <Link href="#demo" className="hover:text-primary transition-colors duration-200">How it Works</Link>
        </nav>

        <div className="flex gap-4 items-center">
          <Link href="/api/auth/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Log in
          </Link>
          <Button asChild variant="glow" size="sm" className="rounded-full px-6">
            <Link href="/dashboard">
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
