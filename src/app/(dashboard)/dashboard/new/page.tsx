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
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">New Application</h1>
      
      {/* Step 1: Resume */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border border-border rounded-xl bg-card">
            <h2 className="text-xl font-semibold mb-4">Step 1: Your Resume</h2>
            <form onSubmit={subResume(onResumeSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Resume Title</label>
                <input {...regResume("title", { required: true })} className="w-full bg-background border border-border rounded-lg px-3 py-2" placeholder="e.g. My Frontend Resume" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Paste Resume Content (Text/Markdown)</label>
                <textarea {...regResume("content", { required: true })} className="w-full h-48 bg-background border border-border rounded-lg px-3 py-2" placeholder="# John Doe..." />
              </div>
              <button disabled={loading} className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium flex justify-center items-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Next: Add Job Description
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Step 2: JD */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border border-border rounded-xl bg-card">
            <h2 className="text-xl font-semibold mb-4">Step 2: The Job</h2>
            <form onSubmit={subJD(onJDSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Paste Job Description</label>
                <textarea {...regJD("jobDescription", { required: true })} className="w-full h-64 bg-background border border-border rounded-lg px-3 py-2" placeholder="Responsibilities..." />
              </div>
              <button disabled={loading} className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium flex justify-center items-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Analyze Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
