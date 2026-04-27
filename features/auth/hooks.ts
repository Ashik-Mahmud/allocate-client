"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession } from "next-auth/react";

import { login, register } from "@/lib/services/auth";

import {
    buildAuthSession,
    clearAuthSession,
    saveAuthSession,
} from "./storage";
import type { User } from "@/types";

export type CurrentUser = User;

export function useAuthSession() {
    return useSession();
}

export function useNextAuthSession() {
    return useSession();
}

export function useCurrentUser() {
    const sessionQuery = useAuthSession();
    const user = sessionQuery.data?.user ?? null;
    return {
        user,
        isLoading: sessionQuery.status === "loading",
        isFetching: false,
        error: null,
    };
}

export function useRegisterMutation() {
    return useMutation({
        mutationFn: register,
        onSuccess: async (response, variables) => {
            const nextSession = buildAuthSession(response);
            saveAuthSession(nextSession);

            await nextAuthSignIn("credentials", {
                email: variables.email,
                password: variables.password,
                redirect: false,
            });
        },
    });
}

export function useSignInMutation() {
    return useMutation({
        mutationFn: login,
        onSuccess: async (response, variables) => {
            const nextSession = buildAuthSession(response);
            saveAuthSession(nextSession);

            await nextAuthSignIn("credentials", {
                email: variables.email,
                password: variables.password,
                redirect: false,
            });
        },
    });
}

export function useSignOut() {
    return async () => {
        clearAuthSession();
        await nextAuthSignOut({ redirect: false });
    };
}
