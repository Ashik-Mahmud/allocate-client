"use client";

import { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { getProfile } from "@/lib/services/auth";
import type { User } from "@/types";

type CurrentUserContextValue = {
  user: User | null;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  refreshUser: () => Promise<User | null>;
};

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

function resolveUserFromProfileResponse(response: unknown): User | null {
  if (!response || typeof response !== "object") {
    return null;
  }

  const typed = response as { data?: unknown };

  if (!typed.data || typeof typed.data !== "object") {
    return null;
  }

  return typed.data as User;
}

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const isAuthenticated = session.status === "authenticated";

  const profileQuery = useQuery({
    queryKey: ["auth", "current-user"],
    queryFn: getProfile,
    enabled: isAuthenticated,
    staleTime: 5_000,
    refetchInterval: isAuthenticated ? 15_000 : false,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  });

  const user = useMemo(() => {
    if (!isAuthenticated) {
      return null;
    }

    const fromApi = resolveUserFromProfileResponse(profileQuery.data);
    if (fromApi) {
      return fromApi;
    }

    return (session.data?.user as User | null | undefined) ?? null;
  }, [isAuthenticated, profileQuery.data, session.data?.user]);

  const value = useMemo<CurrentUserContextValue>(() => {
    return {
      user,
      isLoading: isAuthenticated ? profileQuery.isLoading : session.status === "loading",
      isFetching: profileQuery.isFetching,
      error: profileQuery.error,
      refreshUser: async () => {
        const result = await profileQuery.refetch();
        return resolveUserFromProfileResponse(result.data);
      },
    };
  }, [isAuthenticated, profileQuery, session.status, user]);

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUserContext() {
  const context = useContext(CurrentUserContext);

  if (!context) {
    throw new Error("useCurrentUserContext must be used within CurrentUserProvider");
  }

  return context;
}
