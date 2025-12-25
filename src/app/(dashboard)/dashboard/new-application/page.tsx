"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { uploadResumeAction, analyzeJobAction } from "@/server/actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NewAnalysisPage() {
  const [step, setStep] = useState(1);
  const [resumeId, setResumeId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const { register: regResume, handleSubmit: subResume } = useForm();
  const { register: regJD, handleSubmit: subJD } = useForm();

  const onResumeSubmit = async (data: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    
    const res = await uploadResumeAction(formData);
    setLoading(false);
    
    if (res.success) {
      setResumeId(res.data);
      setStep(2);
    } else {
      alert(res.error);
    }
  };

  const onJDSubmit = async (data: any) => {
    setLoading(true);
    const res = await analyzeJobAction(resumeId, data.jobDescription);
    setLoading(false);

    if (res.success) {
      router.push(`/dashboard/analysis/${res.data}`);
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 animate-fade-in">
      <div className="mb-10 text-center">
         <h1 className="text-4xl font-bold mb-2">New Application</h1>
         <div className="flex justify-center gap-2">
             <div className={`h-1.5 rounded-full w-12 transition-colors ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
             <div className={`h-1.5 rounded-full w-12 transition-colors ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
         </div>
      </div>
      
      {/* Step 1: Resume */}
      {step === 1 && (
        <div className="animate-slide-up">
          <div className="p-8 glass-panel rounded-3xl space-y-8">
            <h2 className="text-2xl font-bold">Step 1: Your Resume</h2>
            <form onSubmit={subResume(onResumeSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">Resume Title</label>
                <input {...regResume("title", { required: true })} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="e.g. My Frontend Resume" />
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">Paste Resume Content (Text/Markdown)</label>
                <textarea {...regResume("content", { required: true })} className="w-full h-64 bg-background/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none resize-none" placeholder="# John Doe..." />
              </div>
              <button disabled={loading} className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-primary/90 transition shadow-lg shadow-primary/25 disabled:opacity-50">
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                Next: Add Job Description
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Step 2: JD */}
      {step === 2 && (
        <div className="animate-slide-up">
          <div className="p-8 glass-panel rounded-3xl space-y-8">
            <h2 className="text-2xl font-bold">Step 2: The Job</h2>
            <form onSubmit={subJD(onJDSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">Paste Job Description</label>
                <textarea {...regJD("jobDescription", { required: true })} className="w-full h-80 bg-background/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none resize-none" placeholder="Responsibilities..." />
              </div>
              <button disabled={loading} className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-primary/90 transition shadow-lg shadow-primary/25 disabled:opacity-50">
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                Analyze Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
