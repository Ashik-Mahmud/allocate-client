import { Booking, BookingCalendarEntry, BookingResourceCalendarResponse, CreateBookingPayload, FetchAllBookingsFilters, FetchMyBookingsFilters, getBookingStatsFilters, RescheduleBookingPayload, UpdateBookingStatusPayload } from "@/types/booking"
import { apiRequest } from "./http";
import { ApiResponse, PaginatedResponse } from "@/types";

export const createBookingService = async (booking: CreateBookingPayload) => {
    return apiRequest<ApiResponse<Booking>>(`/bookings/create`, {
        method: "POST",
        body: JSON.stringify(booking),
    });
}

// service to reschedule a booking
export const rescheduleBookingService = async (bookingId: string, payload: RescheduleBookingPayload) => {
    const query = new URLSearchParams({ bookingId }).toString();
    return apiRequest<ApiResponse<Booking>>(`/bookings/reschedule?${query}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

// service to send reminder 
export const sendBookingReminderService = async (bookingId: string) => {
    return apiRequest<ApiResponse<{ success: boolean }>>(`/inbox/${bookingId}/send-reminder`, {
        method: "POST",
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

    return apiRequest<PaginatedResponse<Booking>>(`/bookings/my-bookings${sendingQuery ? `?${sendingQuery}` : ''}`, {
        method: "GET",
    });
}

// service to fetch all bookings (for admin)
export const fetchAllBookings = async (filters?: FetchAllBookingsFilters) => {


    const query = new URLSearchParams();

    if (filters?.limit) query.append("limit", String(filters.limit));
    if (filters?.page) query.append("page", String(filters.page));
    if (filters?.status) query.append("status", filters.status);
    if (filters?.search) query.append("search", filters.search);
    if (filters?.userId) query.append("userId", filters.userId);
    if (filters?.resourceId) query.append("resourceId", filters.resourceId);
    if (filters?.dateRange) query.append("dateRange", filters.dateRange);

    const sendingQuery = query.toString();

    return apiRequest<PaginatedResponse<Booking>>(`/bookings/all?${sendingQuery}`, {
        method: "GET",
    });
}


// service to fetch booking resource calendar availablity for month
export const fetchBookingResourceCalendar = async (resourceId: string, month: string, year: string) => {
    const query = new URLSearchParams({ month, year }).toString();
    return apiRequest<ApiResponse<BookingResourceCalendarResponse>>(`/bookings/resource/${resourceId}/calendar?${query}`, {
        method: "GET",
    });
}

// service to get booking stats
export const fetchBookingStats = async (filters?: getBookingStatsFilters) => {
    const query = new URLSearchParams();

    if (filters?.startDate) query.append("startDate", filters.startDate);
    if (filters?.endDate) query.append("endDate", filters.endDate);
    if (filters?.groupBy) query.append("groupBy", filters.groupBy);


    return apiRequest<ApiResponse<Record<string, any>>>(`/bookings/stats?${query?.toString()}`, {
        method: "GET",
    });
}