"use client";

import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Suspense } from "react";
import { Zap } from "lucide-react";

function SignUpContentInner() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-in fade-in duration-1000" />
        
        <div className="relative z-20 flex items-center text-lg font-bold tracking-tight">
          <Zap className="mr-2 h-6 w-6 text-indigo-400" />
          <span>JobAligner AI</span>
        </div>
        
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl font-medium leading-relaxed">
              &ldquo;Joining JobAligner was the best career move I made. The AI insights helped me tailor my resume perfectly for every role.&rdquo;
            </p>
            <footer className="text-sm pt-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center font-bold text-purple-300">JD</div>
                <div>
                    <div className="font-semibold">John Doe</div>
                    <div className="text-zinc-400 text-xs">Product Manager</div>
                </div>
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 relative">
        {/* subtle background blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -z-10" />

        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] bg-card/60 backdrop-blur-xl p-8 rounded-2xl border border-border/50 shadow-xl">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <AuthForm type="register" />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/auth/signin"
              className="hover:text-primary underline underline-offset-4 transition-colors"
            >
              Already have an account? Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUpContent() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <SignUpContentInner />
    </Suspense>
  );
}
