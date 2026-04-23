import type { ApiErrorBody } from "@/types";

const DEFAULT_API_BASE_URL = "http://localhost:4000";

function getBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!fromEnv) {
    return DEFAULT_API_BASE_URL;
  }

  return fromEnv.replace(/\/$/, "");
}

export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody | null;

  constructor(message: string, status: number, body: ApiErrorBody | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
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
    return typed.message ?? typed.error ?? `Request failed with status ${status}`;
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
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
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
