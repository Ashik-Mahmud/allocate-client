"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import type { Session } from "next-auth";
import { CurrentUserProvider } from "@/features/auth/current-user-context";
import { OrganizationDeletedBlocker } from "@/features/auth/organization-deleted-blocker";
import { NotificationRealtimeSync } from "@/features/notifications/notification-realtime-sync";
import { RealtimeSocketProvider } from "@/features/realtime";
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
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
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
      enableColorScheme={false}
    >
      <SessionProvider session={session} refetchOnWindowFocus={false}>
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            <CurrentUserProvider>
              <OrganizationDeletedBlocker />
              <RealtimeSocketProvider>
                <NotificationRealtimeSync />
                {children}
              </RealtimeSocketProvider>
            </CurrentUserProvider>
          </QueryClientProvider>
        </TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
