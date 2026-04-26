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
