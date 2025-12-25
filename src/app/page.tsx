import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary/20">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <Features />
        <Pricing />
      </main>

      <Footer />
    </div>
  );
}
