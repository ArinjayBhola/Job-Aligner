export function Footer() {
  return (
    <footer className="py-12 border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-8">
           <h4 className="font-bold text-xl mb-2 tracking-tight">JobAligner AI</h4>
           <p className="text-muted-foreground text-sm max-w-sm mx-auto">Empowering job seekers with AI-driven precision to land their dream jobs.</p>
        </div>
        <div className="flex justify-center gap-8 mb-8 text-sm text-muted-foreground/80 font-medium">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>
        <div className="text-muted-foreground/50 text-sm">
          © {new Date().getFullYear()} JobAligner AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
