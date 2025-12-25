"use client";

import { useState, useTransition } from "react";
import { generateInterviewQuestionsAction } from "@/server/actions";
import { Loader2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InterviewPrepPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState<{ question: string; answer: string }[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!resumeText || !jobDescription) {
      setError("Please provide both Resume content and Job Description.");
      return;
    }
    setError("");
    
    startTransition(async () => {
      const result = await generateInterviewQuestionsAction(resumeText, jobDescription);
      if (result.success) {
        setQuestions(result.data);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-gradient">Interview Prep Assistant</h1>
        <p className="text-muted-foreground text-lg">
          Generate tailored interview questions and model answers based on your resume and target job.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4 glass-panel p-6 rounded-2xl">
          <label className="font-bold text-sm tracking-wide text-muted-foreground uppercase">Resume Content</label>
          <textarea
            className="w-full h-80 p-4 rounded-xl bg-background/40 border border-white/10 focus:ring-2 focus:ring-primary/50 outline-none resize-none text-sm transition-all focus:bg-background/60"
            placeholder="Paste your resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>
        <div className="space-y-4 glass-panel p-6 rounded-2xl">
          <label className="font-bold text-sm tracking-wide text-muted-foreground uppercase">Job Description</label>
          <textarea
            className="w-full h-80 p-4 rounded-xl bg-background/40 border border-white/10 focus:ring-2 focus:ring-primary/50 outline-none resize-none text-sm transition-all focus:bg-background/60"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={isPending}
          className="px-10 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-2xl flex items-center gap-3 hover:bg-primary/90 transition shadow-xl shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 transform duration-200"
        >
          {isPending ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Analyzing & Generating...
            </>
          ) : (
            <>
              <Zap className="w-6 h-6 fill-current" />
              Generate Questions
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-bold text-center border border-destructive/20">
          {error}
        </div>
      )}

      <AnimatePresence>
        {questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
             className="space-y-8 pt-12"
          >
            <div className="flex items-center gap-4 before:h-px before:flex-1 before:bg-border/50 after:h-px after:flex-1 after:bg-border/50">
               <h2 className="text-2xl font-bold whitespace-nowrap">Predicted Questions</h2>
            </div>
            
            <div className="grid gap-6">
              {questions.map((q, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-3xl glass-panel group hover:bg-card/60 transition-colors"
                >
                  <h3 className="font-bold text-xl mb-4 flex gap-3 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-1">Q{i + 1}</span> 
                    <span className="leading-relaxed">{q.question}</span>
                  </h3>
                  <div className="pl-11">
                    <div className="p-6 rounded-xl bg-secondary/30 border border-white/5 text-muted-foreground text-base leading-relaxed">
                      <span className="font-bold text-foreground block mb-2 text-xs uppercase tracking-wider">Model Answer Strategy:</span>
                      {q.answer}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
