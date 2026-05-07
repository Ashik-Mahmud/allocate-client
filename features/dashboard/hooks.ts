import { fetchOrganizationInsights, fetchStaffInsights, fetchSystemInsights } from "@/lib/services/dashboard";
import { TdashboardFilter } from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";

export const DashboardKeys = {
    all: ["dashboard"] as const,
    overview: () => [...DashboardKeys.all, "overview"] as const,
};
// Hook to get dashboard overview data (e.g., stats, quick links)
export const useDashboardOverview = (filters?: TdashboardFilter) => {
    return useQuery({
        queryKey: DashboardKeys.overview(),
        queryFn: () => fetchStaffInsights({}), // Replace with appropriate service for fetching dashboard overview
        staleTime: 10 * 60 * 1000, // Cache for 10 minutes
        refetchOnWindowFocus: true, 
        refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes to keep data fresh

    });
}

// Hook to get organization insights for the dashboard
export const useOrganizationInsights = (filters?: TdashboardFilter) => {
    return useQuery({
        queryKey: DashboardKeys.overview(),
        queryFn: () => fetchOrganizationInsights({}),
        staleTime: 10 * 60 * 1000, // Cache for 10 minutes
        refetchOnWindowFocus: true, 
    });
}

export const useSystemInsights = (filters?: TdashboardFilter) => {
    return useQuery({
        queryKey: DashboardKeys.overview(),
        queryFn: () => fetchSystemInsights({}), // Replace with appropriate service for fetching system insights
        staleTime: 10 * 60 * 1000, // Cache for 10 minutes
        refetchOnWindowFocus: false, // Don't refetch on window focus to reduce unnecessary calls
    });
}