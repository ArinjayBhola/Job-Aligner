"use client";

import { useState, useEffect } from "react";
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { AddJobDialog } from "@/components/dashboard/tracker/add-job-dialog";
import { ApplicationCard } from "@/components/dashboard/tracker/application-card";
import { getApplicationsAction, updateApplicationStatusAction, deleteApplicationAction } from "@/server/actions";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { KanbanColumn } from "@/components/dashboard/tracker/kanban-column";

type AppStatus = "WISHLIST" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";

const COLUMNS: { id: AppStatus; title: string }[] = [
  { id: "WISHLIST", title: "Wishlist" },
  { id: "APPLIED", title: "Applied" },
  { id: "INTERVIEW", title: "Interview" },
  { id: "OFFER", title: "Offer" },
  { id: "REJECTED", title: "Rejected" },
];

export default function TrackerPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    const res = await getApplicationsAction();
    if (res.success) {
      setApplications(res.data);
    }
    setLoading(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: Add visual feedback for column hover if needed
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeApp = applications.find(a => a.id === active.id);
    const overId = over.id as string;
    
    // Check if dropped on a column
    const isColumn = COLUMNS.some(c => c.id === overId);
    let newStatus = isColumn ? overId : null;

    // Or dropped on another card? (Simplified: just handle dropping on columns for strict Kanban, 
    // or handle sortable. For now, we rely on SortableColumn to catch it)
    
    if (activeApp && newStatus && activeApp.status !== newStatus) {
       // Optimistic Update
       setApplications(apps => apps.map(app => 
         app.id === active.id ? { ...app, status: newStatus } : app
       ));

       const res = await updateApplicationStatusAction(active.id as string, newStatus as AppStatus);
       if (!res.success) {
         toast.error("Failed to update status");
         loadApplications(); // Revert
       }
    }

    setActiveId(null);
  };

  const handleDelete = async (id: string) => {
      setApplications(apps => apps.filter(a => a.id !== id));
      await deleteApplicationAction(id);
      toast.success("Application deleted");
  };

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin w-8 h-8 opacity-50" /></div>;

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden flex flex-col p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Application Tracker</h1>
          <p className="text-muted-foreground">Manage your job search pipeline efficiently.</p>
        </div>
        <AddJobDialog />
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
            <div className="flex gap-4 h-full min-w-[1200px]">
                {COLUMNS.map(col => (
                    <KanbanColumn
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        applications={applications.filter(a => a.status === col.id)}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>

        <DragOverlay>
           {activeId ? (
              <ApplicationCard 
                application={applications.find(a => a.id === activeId)} 
                onDelete={() => {}}
              />
           ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
