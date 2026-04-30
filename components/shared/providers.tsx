"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import type { Session } from "next-auth";
import { CurrentUserProvider } from "@/features/auth/current-user-context";
import { TooltipProvider } from "../ui/tooltip";


type ProvidersProps = {
  children: React.ReactNode;
  session: Session | null;
};

export function Providers({ children, session }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="allocate.theme"
    >
      <SessionProvider session={session} refetchOnWindowFocus={false}>
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            <CurrentUserProvider>{children}</CurrentUserProvider>
          </QueryClientProvider>
        </TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
