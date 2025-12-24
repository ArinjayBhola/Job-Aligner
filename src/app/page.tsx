import Link from "next/link";
import { ArrowRight, CheckCircle, FileText, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Zap className="text-primary" />
            <span>JobAligner AI</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition">Features</Link>
            <Link href="#pricing" className="hover:text-foreground transition">Pricing</Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/api/auth/signin" className="px-4 py-2 text-sm font-medium hover:text-primary transition">
              Log in
            </Link>
            <Link href="/dashboard" className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition shadow-lg shadow-primary/20">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 px-4 text-center">
          <div className="container mx-auto max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now v1.0 Public Beta
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
              Beat the ATS with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                AI Precision
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stop getting rejected by bots. Tailor your resume to any job description in seconds using advanced AI analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/dashboard" className="h-12 px-8 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition">
                Start Optimizing <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#demo" className="h-12 px-8 rounded-lg border border-border bg-transparent hover:bg-muted/50 font-semibold flex items-center justify-center transition">
                View Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-muted/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-6 h-6 text-yellow-500" />,
                  title: "Instant Scoring",
                  desc: "Get a match score (0-100%) against any JD instantly."
                },
                {
                  icon: <FileText className="w-6 h-6 text-blue-500" />,
                  title: "Smart Rewriting",
                  desc: "AI rewrites your bullet points to include missing keywords."
                },
                {
                  icon: <CheckCircle className="w-6 h-6 text-green-500" />,
                  title: "ATS Compliant",
                  desc: "Output is clean, parsable Markdown/Text optimized for systems."
                }
              ].map((f, i) => (
                <div key={i} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition duration-300">
                  <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center mb-4 border border-border">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="text-4xl font-bold mb-12">Simple Pricing</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Free */}
              <div className="p-8 rounded-3xl border border-border bg-card/50 flex flex-col">
                <h3 className="text-2xl font-bold">Free Starter</h3>
                <div className="text-4xl font-extrabold my-4">$0</div>
                <ul className="space-y-4 text-left flex-1 mb-8">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> 3 Tailored Resumes/mo</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Basic Match Score</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Text Export</li>
                </ul>
                <Link href="/dashboard" className="w-full py-3 rounded-xl border border-primary text-primary font-bold hover:bg-primary/10 transition">
                  Get Started
                </Link>
              </div>
              
              {/* Pro */}
              <div className="p-8 rounded-3xl border border-primary bg-primary/5 relative flex flex-col">
                <div className="absolute top-0 right-0 bg-primary text-xs px-3 py-1 rounded-bl-xl rounded-tr-xl font-bold">POPULAR</div>
                <h3 className="text-2xl font-bold text-primary">Pro Power</h3>
                <div className="text-4xl font-extrabold my-4">$12<span className="text-base text-muted-foreground font-medium">/mo</span></div>
                <ul className="space-y-4 text-left flex-1 mb-8">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Unlimited Resumes</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Detailed Keyword Report</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary" /> PDF Export (Coming Soon)</li>
                </ul>
                <Link href="/dashboard" className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/25">
                  Upgrade Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border/50 text-center text-muted-foreground text-sm">
        © 2025 JobAligner AI. Built for the modern job seeker.
      </footer>
    </div>
  );
}
