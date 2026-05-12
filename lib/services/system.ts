import { ApiResponse } from "@/types";
import { apiRequest } from "./http";
import { SystemSettingsData, BroadcastAnnouncementPayload, OrganizationListFilters, AdminUserFilters, TransactionListFilters, RevenueAnalyticsFilters, ActivityLogFilters, UpdateOrganizationPayload, CreditsTopUpPayload } from "@/types/systemGlobal";
import { PaginatedResponse } from "@/types";
import { Organizations } from "@/types/organization";



// service to update system settings
export const updateSystemSettings = async (payload: Partial<SystemSettingsData>) => {
    return apiRequest<ApiResponse<SystemSettingsData>>("/admin/system-settings", {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

// Service to fetch system-wide settings and configurations
export const getSystemSettings = async () => {
    return apiRequest<ApiResponse<SystemSettingsData>>(`/admin/system-settings`, { method: "GET" });
}


// Broadcaster for system-wide announcements or alerts
export const broadcastSystemAnnouncement = async (payload: BroadcastAnnouncementPayload) => {
    return apiRequest<ApiResponse<null>>("/admin/announcements", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
// Service to fetch all organizations with pagination and filtering
export const fetchOrganizations = async (filters: OrganizationListFilters) => {
    const queryParams = new URLSearchParams();
    if (filters.organizationId) queryParams.append("organizationId", filters.organizationId);
    if (filters.name) queryParams.append("name", filters.name);
    if (filters.verified !== undefined) queryParams.append("verified", String(filters.verified));
    if (filters.page) queryParams.append("page", String(filters.page));
    if (filters.limit) queryParams.append("limit", String(filters.limit));
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.planType && filters.planType !== "all") queryParams.append("planType", filters.planType);
    if (filters.showDeletedOrg !== undefined) queryParams.append("showDeletedOrg", String(filters.showDeletedOrg));
    return apiRequest<PaginatedResponse<Organizations>>(`/admin/organizations?${queryParams?.toString() || ''}`, { method: "GET" });
}



// Service to fetch a single organization by ID
export const fetchOrganizationById = async (id: string) => {
    return apiRequest<ApiResponse<Organizations>>(`/admin/organizations/${id}`, { method: "GET" });
}

// Service to delete an organization
export const deleteOrganization = async (id: string) => {
    return apiRequest<ApiResponse<null>>(`/admin/organizations/${id}/delete`, { method: "DELETE" });
}

// Service to restore a deleted organization
export const restoreOrganization = async (id: string) => {
    return apiRequest<ApiResponse<null>>(`/admin/organizations/${id}/restore`, { method: "PATCH" });
}
// Service to verify an organization
export const updateOrganization = async (payload: { id: string, updateOrganization: Partial<UpdateOrganizationPayload> }) => {
    return apiRequest<ApiResponse<null>>(`/admin/organizations/${payload.id}`,
        {
            method: "PATCH",
            body: JSON.stringify(payload.updateOrganization),
        }
    );
}

// Service to Topup Credits for an organization
export const topupOrganizationCredits = async (id: string, payload: CreditsTopUpPayload) => {
    return apiRequest<ApiResponse<null>>(`/admin/organizations/${id}/credits`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}


// Service to fetch all users with pagination and filtering
export const fetchUsers = async (filters: AdminUserFilters) => {
    const queryParams = new URLSearchParams();
    if (filters.organizationId) queryParams.append("organizationId", filters.organizationId);
    if (filters.name) queryParams.append("name", filters.name);
    if (filters.email) queryParams.append("email", filters.email);
    if (filters.role) queryParams.append("role", filters.role);
    queryParams.append("page", String(filters.page));
    queryParams.append("limit", String(filters.limit));
    if (filters.search) queryParams.append("search", filters.search);
    return apiRequest<PaginatedResponse<any>>(`/admin/users?${queryParams?.toString() || ''}`, { method: "GET" });
}

// Service to reset a user's password
export const resetUserPassword = async (userId: string) => {
    return apiRequest<ApiResponse<null>>(`/admin/users/${userId}/reset-password`, {
        method: "PATCH",
    });
}

// Service to get transaction list with pagination and filtering
export const fetchTransactionList = async (filters: TransactionListFilters) => {
    const queryParams = new URLSearchParams();
    if (filters.organizationId) queryParams.append("organizationId", filters.organizationId);
    if (filters.type) queryParams.append("type", filters.type);
    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);
    if (filters.page) queryParams.append("page", String(filters.page));
    if (filters.limit) queryParams.append("limit", String(filters.limit));
    return apiRequest<PaginatedResponse<any>>(`/admin/subscriptions/transactions?${queryParams?.toString() || ''}`, { method: "GET" });
}

// Service to fetch revenue analytics data
export const fetchRevenueAnalytics = async (filters: RevenueAnalyticsFilters) => {
    const queryParams = new URLSearchParams();
    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);
    if (filters.organizationId) queryParams.append("organizationId", filters.organizationId);
    queryParams.append("groupBy", filters.groupBy);
    return apiRequest<ApiResponse<any>>(`/admin/analytics/revenue?${queryParams?.toString() || ''}`, { method: "GET" });
}

// Service to activity logs
export const fetchActivityLogs = async (filters: ActivityLogFilters) => {
    const queryParams = new URLSearchParams();
    if (filters.organizationId) queryParams.append("organizationId", filters.organizationId);
    if (filters.userId) queryParams.append("userId", filters.userId);
    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);
    if (filters.page) queryParams.append("page", String(filters.page));
    if (filters.limit) queryParams.append("limit", String(filters.limit));
    return apiRequest<PaginatedResponse<any>>(`/admin/activity-logs?${queryParams?.toString() || ''}`, { method: "GET" });
}