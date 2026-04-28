import type {
  ApiResponse,
  PaginatedResponse,
  StaffDailyPlanResponse,
  StaffWorkQueueFilters,
  StaffWorkQueueResponse,
  UpdateStaffWorkQueueStatusPayload,
} from "@/types";

import { apiRequest } from "./http";
import { AssignMultipleStaffCreditsPayload, GetStaffCreditLogFilter, StaffDetails, StaffListFilters, StaffManagementFormValues } from "@/types/staff";

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


export const createStaffByOrgAdmin = (payload: StaffManagementFormValues) => {
  return apiRequest(`/staff/create`, {
    method: "POST",
    body: JSON.stringify(payload),
  }, true, true);
}

// Get staff list (this is a placeholder and should be replaced with the actual endpoint when available)
export const getStaffList = (filters?: StaffListFilters) => {
  const params = new URLSearchParams();

  if (typeof filters?.page === "number") {
    params.set("page", String(filters.page));
  }
  if (typeof filters?.limit === "number") {
    params.set("limit", String(filters.limit));
  }
  if (filters?.search) {
    params.set("search", filters.search);
  }
  if (filters?.email) {
    params.set("email", filters.email);
  }
  const query = params.toString();

  return apiRequest<PaginatedResponse<StaffDetails>>(`/staff/list${query ? `?${query}` : ''}`, {
    method: "GET",
  });
};

// Update staff details by ID
export const updateStaffDetails = (staffId: string, payload: StaffManagementFormValues) => {
  return apiRequest(`/staff/update/${staffId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// Get staff details by ID (
export const getStaffDetails = (staffId: string) => {
  return apiRequest(`/staff/${staffId}`, {
    method: "GET",
  });
}

// Delete staff member by ID 
export const deleteStaff = (staffId: string) => {
  return apiRequest<ApiResponse<StaffDetails>>(`/staff/${staffId}/delete`, {
    method: "DELETE",
  });
}

// Assign credits to staff member
export const assignCreditsToStaff = (staffId: string, credits: number) => {
  return apiRequest(`/staff/${staffId}/credits`, {
    method: "POST",
    body: JSON.stringify({ credits }),
  });
}

// Assign credits to multiple staff members
export const assignCreditsToMultipleStaff = (payload: AssignMultipleStaffCreditsPayload) => {
  return apiRequest(`/staff/credits`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Revoke credits from staff member
export const revokeCreditsFromStaff = (staffId: string, credits: number) => {
  return apiRequest(`/staff/${staffId}/credits/revoke`, {
    method: "POST",
    body: JSON.stringify({ credits }),
  });
}

// Get Staff Credits logs
export const getStaffCreditsLogs = (payload: GetStaffCreditLogFilter) => {
  const params = new URLSearchParams();
  if (typeof payload.page === "number") {
    params.set("page", String(payload.page));
  }
  if (typeof payload.limit === "number") {
    params.set("limit", String(payload.limit));
  }
  if (payload.staffId) {
    params.set("staffId", payload.staffId);
  }
  if (payload.search) {
    params.set("search", payload.search);
  }
  const query = params.toString();

  return apiRequest(`/staff/credits/logs${query ? `?${query}` : ''}`, {
    method: "GET",
  });
}
