import type { ApiErrorBody } from "@/types";

const DEFAULT_API_BASE_URL = "http://localhost:4000";
const AUTH_STORAGE_KEY = "allocate.auth.session";

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
  init?: RequestInit
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
