import { ApiResponse, PaginatedResponse } from "@/types";
import { CreateSalesInquiryDto, SalesInquiry, SalesInquiryFiltersDto, SalesStatsFiltersDto } from "@/types/sales";
import { apiRequest } from "./http";


// service to create a sales inquiry
export const createSalesInquiry = async (data: CreateSalesInquiryDto) => {
    return apiRequest<ApiResponse<SalesInquiry>>("/sales-inquiry", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// Service to fetch sales inquiries with optional filters
export const fetchSalesInquiries = async (filters?: SalesInquiryFiltersDto) => {
    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.org_id) params.set("org_id", filters.org_id);
    if (filters?.country) params.set("country", filters.country);
    if (filters?.search) params.set("search", filters.search);
    if (filters?.sortBy) params.set("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.set("sortOrder", filters.sortOrder);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));

    return apiRequest<PaginatedResponse<SalesInquiry>>(`/sales-inquiry/admin?${params.toString()}`, { method: "GET" });
}

// Service to fetch a single sales inquiry by ID
export const fetchSalesInquiryById = async (id: string) => {
    return apiRequest<ApiResponse<SalesInquiry>>(`/sales-inquiry/admin/${id}`, { method: "GET" });
}

// Service to update a sales inquiry
export const updateSalesInquiry = async (id: string, data: Partial<CreateSalesInquiryDto>) => {
    return apiRequest<ApiResponse<SalesInquiry>>(`/sales-inquiry/admin/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

// Service to delete a sales inquiry
export const deleteSalesInquiry = async (id: string) => {
    return apiRequest<ApiResponse<null>>(`/sales-inquiry/admin/${id}`, { method: "DELETE" });
}

// Service to fetch sales statistics
export const fetchSalesStats = async (filters?: SalesStatsFiltersDto) => {
    const params = new URLSearchParams();   
    if (filters?.org_id) params.set("org_id", filters.org_id);
    if (filters?.startDate) params.set("startDate", filters.startDate);
    if (filters?.endDate) params.set("endDate", filters.endDate);
 
    return apiRequest<PaginatedResponse<SalesInquiry>>(`/sales-inquiry/stats?${params.toString()}`, { method: "GET" });
}   