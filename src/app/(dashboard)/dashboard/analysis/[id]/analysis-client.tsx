"use client";

import { useQuery } from "@tanstack/react-query";
import { getAnalysisAction } from "@/server/actions";
import { CheckCircle, AlertTriangle, ArrowLeft, Copy, Clock, Download, Share2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AnalysisClient({ id }: { id: string }) {
  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ["analysis", id],
    queryFn: async () => {
      const res = await getAnalysisAction(id);
      if (res.success) return res.data;
      throw new Error(res.error);
    },
    staleTime: 5 * 60 * 1000, 
  });

  const copyToClipboard = () => {
    if (analysis?.tailoredResume) {
      navigator.clipboard.writeText(analysis.tailoredResume);
      toast.success("Resume copied to clipboard");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
             <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
             <Loader2 className="w-12 h-12 animate-spin text-primary relative z-10" />
        </div>
        <p className="mt-4 text-muted-foreground font-medium animate-pulse">Loading analysis...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mb-2">
            <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold">Analysis not found</h2>
        <p className="text-muted-foreground">The requested analysis could not be loaded.</p>
        <Link href="/dashboard" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition">
          Go Back
        </Link>
      </div>
    );
  }

  const report = analysis.analysisReport as { missingKeywords?: string[] } | null;
  const missingKeywords = report?.missingKeywords || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
             <h1 className="text-3xl font-bold flex items-center gap-2">
                Analysis Result
                {analysis.status === 'COMPLETED' && <CheckCircle className="w-5 h-5 text-green-500" />}
             </h1>
             <p className="text-muted-foreground flex items-center gap-2 text-sm mt-1">
                <Clock className="w-3 h-3" />
                Created {formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}
             </p>
          </div>
        </div>
        
        <div className="flex gap-2">
            <button onClick={copyToClipboard} className="px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted transition font-medium flex items-center gap-2 text-sm">
                <Share2 className="w-4 h-4" /> Share
            </button>
            <button onClick={() => window.print()} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition font-bold flex items-center gap-2 text-sm shadow-lg shadow-primary/20">
                <Download className="w-4 h-4" /> Export PDF
            </button>
        </div>
      </div>

      {/* Scores */}
      <div className="grid md:grid-cols-2 gap-6">
         <div className="p-8 rounded-3xl glass-panel relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-primary/10"></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-2">
              <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Original Resume Match</span>
              <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/50">
                  {analysis.originalScore}%
              </div>
              <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-foreground/20 rounded-full" style={{ width: `${analysis.originalScore}%` }}></div>
              </div>
            </div>
         </div>

         <div className="p-8 rounded-3xl bg-primary text-primary-foreground relative overflow-hidden shadow-xl shadow-primary/25 group">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/20 blur-3xl rounded-full group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-2">
              <span className="text-sm font-bold uppercase tracking-wider text-primary-foreground/80">Tailored Resume Match</span>
              <div className="text-7xl font-black text-white drop-shadow-sm">
                  {analysis.tailoredScore}%
              </div>
              <div className="h-2 w-32 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${analysis.tailoredScore}%` }}></div>
              </div>
              <p className="text-sm font-medium text-white/90 mt-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                 +{(analysis.tailoredScore || 0) - (analysis.originalScore || 0)}% Improvement
              </p>
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Feedback */}
        <div className="space-y-6">
           <div className="p-6 rounded-3xl glass-panel space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                    <AlertTriangle className="w-5 h-5" />
                </div>
                Missing Keywords
              </h3>
              <p className="text-sm text-muted-foreground">Add these keywords to boost your ATS score further.</p>
              
              <div className="border-t border-border/50 pt-4">
                  {missingKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {missingKeywords.map(k => (
                        <span key={k} className="px-3 py-1.5 bg-background border border-border/50 hover:border-red-500/30 hover:bg-red-500/5 transition-colors rounded-lg text-sm font-medium flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          {k}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Perfect! No major keywords missing.
                    </div>
                  )}
              </div>
           </div>

           <div className="p-6 rounded-3xl glass-panel space-y-4">
              <h3 className="font-bold text-lg">Job Description</h3>
              <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-sm text-muted-foreground max-h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed font-mono">
                {analysis.jobDescription}
              </div>
           </div>
        </div>

        {/* Right: Tailored Resume */}
        <div className="lg:col-span-2 space-y-4">
           <div className="flex items-center justify-between px-2">
              <div>
                  <h3 className="font-bold text-2xl">Tailored Resume</h3>
                  <p className="text-muted-foreground text-sm">Optimized for ATS and readability</p>
              </div>
              <button onClick={copyToClipboard} className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-4 py-2 rounded-xl">
                 <Copy className="w-4 h-4" /> Copy Content
              </button>
           </div>
           
           <div className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[2rem] blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
             <div className="relative rounded-[1.5rem] overflow-hidden border border-border bg-card">
                 <div className="h-10 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                 </div>
                 <textarea readOnly className="w-full h-[700px] p-8 bg-card font-mono text-sm leading-7 resize-none focus:outline-none text-foreground/80 selection:bg-primary/20"
                   value={analysis.tailoredResume || ""}
                 />
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
