import { ApiResponse } from "@/types";
import { apiRequest } from "./http"
import { StaffDashboardData, TdashboardFilter, TdashboardOverviewResponse } from "@/types/dashboard";
import { PlatformInsights } from "@/types/systemGlobal";

// Service to fetch staff insights for the dashboard;
export const fetchStaffInsights = (payload: TdashboardFilter) => {
    return apiRequest<TdashboardOverviewResponse<StaffDashboardData>>(`/dashboard/staff-insights`, {
        method: "GET",
    });
}

// Service to fetch organization insights for the dashboard;
export const fetchOrganizationInsights = (payload: TdashboardFilter) => {
    return apiRequest<TdashboardOverviewResponse<{}>>(`/dashboard/organization-insights`, {
        method: "GET",
    });
}

// Service to fetch System insights for the dashboard;
export const fetchSystemInsights = (payload: TdashboardFilter) => {
    return apiRequest<TdashboardOverviewResponse<PlatformInsights>>(`/dashboard/system-insights`, {
        method: "GET",
    });
}