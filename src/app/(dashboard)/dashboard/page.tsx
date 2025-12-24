import { Button } from "@/components/ui/button"; // Placeholder import, will create component later or inline standard HTML
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Plus, Clock, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

async function getAnalyses(userId: string) {
  return await prisma.jobAnalysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { resume: true }
  });
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const analyses = await getAnalyses(session!.user.id);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your resumes and tailored applications.</p>
        </div>
        <Link href="/dashboard/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition">
          <Plus className="w-4 h-4" /> New Application
        </Link>
      </div>

      <div className="grid gap-6">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        
        {analyses.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card/50">
            <div className="text-muted-foreground mb-4">No applications yet.</div>
            <Link href="/dashboard/new" className="text-primary hover:underline">Start your first optimization</Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {analyses.map((item) => (
              <Link key={item.id} href={`/dashboard/analysis/${item.id}`} className="block group">
                <div className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.tailoredScore && item.tailoredScore > 70 ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {item.tailoredScore ? `${item.tailoredScore}%` : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-semibold group-hover:text-primary transition">{item.jobTitle || "Untitled Job"}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(item.createdAt, { addSuffix: true })} • {item.resume.title}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                     {item.status}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
