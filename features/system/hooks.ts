import { OrganizationListFilters, SystemSettingsData } from "@/types/systemGlobal";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getSystemSettings, updateSystemSettings, fetchOrganizations } from "@/lib/services/system";
import { apiRequest } from "@/lib/services/http";
import { ApiResponse } from "@/types";

export const SystemKeys = {
    settings: ["system", "settings"] as const,
    annoucements: ["system", "announcements"] as const,
    organizations: (filters?: OrganizationListFilters) => ["system", "organizations", filters] as const,
    organization: (id: string) => ["system", "organization", id] as const,
    toupCredits: ["system", "topup-credits"] as const,
    users: ["system", "users"] as const,
    resetPassword: (userId: string) => ["system", "reset-password", userId] as const,
    transactionList: ["system", "transactions"] as const,
    revenueAnalysis: ["system", "revenue-analysis"] as const,
    activityLogsById: (id: string) => ["system", "activity-logs", id] as const,


};


// Update system settings
export const useUpdateSystemSettings = () => {
    const queryClient = new QueryClient();
    return useMutation({
        mutationFn: (payload: Partial<SystemSettingsData>) => updateSystemSettings(payload),
        onSuccess: () => {
            // Invalidate the system settings query to refetch the updated settings
            queryClient.invalidateQueries({ queryKey: SystemKeys.settings });
        },
    });
};

// Get system settings
export const useGetSystemSettings = () => {
    return useQuery({
        queryKey: SystemKeys.settings,
        queryFn: () => getSystemSettings(),
    });
};

// hook to fetch organizations with filters
export const useFetchOrganizations = (filters: OrganizationListFilters) => {
    return useQuery({
        queryKey: SystemKeys.organizations(filters),
        queryFn: () => fetchOrganizations(filters),
    });
};