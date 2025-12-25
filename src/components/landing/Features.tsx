"use client";

import { CheckCircle, FileText, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Zap className="w-7 h-7 text-amber-500" />,
    title: "Instant Scoring",
    desc: "Get a match score (0-100%) against any JD instantly. Know exactly where you stand before applying.",
    color: "bg-amber-500/10 border-amber-500/20"
  },
  {
    icon: <FileText className="w-7 h-7 text-indigo-500" />,
    title: "Smart Rewriting",
    desc: "AI rewrites your bullet points to include missing keywords without sounding like a robot.",
    color: "bg-indigo-500/10 border-indigo-500/20"
  },
  {
    icon: <CheckCircle className="w-7 h-7 text-emerald-500" />,
    title: "ATS Compliant",
    desc: "Output is clean, parsable text optimized for Applicant Tracking Systems. No formatting issues.",
    color: "bg-emerald-500/10 border-emerald-500/20"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 relative">
       <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-20 space-y-6">
             <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary font-semibold tracking-wider uppercase text-sm"
              >
                  Why JobAligner?
              </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Everything you need to <br/><span className="text-gradient">Get Hired</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-xl leading-relaxed">We analyzed thousands of job descriptions to build the ultimate optimization engine.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-[2rem] glass-card hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl ${f.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-base">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
