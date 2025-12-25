"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ApplicationCard } from "./application-card";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: string;
  title: string;
  applications: any[];
  onDelete: (id: string) => void;
}

export function KanbanColumn({ id, title, applications, onDelete }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div 
        ref={setNodeRef}
        className={cn(
            "flex-1 min-w-[320px] flex flex-col rounded-2xl bg-muted/30 border border-transparent transition-all duration-300",
            isOver && "bg-primary/5 border-primary/20 ring-2 ring-primary/10 shadow-inner"
        )}
    >
        {/* Header */}
        <div className="p-4 flex items-center justify-between sticky top-0 bg-transparent z-10">
             <div className="flex items-center gap-2">
                 <div className={cn("w-2 h-2 rounded-full", 
                    id === 'WISHLIST' ? 'bg-slate-400' :
                    id === 'APPLIED' ? 'bg-blue-500' :
                    id === 'INTERVIEW' ? 'bg-amber-500' :
                    id === 'OFFER' ? 'bg-green-500' :
                    'bg-red-500'
                 )}></div>
                <h3 className="font-bold text-sm tracking-wide text-muted-foreground uppercase">{title}</h3>
            </div>
            <span className="bg-background/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold border border-border/50 text-foreground shadow-sm">
                {applications.length}
            </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            <SortableContext items={applications.map(a => a.id)} strategy={verticalListSortingStrategy}>
                {applications.map((app) => (
                    <ApplicationCard key={app.id} application={app} onDelete={onDelete} />
                ))}
            </SortableContext>
            
            {applications.length === 0 && (
                <div className="h-32 border-2 border-dashed border-border/40 rounded-xl flex flex-col items-center justify-center text-muted-foreground/40 gap-2 hover:bg-muted/20 transition-colors">
                    <span className="text-xs font-medium uppercase tracking-wider">Empty</span>
                </div>
            )}
        </div>
    </div>
  );
}
