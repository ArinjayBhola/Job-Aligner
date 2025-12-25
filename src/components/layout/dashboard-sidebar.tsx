"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { ModeToggle } from "@/components/ui/mode-toggle";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Interview Prep",
    icon: Users,
    href: "/dashboard/interview-prep",
  },
  {
    label: "Tracker", 
    icon: Sparkles,
    href: "/dashboard/tracker",
  },
  {
    label: "New Application",
    icon: Settings,
    href: "/dashboard/new-application",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-card border-r border-border text-card-foreground">
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">J</span>
        </div>
        <span className="text-lg font-semibold tracking-tight">JobAligner</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="flex flex-col gap-1 px-3">
          {routes.map((route) => {
            const isActive = pathname === route.href || pathname?.startsWith(route.href + "/");
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary hover:bg-primary/15"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <route.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {route.label}
                {isActive && <ChevronRight className="ml-auto h-3 w-3 opacity-50" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-border mt-auto space-y-4">
         <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Theme</span>
            <ModeToggle />
         </div>
         
         <div className="flex items-center gap-3 p-2 bg-accent/50 rounded-md">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold overflow-hidden">
                {user.image ? (
                    <img src={user.image} alt={user.name || "User"} className="h-full w-full object-cover" />
                ) : (
                    user.name?.[0] || "U"
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
         </div>

         <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => signOut()}
         >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
         </Button>
      </div>
    </div>
  );
}
