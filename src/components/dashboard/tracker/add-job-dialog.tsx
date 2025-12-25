"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Plus, Wand2, Briefcase } from "lucide-react";
import { extractJobDetailsAction, createJobApplicationAction } from "@/server/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AddJobDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"input" | "form">("input");
  const [jobDescription, setJobDescription] = useState("");
  const [isExtracting, startExtraction] = useTransition();
  const [isSaving, startSaving] = useTransition();

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    salary: "",
  });

  const handleExtract = () => {
    if (!jobDescription) return toast.error("Please enter a job description");
    
    startExtraction(async () => {
      const res = await extractJobDetailsAction(jobDescription);
      if (res.success) {
        setFormData(res.data);
        setStep("form");
        toast.success("Details extracted successfully!");
      } else {
        toast.error("Failed to extract details");
      }
    });
  };

  const handleSave = () => {
    if (!formData.company || !formData.position) return toast.error("Company and Position are required");

    startSaving(async () => {
      const res = await createJobApplicationAction({
        ...formData,
        description: jobDescription,
        status: "WISHLIST",
      });

      if (res.success) {
        toast.success("Job added to Wishlist!");
        setOpen(false);
        // Reset
        setTimeout(() => {
            setStep("input");
            setJobDescription("");
            setFormData({ company: "", position: "", location: "", salary: "" });
        }, 300);
      } else {
        toast.error("Failed to save job");
      }
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-full px-6">
        <Plus className="w-4 h-4" /> New Application
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg glass border-white/20 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Briefcase className="w-5 h-5"/>
                </div>
                Add Job Application
            </DialogTitle>
            <DialogDescription>
                Track a new opportunity manually or use AI to extract details.
            </DialogDescription>
          </DialogHeader>

          {step === "input" ? (
            <div className="space-y-6 pt-4">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Paste Job Description</Label>
                <textarea
                  className="w-full h-56 p-4 rounded-xl bg-muted/30 border border-input text-sm ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-none font-mono"
                  placeholder="Paste the full JD text here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
              <DialogFooter className="flex-row sm:justify-between gap-4">
                <Button variant="ghost" onClick={() => { setStep("form"); }} className="text-muted-foreground hover:text-foreground">Skip AI Extraction</Button>
                <Button onClick={handleExtract} disabled={isExtracting} className="gap-2 w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25">
                  {isExtracting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  {isExtracting ? "Analyzing..." : "Auto-Fill Details"}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-6 pt-2">
              <div className="grid gap-5">
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label>Company</Label>
                        <Input 
                            value={formData.company} 
                            onChange={(e) => setFormData({...formData, company: e.target.value})} 
                            placeholder="e.g. Acme Inc."
                            className="bg-muted/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Position</Label>
                        <Input 
                            value={formData.position} 
                            onChange={(e) => setFormData({...formData, position: e.target.value})} 
                            placeholder="e.g. Senior Developer"
                            className="bg-muted/50"
                        />
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label>Location</Label>
                    <Input 
                        value={formData.location} 
                        onChange={(e) => setFormData({...formData, location: e.target.value})} 
                        placeholder="Remote / City"
                        className="bg-muted/50"
                    />
                    </div>
                    <div className="space-y-2">
                    <Label>Salary</Label>
                    <Input 
                        value={formData.salary} 
                        onChange={(e) => setFormData({...formData, salary: e.target.value})} 
                        placeholder="e.g. $120k - $150k"
                        className="bg-muted/50"
                    />
                    </div>
                 </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setStep("input")}>Back</Button>
                <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Save Application
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
