import type {
  StaffDailyPlanResponse,
  StaffWorkQueueFilters,
  StaffWorkQueueResponse,
  UpdateStaffWorkQueueStatusPayload,
} from "@/types";

import { apiRequest } from "./http";

function buildQueryString(filters?: StaffWorkQueueFilters) {
  if (!filters) {
    return "";
  }

  const params = new URLSearchParams();

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.priority) {
    params.set("priority", filters.priority);
  }

  if (typeof filters.page === "number") {
    params.set("page", String(filters.page));
  }

  if (typeof filters.limit === "number") {
    params.set("limit", String(filters.limit));
  }

  const query = params.toString();

  return query ? `?${query}` : "";
}

export function getStaffWorkQueue(filters?: StaffWorkQueueFilters) {
  return apiRequest<StaffWorkQueueResponse>(`/staff/work-queue${buildQueryString(filters)}`);
}

export function getStaffDailyPlan(date?: string) {
  const suffix = date ? `?date=${encodeURIComponent(date)}` : "";
  return apiRequest<StaffDailyPlanResponse>(`/staff/daily-plan${suffix}`);
}

export function updateStaffWorkQueueStatus(
  workItemId: string,
  payload: UpdateStaffWorkQueueStatusPayload
) {
  return apiRequest<{ message?: string }>(`/staff/work-queue/${workItemId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
