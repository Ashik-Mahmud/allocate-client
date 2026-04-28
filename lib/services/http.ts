import type { ApiErrorBody } from "@/types";

const DEFAULT_API_BASE_URL = "http://localhost:4000";
const AUTH_STORAGE_KEY = "allocate.auth.session";
const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired";
const REFRESH_TOKEN_PATH = "/auth/refresh-token";

type StoredAuthSession = {
  user?: unknown;
  accessToken?: string | null;
  refreshToken?: string | null;
};

let refreshAccessTokenPromise: Promise<string | null> | null = null;

function getBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!fromEnv) {
    return DEFAULT_API_BASE_URL;
  }

  return fromEnv.replace(/\/$/, "");
}

function getAccessTokenFromStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as { accessToken?: unknown };
    return typeof parsed.accessToken === "string" && parsed.accessToken.trim().length > 0
      ? parsed.accessToken
      : null;
  } catch {
    return null;
  }
}

function getAuthSessionFromStorage(): StoredAuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as StoredAuthSession;
  } catch {
    return null;
  }
}

function saveAuthSessionToStorage(session: StoredAuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

function clearAuthSessionStorage() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

function emitAuthSessionExpired() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
}

function extractTokensFromRefreshBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return null;
  }

  const typed = body as {
    token?: unknown;
    accessToken?: unknown;
    refreshToken?: unknown;
    data?: {
      token?: unknown;
      accessToken?: unknown;
      refreshToken?: unknown;
    };
  };

  const payload = typed.data ?? typed;

  const nextAccessToken =
    typeof payload.accessToken === "string"
      ? payload.accessToken : null;

  const nextRefreshToken =
    typeof payload.refreshToken === "string" ? payload.refreshToken : null;

  if (!nextAccessToken) {
    return null;
  }

  return {
    accessToken: nextAccessToken,
    refreshToken: nextRefreshToken,
  };
}

async function refreshAccessTokenIfNeeded() {
  const currentSession = getAuthSessionFromStorage();
  const refreshToken = currentSession?.refreshToken;

  if (!refreshToken) {
    return null;
  }

  if (refreshAccessTokenPromise) {
    return refreshAccessTokenPromise;
  }

  refreshAccessTokenPromise = (async () => {
    try {
      const response = await fetch(`${getBaseUrl()}${REFRESH_TOKEN_PATH}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const body = await parseResponseBody(response);

      if (!response.ok) {
        clearAuthSessionStorage();
        emitAuthSessionExpired();
        return null;
      }

      const tokens = extractTokensFromRefreshBody(body);

      if (!tokens?.accessToken) {
        clearAuthSessionStorage();
        emitAuthSessionExpired();
        return null;
      }

      saveAuthSessionToStorage({
        ...currentSession,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken ?? refreshToken,
      });

      return tokens.accessToken;
    } catch {
      return null;
    }
  })();

  try {
    return await refreshAccessTokenPromise;
  } finally {
    refreshAccessTokenPromise = null;
  }
}

export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody | null;

  constructor(message: string, status: number, body: ApiErrorBody | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;

    // Set the prototype explicitly to maintain instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Parses the response body as JSON if possible, otherwise returns the raw text

async function parseResponseBody(response: Response): Promise<unknown> {
  const rawText = await response.text();

  if (!rawText) {
    return null;
  }

  try {
    return JSON.parse(rawText) as unknown;
  } catch {
    return rawText;
  }
}

function getErrorMessage(status: number, body: unknown) {
  if (body && typeof body === "object") {
    const typed = body as ApiErrorBody;
    const withUnknownFields = body as { error?: unknown; details?: unknown };

    if (typeof typed.message === "string" && typed.message.trim().length > 0) {
      return typed.message;
    }

    if (typeof withUnknownFields.error === "string" && withUnknownFields.error.trim().length > 0) {
      return withUnknownFields.error;
    }

    if (
      withUnknownFields.error &&
      typeof withUnknownFields.error === "object" &&
      "message" in withUnknownFields.error &&
      typeof withUnknownFields.error.message === "string" &&
      withUnknownFields.error.message.trim().length > 0
    ) {
      return withUnknownFields.error.message;
    }

    if (typeof withUnknownFields.details === "string" && withUnknownFields.details.trim().length > 0) {
      return withUnknownFields.details;
    }

    if (
      withUnknownFields.details &&
      typeof withUnknownFields.details === "object" &&
      "message" in withUnknownFields.details &&
      typeof withUnknownFields.details.message === "string" &&
      withUnknownFields.details.message.trim().length > 0
    ) {
      return withUnknownFields.details.message;
    }

    return `Request failed with status ${status}`;
  }

  if (typeof body === "string" && body.trim().length > 0) {
    return body;
  }

  return `Request failed with status ${status}`;
}

export async function apiRequest<TResponse>(
  path: string,
  init?: RequestInit,
  allowRetry = true,
  skipResponseBody = false
): Promise<TResponse> {
  const token = getAccessTokenFromStorage();
  const headers = new Headers(init?.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers,
  });

  if (
    response.status === 401 &&
    allowRetry &&
    path !== REFRESH_TOKEN_PATH
  ) {
    const nextAccessToken = await refreshAccessTokenIfNeeded();

    if (nextAccessToken) {
      return apiRequest<TResponse>(path, init, false);
    }

    clearAuthSessionStorage();
    emitAuthSessionExpired();
  }

  if (skipResponseBody) {
    if (!response.ok) {
      throw new ApiError(getErrorMessage(response.status, null), response.status, null);
    }

    return undefined as TResponse;
  }

  const body = await parseResponseBody(response);



  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(response.status, body),
      response.status,
      body && typeof body === "object" ? (body as ApiErrorBody) : null
    );
  }

  return body as TResponse;
}

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
