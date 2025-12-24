import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { CheckCircle, AlertTriangle, ArrowLeft, Copy, Download } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function AnalysisResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  const analysis = await prisma.jobAnalysis.findUnique({
    where: { id },
    include: { resume: true }
  });

  if (!analysis) notFound();
  if (analysis.userId !== session!.user.id) redirect("/dashboard");

  const report = analysis.analysisReport as { missingKeywords?: string[] } | null;
  const missingKeywords = report?.missingKeywords || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
           <h1 className="text-2xl font-bold">Analysis Result</h1>
           <p className="text-muted-foreground text-sm">Created {formatDistanceToNow(analysis.createdAt)} ago</p>
        </div>
      </div>

      {/* Scores */}
      <div className="grid md:grid-cols-2 gap-6">
         <div className="p-6 rounded-2xl border border-border bg-card flex flex-col items-center text-center">
            <h3 className="text-muted-foreground font-medium mb-2">Original Match</h3>
            <div className="text-5xl font-black text-muted-foreground">{analysis.originalScore}%</div>
         </div>
         <div className="p-6 rounded-2xl border border-primary/50 bg-primary/5 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
            <h3 className="text-primary font-bold mb-2 relative z-10">Tailored Match</h3>
            <div className="text-6xl font-black text-primary relative z-10">{analysis.tailoredScore}%</div>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Feedback */}
        <div className="space-y-6">
           <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Missing Keywords
              </h3>
              {missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.map(k => (
                    <span key={k} className="px-2 py-1 bg-red-500/10 text-red-500 text-xs font-semibold rounded-md border border-red-500/20">
                      {k}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">Great job! No major keywords missing.</div>
              )}
           </div>

           <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-bold mb-4">Job Description</h3>
              <div className="text-sm text-muted-foreground max-h-60 overflow-y-auto whitespace-pre-wrap">
                {analysis.jobDescription}
              </div>
           </div>
        </div>

        {/* Right: Tailored Resume */}
        <div className="lg:col-span-2 space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Tailored Resume</h3>
              <button className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                 <Copy className="w-4 h-4" /> Copy Text
              </button>
           </div>
           
           <div className="relative">
             <div className="absolute top-4 right-4 z-10">
               {/* Actions */}
             </div>
             <textarea readOnly className="w-full h-[600px] p-6 rounded-xl border border-border bg-card font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary"
               value={analysis.tailoredResume || ""}
             />
           </div>
        </div>
      </div>
    </div>
  );
}
