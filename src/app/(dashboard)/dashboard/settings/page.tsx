"use client";

import { ProfileForm } from "@/components/settings/profile-form";
import { BillingSection } from "@/components/settings/billing-section";
import { User, CreditCard } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-10 pt-4">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">Account Settings</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Manage your profile, billing preferences, and account security.
                </p>
            </div>
            
            <div className="space-y-8">
                {/* Profile Section */}
                <section className="space-y-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
                    <div className="flex items-center gap-2 text-xl font-bold border-b border-border/40 pb-2 text-foreground/80">
                        <User className="w-5 h-5 text-primary" />
                        <h2>Profile Information</h2>
                    </div>
                    {/* Components are self-contained Cards now */}
                    <ProfileForm />
                </section>

                {/* Billing Section */}
                <section className="space-y-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
                    <div className="flex items-center gap-2 text-xl font-bold border-b border-border/40 pb-2 text-foreground/80">
                        <CreditCard className="w-5 h-5 text-purple-500" />
                        <h2>Billing & Credits</h2>
                    </div>
                    <BillingSection />
                </section>
            </div>
        </div>
    );
}
