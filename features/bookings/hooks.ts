import { changeBookingStatusService, createBookingService, fetchBookingResourceCalendar, fetchBookingStats, fetchMyBookings, fetchResourceAvailableSlots, updateBookingService } from "@/lib/services/booking";
import { CreateBookingPayload, FetchMyBookingsFilters, getBookingStatsFilters, UpdateBookingStatusPayload } from "@/types/booking";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const BookingKeys = {
    all: ["bookings"] as const,
    lists: (filters?: FetchMyBookingsFilters) => [...BookingKeys.all, "list", filters] as const,
    details: () => [...BookingKeys.all, "detail"] as const,
    myBooking: () => [...BookingKeys.all, "my-booking"] as const,
    availability: (resourceId: string, date: string) => [...BookingKeys.all, "availability", resourceId, date] as const,
    stats: (filters?: getBookingStatsFilters) => [...BookingKeys.all, "stats", filters] as const,
};

// Hook to create a new booking
export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (booking: CreateBookingPayload) => createBookingService(booking),
        onSuccess: async () => {
            return await Promise.all([
                queryClient.invalidateQueries({ queryKey: BookingKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: BookingKeys.myBooking() }),
            ]);
        }
    });
};

// Hook to change booking status (e.g., cancel a booking)
export const useChangeBookingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ bookingId, payload }: { bookingId: string; payload: UpdateBookingStatusPayload }) =>
            changeBookingStatusService(bookingId, payload),
        onSuccess: async () => {
            return await Promise.all([
                queryClient.invalidateQueries({ queryKey: BookingKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: BookingKeys.myBooking() }),
            ]);
        }
    });
};

// Hook to update booking notes
export const useUpdateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ bookingId, notes }: { bookingId: string; notes: string }) =>
            updateBookingService(bookingId, notes), // Assuming the same service can be used to update notes
        onSuccess: async () => {
            return await Promise.all([
                queryClient.invalidateQueries({ queryKey: BookingKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: BookingKeys.myBooking() }),
            ]);
        }
    });
};

// Hook to get booking availability slot for a resource
export const useFetchResourceAvailableSlots = ({
    resourceId,
    date,
    enabled = true,
}: {
    resourceId?: string;
    date: string;
    enabled?: boolean;
}) => {
    return useQuery({
        queryKey: BookingKeys.availability(resourceId ?? "", date),
        queryFn: () => fetchResourceAvailableSlots(resourceId as string, date),
        enabled: enabled && Boolean(resourceId && date),
        refetchOnWindowFocus: false,
    });
};


// Hook to fetch my bookings with filters
export const useFetchMyBookings = (filters?: FetchMyBookingsFilters) => {
    return useQuery({
        queryKey: [...BookingKeys.myBooking(), filters],
        queryFn: () => fetchMyBookings(filters),
    });
};


// Hook to fetch all bookings (for admin) - can be implemented similarly to useFetchMyBookings with appropriate service and query key
export const useFetchAllBookings = (filters?: FetchMyBookingsFilters) => {
    return useQuery({
        queryKey: BookingKeys.lists(filters),
        queryFn: () => fetchMyBookings(filters), // Replace with appropriate service for fetching all bookings
    });
}


// Hook to fetch resource based booking calendar 
export const useFetchResourceBookingCalendar = ({ resourceId, month, year }: { resourceId: string; month: string; year: string }) => {
    return useQuery({
        queryKey: BookingKeys.availability(resourceId, `${month}-${year}`),
        queryFn: () => fetchBookingResourceCalendar(resourceId, month, year),
    });
}

// Hook to fetch booking stats
export const useFetchBookingStats = (filters?: getBookingStatsFilters) => {
    return useQuery({
        queryKey: BookingKeys.stats(filters),
        queryFn: () => fetchBookingStats(filters), // Replace with appropriate service for fetching all bookings
    });
}

/* export function useResourcesListQuery(filters?: ResourceListFilters) {
    return useQuery({
        queryKey: resourceKeys.list(filters),
        queryFn: () => getResourcesList(filters),
    });
} */