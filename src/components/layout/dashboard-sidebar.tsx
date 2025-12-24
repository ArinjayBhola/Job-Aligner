"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LogOut, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


interface DashboardSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: FileText,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
        label: "Settings",
        icon: User,
        href: "/dashboard/settings",
        active: pathname === "/dashboard/settings",
    }
  ];

  return (
    <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
      <div className="p-6 flex items-center gap-2 font-bold text-xl border-b border-border">
        <Zap className="text-primary" />
        <span>JobAligner</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
            pathname === "/dashboard" 
              ? "bg-primary/10 text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <FileText className="w-5 h-5" />
          Dashboard
        </Link>
        
        <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-6">
          Account
        </div>

        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
            pathname === "/dashboard/settings" 
              ? "bg-primary/10 text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <User className="w-5 h-5" />
          Settings
        </Link>
      </nav>

      <div className="p-4 border-t border-border">
      <div className="p-4 border-t border-border space-y-4">
        <div className="flex items-center justify-between px-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={() => signOut()} className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-5 w-5" />
            </Button>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2">
          <Avatar className="h-9 w-9">
             <AvatarImage src={user.image || ""} />
             <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-medium truncate">{user.name}</div>
            <div className="text-xs text-muted-foreground truncate">
              {user.email}
            </div>
          </div>
        </div>
      </div>
      </div>
    </aside>
  );
}
