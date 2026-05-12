import { createSalesInquiry, deleteSalesInquiry, fetchSalesInquiries, fetchSalesInquiryById, fetchSalesStats, updateSalesInquiry } from "@/lib/services/sales";
import { CreateSalesInquiryDto, SalesInquiryFiltersDto, SalesStatsFiltersDto, UpdateSalesInquiryDto } from "@/types/sales";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

export const ContactSalesKeys = {
    all: ["contact-sales"] as const,
    lists: (filters?: SalesInquiryFiltersDto) => [...ContactSalesKeys.all, "list", filters] as const,
    details: () => [...ContactSalesKeys.all, "detail"] as const,

    stats: (filters?: SalesStatsFiltersDto) => [...ContactSalesKeys.all, "stats", filters] as const,
};

// Hook to create a new sales inquiry
export const useCreateSalesInquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (inquiry: CreateSalesInquiryDto) => createSalesInquiry(inquiry),
        onSuccess: async () => {
            return await Promise.all([
                queryClient.invalidateQueries({ queryKey: ContactSalesKeys.lists() }),
            ]);
        }
    });
};

// Hook to update an existing sales inquiry
export const useUpdateSalesInquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { id: string; data: UpdateSalesInquiryDto }) => updateSalesInquiry(payload.id, payload.data),
        onSuccess: async () => {
            return await Promise.all([
                queryClient.invalidateQueries({ queryKey: ContactSalesKeys.details() }),
                queryClient.invalidateQueries({ queryKey: ContactSalesKeys.all }),
            ]);
        }
    });
};

// Hook to delete a sales inquiry
export const useDeleteSalesInquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteSalesInquiry(id),
        onSuccess: async () => {
            return await Promise.all([
                queryClient.invalidateQueries({ queryKey: ContactSalesKeys.all }),
            ]);
        }
    });
};


// Hook to fetch sales inquiries with optional filters
export const useSalesInquiries = (filters?: SalesInquiryFiltersDto) => {
    return useQuery({
        queryKey: ContactSalesKeys.lists(filters),
        queryFn: () => fetchSalesInquiries(filters),
    });
}


// Hook to get single sales inquiry details by ID
export const useSalesInquiryDetails = (id: string,) => {
    return useQuery({
        queryKey: [...ContactSalesKeys.details(), id] as const,
        queryFn: () => fetchSalesInquiryById(id),
        enabled: Boolean(id),
    });
}

// Hook to fetch sales statistics with optional filters
export const useSalesStats = (filters?: SalesStatsFiltersDto) => {
    return useQuery({
        queryKey: ContactSalesKeys.stats(filters),
        queryFn: () => fetchSalesStats(filters),
    });
};