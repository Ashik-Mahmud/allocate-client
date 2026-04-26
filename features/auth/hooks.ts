"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    signIn as nextAuthSignIn,
    signOut as nextAuthSignOut,
    useSession,
} from "next-auth/react";

import { getProfile, login, register } from "@/lib/services/auth";

import {
    buildAuthSession,
    clearAuthSession,
    readAuthSession,
    saveAuthSession,
} from "./storage";
import { AuthResponse, AuthUser } from "@/types";

export const authKeys = {
    profile: ["auth", "profile"] as const,
    session: ["auth", "session"] as const,
};
function resolveAuthUser(response: AuthResponse): AuthUser | null {
    const payload = response.data ?? response;
    return payload.user ?? null;
}

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

export function useAuthProfileQuery() {
    const queryClient = useQueryClient();
    const currentSession = useAuthSession();

    return useQuery({
        queryKey: authKeys.profile,
        queryFn: () => getProfile(),
        enabled: Boolean(currentSession.data?.accessToken),
        staleTime: 15_000,
        refetchInterval: 30_000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 1,

    });
}

/*    onSuccess: (response: AuthResponse) => {
            const latestUser = resolveAuthUser(response);
            const prev = currentSession.data;

            if (!prev || !latestUser) {
                return;
            }

            const nextSession = {
                ...prev,
                user: latestUser,
            };

            saveAuthSession(nextSession);
            queryClient.setQueryData(authKeys.session, nextSession);
        }, */

export function useCurrentUser() {
    const sessionQuery = useAuthSession();
    const profileQuery = useAuthProfileQuery();
    const profilePayload = profileQuery?.data?.data ?? profileQuery.data?.data;
    const profileUser = profilePayload ?? null;
    const user = profileUser ?? sessionQuery.data?.user ?? null;
    return {
        user,
        isLoading: sessionQuery.isLoading || profileQuery.isLoading,
        isFetching: profileQuery.isFetching,
        error: profileQuery.error,
    };
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
