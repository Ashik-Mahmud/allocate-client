"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession } from "next-auth/react";

import { login, register, sendVerificationEmail } from "@/lib/services/auth";

import {
    buildAuthSession,
    clearAuthSession,
    saveAuthSession,
} from "./storage";
import type { User } from "@/types";
import { useCurrentUserContext } from "./current-user-context";

export type CurrentUser = User;

export function useAuthSession() {
    return useSession();
}

export function useNextAuthSession() {
    return useSession();
}

export function useCurrentUser() {
    return useCurrentUserContext();
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

export function useSendVerificationEmailMutation() {
    return useMutation({
        mutationFn: sendVerificationEmail,
    });
}
