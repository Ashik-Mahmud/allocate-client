import { ActivityLogFilters, AdminUserFilters, BroadcastAnnouncementPayload, CreditsTopUpPayload, OrganizationListFilters, RevenueAnalyticsFilters, SystemSettingsData, TransactionListFilters, UpdateOrganizationPayload } from "@/types/systemGlobal";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSystemSettings, updateSystemSettings, fetchOrganizations, broadcastSystemAnnouncement, fetchOrganizationById, updateOrganization, deleteOrganization, restoreOrganization, fetchUsers, resetUserPassword, topupOrganizationCredits, fetchTransactionList, fetchRevenueAnalytics, fetchActivityLogs } from "@/lib/services/system";
import { apiRequest } from "@/lib/services/http";
import { ApiResponse } from "@/types";
import { organizationKeys } from "../organization";
import { staffKeys } from "../staff";

export const SystemKeys = {
    settings: ["system", "settings"] as const,
    annoucements: ["system", "announcements"] as const,
    organizations: (filters?: OrganizationListFilters) => ["system", "organizations", filters] as const,
    organization: (id: string) => ["system", "organization", id] as const,
    toupCredits: ["system", "topup-credits"] as const,
    users: (filters?: AdminUserFilters) => ["system", "users", filters] as const,
    resetPassword: (userId: string) => ["system", "reset-password", userId] as const,
    transactionList: (filters?: TransactionListFilters) => ["system", "transactions", filters] as const,
    revenueAnalysis: (filters?: RevenueAnalyticsFilters) => ["system", "revenue-analysis", filters] as const,
    activityLogs: (filters?: ActivityLogFilters) => ["system", "activity-logs", filters] as const,


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
// Hook to fetch organization by ID
export const useFetchOrganizationById = (id: string) => {
    return useQuery({
        queryKey: SystemKeys.organization(id),
        queryFn: () => fetchOrganizationById(id),
        enabled: Boolean(id),
    });
}

// Hook to delete an organization
export const useDeleteOrganizationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteOrganization(id),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: SystemKeys.organizations() }),
            ]);
        },
    });
};

// Hook to restore an organization (if soft-deleted)
export const useRestoreOrganizationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => restoreOrganization(id),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: SystemKeys.organizations() }),
            ]);
        }
    });
};

// Hook to send broadcast announcement
export const useBroadcastAnnouncement = () => {
    return useMutation({
        mutationFn: (payload: BroadcastAnnouncementPayload) => broadcastSystemAnnouncement(payload),
        onSuccess: () => {
            // Invalidate the system settings query to refetch the updated settings
            // queryClient.invalidateQueries({ queryKey: SystemKeys.settings });
        },
    });
};

// Hook to make verify organization API call
export const useUpdateOrganizationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { id: string, updateOrganization: Partial<UpdateOrganizationPayload> }) => updateOrganization(payload),
        onSuccess: (data, variables) => {
            void Promise.all([
                queryClient.invalidateQueries({
                    queryKey: SystemKeys.organizations(),
                    exact: false
                }),
                queryClient.invalidateQueries({ queryKey: SystemKeys.organization(variables.id) }),
            ]);
        },
    });
};


// Hook to get all the users in the system (for admin user management)
export const useFetchAllUsers = (filters: AdminUserFilters) => {
    return useQuery({
        queryKey: SystemKeys.users(filters),
        queryFn: () => fetchUsers(filters),
    });
}

// Hook to reset user password (for admin user management)
export const useResetUserPasswordMutation = () => {
    return useMutation({
        mutationFn: (userId: string) => resetUserPassword(userId),
        onSuccess: () => {
            // Invalidate the system settings query to refetch the updated settings
            // queryClient.invalidateQueries({ queryKey: SystemKeys.settings });
        },
    });
}

// Hook to top up credits for an organization
export const useTopUpCreditsMutation = () => {
    return useMutation({
        mutationFn: (payload: { orgId: string, data: CreditsTopUpPayload }) => {
            return topupOrganizationCredits(payload.orgId, payload.data);
        },
        onSuccess: () => {
            // Invalidate the system settings query to refetch the updated settings
            // queryClient.invalidateQueries({ queryKey: SystemKeys.settings });
        },
    });
}

// Hook to fetch transaction list with filters
export const useFetchTransactionList = (filters: TransactionListFilters) => {
    return useQuery({
        queryKey: SystemKeys.transactionList(filters),
        queryFn: () => fetchTransactionList(filters),
    });
}

// Hook to get revenue analytics data with filters
export const useFetchRevenueAnalytics = (filters: RevenueAnalyticsFilters) => {
    return useQuery({
        queryKey: SystemKeys.revenueAnalysis(filters),
        queryFn: () => fetchRevenueAnalytics(filters),
    });
}

// Hook to fetch activity logs by ID
export const useFetchActivityLogs = (filters: ActivityLogFilters) => {
    return useQuery({
        queryKey: SystemKeys.activityLogs(filters),
        queryFn: () => fetchActivityLogs(filters),
       
    });
}