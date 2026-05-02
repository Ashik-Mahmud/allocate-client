import { Booking, CreateBookingPayload, FetchAllBookingsFilters, FetchMyBookingsFilters, getBookingStatsFilters, UpdateBookingStatusPayload } from "@/types/booking"
import { apiRequest } from "./http";
import { ApiResponse, PaginatedResponse } from "@/types";

export const createBookingService = async (booking: CreateBookingPayload) => {
    return apiRequest<ApiResponse<Booking>>(`/bookings/create`, {
        method: "POST",
        body: JSON.stringify(booking),
    });
}


// Service to change booking status (e.g., cancel a booking)
export const changeBookingStatusService = async (bookingId: string, payload: UpdateBookingStatusPayload) => {
    const query = new URLSearchParams({ bookingId }).toString();
    return apiRequest<ApiResponse<Booking>>(`/bookings/status?${query}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

// Service to update booking notes
export const updateBookingService = async (bookingId: string, notes: string) => {
    const query = new URLSearchParams({ bookingId }).toString();
    return apiRequest<ApiResponse<Booking>>(`/bookings/details?${query}`, {
        method: "PATCH",
        body: JSON.stringify({ notes }),
    });
}

// Service to fetch resource available slots for a given time range
export const fetchResourceAvailableSlots = async (resourceId: string, date: string) => {
    const query = new URLSearchParams({ date }).toString();
    return apiRequest<ApiResponse<Booking>>(`/bookings/availability/${resourceId}?${query}`, {
        method: "GET",
    });
}

// Service to fetch my bookings
export const fetchMyBookings = async (filters?: FetchMyBookingsFilters) => {
    const query = new URLSearchParams();

    if (filters?.limit) query.append("limit", String(filters.limit));
    if (filters?.page) query.append("page", String(filters.page));
    if (filters?.status) query.append("status", filters.status);
    if (filters?.search) query.append("search", filters.search);

    const sendingQuery = query.toString();

    return apiRequest<PaginatedResponse<Booking[]>>(`/bookings/my-bookings${sendingQuery ? `?${sendingQuery}` : ''}`, {
        method: "GET",
    });
}

// service to fetch all bookings (for admin)
export const fetchAllBookings = async (filters?: FetchAllBookingsFilters) => {
    const query = new URLSearchParams({
        page: String(filters?.page ?? 1),
        limit: String(filters?.limit ?? 10),
        status: filters?.status ?? "",
        search: filters?.search ?? "",
        userId: filters?.userId ?? "",
        resourceId: filters?.resourceId ?? "",
        dateRange: filters?.dateRange ?? "",
    }).toString();
    return apiRequest<PaginatedResponse<Booking>>(`/bookings/all?${query}`, {
        method: "GET",
    });
}


// service to fetch booking resource calendar availablity for month
export const fetchBookingResourceCalendar = async (resourceId: string, month: string, year: string) => {
    const query = new URLSearchParams({ month, year }).toString();
    return apiRequest<ApiResponse<Record<string, any>>>(`/bookings/resource/${resourceId}/calendar?${query}`, {
        method: "GET",
    });
}

// service to get booking stats
export const fetchBookingStats = async (filters?: getBookingStatsFilters) => {
    const query = new URLSearchParams({
        startDate: filters?.startDate ?? "",
        endDate: filters?.endDate ?? "",
        groupBy: filters?.groupBy ?? "day",
    }).toString();
    return apiRequest<ApiResponse<Record<string, any>>>(`/bookings/stats?${query}`, {
        method: "GET",
    });
}