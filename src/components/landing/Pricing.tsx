"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 relative overflow-hidden">
      {/* Background blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container mx-auto max-w-5xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Simple Pricing
        </h2>
        <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto">
          Start for free, upgrade when you&apos;re ready to scale your job search.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* ================= FREE ================= */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            {/* neutral glow */}
            <div className="absolute -inset-[1px] rounded-[2.5rem] bg-zinc-300/40 dark:bg-zinc-700/40 blur-[2px]" />

            <div className="relative h-full p-8 md:p-10 rounded-[2.5rem] bg-card flex flex-col items-start text-left">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground">
                  Free Starter
                </h3>
                <p className="text-muted-foreground mt-2">
                  Perfect for trying it out
                </p>
              </div>

              <div className="text-5xl font-bold text-foreground my-2">
                ₹0
              </div>
              <p className="text-sm text-muted-foreground mb-8">
                Forever free
              </p>

              <ul className="space-y-4 flex-1 mb-10 w-full">
                {[
                  "3 Tailored Resumes / mo",
                  "Basic Match Score",
                  "Text Export",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-center">
                    <CheckCircle className="w-5 h-5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant="outline"
                className="w-full h-12 rounded-xl text-base"
              >
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </div>
          </motion.div>

          {/* ================= PRO ================= */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            {/* gradient glow */}
            <div className="absolute -inset-[1px] rounded-[2.5rem] bg-gradient-to-b from-primary via-purple-600 to-indigo-600 blur-[2px]" />

            <div className="relative h-full p-8 md:p-10 rounded-[2.5rem] bg-card flex flex-col items-start text-left">
              <div className="absolute top-0 right-0 py-2 px-6 bg-gradient-to-bl from-primary to-purple-600 rounded-bl-3xl rounded-tr-[2.3rem] text-white text-xs font-bold tracking-widest uppercase shadow-lg">
                Popular
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                  Pro Power
                </h3>
                <p className="text-muted-foreground mt-2">
                  For the serious job seeker
                </p>
              </div>

              <div className="flex items-baseline gap-1 my-2">
                <div className="text-5xl font-bold text-foreground">
                  ₹999
                </div>
                <div className="text-lg text-muted-foreground font-medium">
                  /mo
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-8">
                Cancel anytime
              </p>

              <ul className="space-y-4 flex-1 mb-10 w-full">
                {[
                  "Unlimited Resumes",
                  "Detailed Keyword Report",
                  "PDF Export (Coming Soon)",
                  "Interview Prep Assistant",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-center">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 fill-primary/10" />
                    <span className="font-medium text-foreground/90">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className="w-full h-12 rounded-xl text-base bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg shadow-primary/25"
              >
                <Link href="/dashboard">Upgrade Now</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
