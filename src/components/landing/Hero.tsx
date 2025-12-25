"use client";

import Link from "next/link";
import { ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden min-h-screen flex items-center">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow delay-700" />
      </div>

      <div className="container mx-auto max-w-6xl text-center space-y-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-white/5 backdrop-blur-md text-primary text-xs font-semibold mx-auto shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          v1.0 Public Beta is Live
        </motion.div>

        <div className="space-y-6">
            <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter text-foreground"
            >
            Beat the ATS with <br />
            <span className="text-gradient leading-tight block mt-2 pb-4">
                AI Precision
            </span>
            </motion.h1>

            <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
            Stop getting rejected by bots. Tailor your resume to any job description in seconds using advanced AI analysis.
            </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <Button asChild size="lg" variant="glow" className="h-14 px-8 text-lg rounded-2xl">
            <Link href="/dashboard">
                Start Optimizing 
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl bg-white/5 hover:bg-white/10 border-white/10 dark:border-white/10">
            <Link href="#demo">
                View Demo
            </Link>
          </Button>
        </motion.div>
        
        {/* Glassmorphism Interface Preview */}
        <motion.div
           initial={{ opacity: 0, y: 60, scale: 0.95 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
           className="mt-20 mx-auto max-w-5xl relative group"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-purple-500/20 blur-3xl -z-10 opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
            
             <div className="rounded-2xl glass p-3 ring-1 ring-white/10 shadow-2xl">
                 <div className="rounded-xl bg-card/50 overflow-hidden h-[400px] md:h-[600px] flex items-center justify-center relative bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05]">
                    {/* Simulated UI Content */}
                    <div className="absolute top-8 left-8 right-8 bottom-8 flex gap-6">
                        <div className="w-64 hidden md:flex flex-col gap-4">
                            <div className="h-20 bg-muted/40 rounded-xl animate-pulse"></div>
                            <div className="h-full bg-muted/40 rounded-xl"></div>
                        </div>
                        <div className="flex-1 flex flex-col gap-6">
                            <div className="h-32 bg-primary/5 border border-primary/10 rounded-xl p-6 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="h-4 w-32 bg-primary/20 rounded"></div>
                                    <div className="h-8 w-16 bg-primary/20 rounded-lg"></div>
                                </div>
                                <div className="h-2 w-full bg-primary/10 rounded"></div>
                                <div className="h-2 w-2/3 bg-primary/10 rounded"></div>
                            </div>
                            <div className="flex-1 bg-card rounded-xl border border-border/40 shadow-sm p-6 space-y-4">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="h-4 w-40 bg-foreground/10 rounded mb-2"></div>
                                        <div className="h-3 w-24 bg-foreground/5 rounded"></div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-3 w-full bg-muted rounded"></div>
                                    <div className="h-3 w-full bg-muted rounded"></div>
                                    <div className="h-3 w-3/4 bg-muted rounded"></div>
                                </div>
                                 <div className="space-y-3 mt-8">
                                    <div className="h-3 w-full bg-muted rounded"></div>
                                    <div className="h-3 w-full bg-muted rounded"></div>
                                    <div className="h-3 w-5/6 bg-muted rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Badge Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-black/20 backdrop-blur-[2px]">
                         <div className="bg-card/90 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl text-center max-w-sm transform group-hover:-translate-y-2 transition-transform duration-500">
                             <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg mb-6">
                                <Zap className="w-8 h-8 fill-current"/>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Analysis Complete</h3>
                            <p className="text-muted-foreground mb-6">Your resume is now 95% aligned with the job description.</p>
                            <Button className="w-full">View Results</Button>
                         </div>
                    </div>
                 </div>
             </div>
        </motion.div>
      </div>
    </section>
  );
}
