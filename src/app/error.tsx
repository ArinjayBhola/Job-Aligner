"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
      <div className="h-20 w-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h2 className="text-3xl font-bold mb-2">Something went wrong!</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        We encountered an unexpected error. Our team has been notified.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition shadow-lg shadow-primary/25"
      >
        <RefreshCcw className="w-5 h-5" />
        Try again
      </button>
    </div>
  );
}
