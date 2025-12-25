"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Trash2, MapPin, Building2, Wallet, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplicationCardProps {
  application: any;
  onDelete: (id: string) => void;
}

export function ApplicationCard({ application, onDelete }: ApplicationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application.id,
    data: { ...application },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: "relative" as const, // Fix type issue
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative bg-card border border-border/60 p-4 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:-translate-y-1 transition-all duration-300",
        isDragging && "shadow-2xl ring-2 ring-primary rotate-2 opacity-80 scale-105 z-50 bg-card/90 backdrop-blur-xl"
      )}
    >
        {/* Glow effect on hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 blur-md -z-10"></div>

      <div className="flex justify-between items-start gap-3 mb-2">
        <h3 className="font-bold text-base leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">{application.position}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(application.id);
          }}
          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground/50 hover:text-destructive transition-all opacity-0 group-hover:opacity-100"
          title="Delete Application"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-foreground/80 font-medium mb-3">
        <div className="p-1.5 rounded-md bg-muted text-muted-foreground">
            <Building2 className="w-3.5 h-3.5" />
        </div>
        <span className="truncate">{application.company}</span>
      </div>

      <div className="space-y-1.5 mb-4">
        {application.location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 text-muted-foreground/70" /> {application.location}
            </div>
        )}
        {application.salary && (
             <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Wallet className="w-3 h-3 text-muted-foreground/70" /> {application.salary}
            </div>
        )}
      </div>

      <div className="pt-3 flex items-center justify-between border-t border-border/40">
         <Badge variant="outline" className={cn(
             "text-[10px] font-bold px-2 py-0.5 h-auto",
             application.fitScore >= 80 ? "border-green-500/30 text-green-600 bg-green-500/5" : 
             application.fitScore >= 50 ? "border-yellow-500/30 text-yellow-600 bg-yellow-500/5" :
             "border-red-500/30 text-red-600 bg-red-500/5"
         )}>
             {application.fitScore}% Match
         </Badge>
         <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
             <Calendar className="w-3 h-3" />
             {new Date(application.createdAt).toLocaleDateString()}
         </div>
      </div>
    </div>
  );
}
