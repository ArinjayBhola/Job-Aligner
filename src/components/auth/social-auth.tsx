"use client";

import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";
import { signIn } from "next-auth/react";

interface SocialAuthProps {
  isLoading: boolean;
  callbackUrl: string;
}

export function SocialAuth({ isLoading, callbackUrl }: SocialAuthProps) {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleGoogleSignIn}
        className="w-full relative h-11 bg-background hover:bg-accent/50 transition-colors border-input"
      >
        <span className="absolute left-4 top-[10px]">
          <Chrome className="mr-2 h-5 w-5 text-muted-foreground" />
        </span>
        <span className="ml-6">Continue with Google</span>
      </Button>
    </div>
  );
}
