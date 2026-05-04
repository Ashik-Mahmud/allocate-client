import { ApiResponse } from "@/types";
import { apiRequest } from "./http"
import { TdashboardFilter } from "@/types/dashboard";

// Service to fetch staff insights for the dashboard;
export const fetchStaffInsights = (payload: TdashboardFilter) => {
    return apiRequest<ApiResponse<{}>>(`/dashboard/staff-insights`, {
        method: "GET",
    });
}

// Service to fetch organization insights for the dashboard;
export const fetchOrganizationInsights = (payload: TdashboardFilter) => {
    return apiRequest<ApiResponse<{}>>(`/dashboard/organization-insights`, {
        method: "GET",
    });
}

// Service to fetch System insights for the dashboard;
export const fetchSystemInsights = (payload: TdashboardFilter) => {
    return apiRequest<ApiResponse<{}>>(`/dashboard/system-insights`, {
        method: "GET",
    });
}