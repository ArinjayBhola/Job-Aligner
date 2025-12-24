"use client";

import { Check, CreditCard, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function BillingSection() {
    // Mock data - would come from DB/Stripe
    const isPro = false;
    const credits = 3;
    const maxCredits = 5; // Free tier limit

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subscription & Usage</CardTitle>
                <CardDescription>
                    Manage your subscription plan and usage credits.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${isPro ? "bg-amber-100 text-amber-600" : "bg-zinc-100 text-zinc-600"}`}>
                                {isPro ? <Zap className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                            </div>
                            <div>
                                <p className="font-medium">{isPro ? "Pro Plan" : "Free Plan"}</p>
                                <p className="text-sm text-muted-foreground">
                                    {isPro ? "Active until Dec 31, 2025" : "Upgrade to unlock unlimited features"}
                                </p>
                            </div>
                        </div>
                         {!isPro && <Button size="sm" variant="outline">Upgrade</Button>}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Generation Credits</span>
                        <span className="text-muted-foreground">{credits} / {maxCredits} used</span>
                    </div>
                    <Progress value={(credits / maxCredits) * 100} className="h-2" />
                    <p className="text-[0.8rem] text-muted-foreground">
                        Credits reset monthly. Upgrade to Pro for unlimited generation.
                    </p>
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/20">
                 <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3" />
                    Secure payments processed by Razorpay (Mock)
                 </p>
            </CardFooter>
        </Card>
    );
}
