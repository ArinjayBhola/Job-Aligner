"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is fresh for 5 minutes.
            staleTime: 5 * 60 * 1000,
            // If data is available, do not refetch on mount.
            refetchOnMount: false,
            // Do not refetch on window focus (optional, but good for reducing requests).
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
