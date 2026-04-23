"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
  useSession,
} from "next-auth/react";

import { login, register } from "@/lib/services/auth";

import {
  buildAuthSession,
  clearAuthSession,
  readAuthSession,
  saveAuthSession,
} from "./storage";

export const authKeys = {
  session: ["auth", "session"] as const,
};

export function useAuthSession() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: async () => readAuthSession(),
    initialData: () => readAuthSession(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useNextAuthSession() {
  return useSession();
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: async (response, variables) => {
      const nextSession = buildAuthSession(response);
      saveAuthSession(nextSession);
      queryClient.setQueryData(authKeys.session, nextSession);

      await nextAuthSignIn("credentials", {
        email: variables.email,
        password: variables.password,
        redirect: false,
      });
    },
  });
}

export function useSignInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: async (response, variables) => {
      const nextSession = buildAuthSession(response);
      saveAuthSession(nextSession);
      queryClient.setQueryData(authKeys.session, nextSession);

      await nextAuthSignIn("credentials", {
        email: variables.email,
        password: variables.password,
        redirect: false,
      });
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return async () => {
    clearAuthSession();
    queryClient.setQueryData(authKeys.session, null);
    await nextAuthSignOut({ redirect: false });
  };
}
