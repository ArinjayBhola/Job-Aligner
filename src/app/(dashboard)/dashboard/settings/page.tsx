"use client";

import { ProfileForm } from "@/components/settings/profile-form";
import { BillingSection } from "@/components/settings/billing-section";

export default function SettingsPage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences.
                    </p>
                </div>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                    <ProfileForm />
                    <BillingSection />
                </div>
                
                {/* Could add another column for other settings like notifications/integrations */}
                {/* 
                <div className="space-y-6">
                     <Card>...</Card>
                </div> 
                */}
            </div>
        </div>
    );
}
