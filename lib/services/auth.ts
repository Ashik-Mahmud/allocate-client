import type { ApiResponse, AuthResponse, LoginPayload, RegisterPayload, User } from "@/types";

import { apiRequest } from "./http";

export function register(payload: RegisterPayload) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getProfile() {
  return apiRequest<ApiResponse<User>>("/auth/profile", {
    method: "GET",
  });
}

export function getProfileWithToken(accessToken: string) {
  return apiRequest<ApiResponse<User>>("/auth/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

type SendVerificationEmailResponse = {
  success?: boolean;
  message?: string;
};

export function sendVerificationEmail() {
  return apiRequest<SendVerificationEmailResponse>("/auth/send-verification-email", {
    method: "POST",
  });
}

export function verifyEmail(token: string) {
  return apiRequest<ApiResponse<{ success: boolean; message?: string }>>(`/auth/verify?token=${token}`, {
    method: "GET",
  });
}