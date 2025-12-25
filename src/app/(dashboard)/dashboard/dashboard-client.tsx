"use client";

import { useQuery } from "@tanstack/react-query";
import { getAnalysesAction } from "@/server/actions";
import Link from "next/link";
import { Plus, Clock, FileText, ChevronRight, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardClient({ userId, initialData }: { userId?: string, initialData?: any[] }) {
  const { data: analyses, isLoading } = useQuery({
    queryKey: ["analyses"],
    queryFn: async () => {
      const res = await getAnalysesAction();
      if (res.success) return res.data;
      return [];
    },
    initialData,
    staleTime: 5 * 60 * 1000, 
  });

  if (isLoading) {
    return (
      <div className="flex justify-center flex-col items-center py-40 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading dashboard...</p>
      </div>
    );
  }

  // Ensure analyses is an array
  const items = Array.isArray(analyses) ? analyses : [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your resumes and tracked applications.</p>
        </div>
        <Button asChild size="sm">
            <Link href="/dashboard/new">
                <Plus className="w-4 h-4 mr-2" /> New Application
            </Link>
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent Activity</h2>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-lg bg-muted/20 flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
                 <h3 className="text-base font-semibold">No applications yet</h3>
                 <p className="text-sm text-muted-foreground max-w-sm mx-auto">Start by optimizing your resume for a job description.</p>
            </div>
            <Button asChild variant="outline" size="sm" className="mt-2">
                 <Link href="/dashboard/new">Start Optimization</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {items.map((item: any) => (
               <Link key={item.id} href={`/dashboard/analysis/${item.id}`} className="block group">
                 <Card className="hover:border-primary/50 transition-colors duration-200">
                    <CardContent className="p-4 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         {/* Score Indicator */}
                         <div className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-bold border ${
                            item.tailoredScore && item.tailoredScore > 70 
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900' 
                            : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900'
                         }`}>
                           {item.tailoredScore ? `${item.tailoredScore}` : "-"}
                         </div>

                         <div>
                           <div className="font-medium text-base group-hover:text-primary transition-colors">
                               {item.jobTitle || "Untitled Job"}
                           </div>
                           <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                             <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                             <span>•</span>
                             <span className="flex items-center gap-1">{item.resume?.title || "Resume"}</span>
                           </div>
                         </div>
                       </div>

                       <div className="flex items-center gap-4">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full border ${
                              item.status === 'COMPLETED' 
                              ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900' 
                              : 'bg-secondary text-secondary-foreground border-border'
                          }`}>
                            {item.status}
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                       </div>
                    </CardContent>
                 </Card>
               </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
