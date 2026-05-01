import { User } from ".";
import { CreditTransaction } from "./credits";
import { Organizations } from "./organization";
import { Resource } from "./resources";

export enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
}

export interface Booking {
    id: string;
    user_id: string;
    resource_id: string;
    org_id: string;
    created_by?: string | null;
    start_time: Date;
    end_time: Date;
    total_cost?: number | null; // Defaults to 0
    status: BookingStatus | null;
    cancellation_reason?: string | null;
    notes?: string | null;
    metadata?: Record<string, any> | null; // Prisma Json maps to Object/Record
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;

    // Relations (Optional based on query includes)
    user?: User;
    organization?: Organizations;
    resource?: Resource;
    creator?: User | null;
    creditTransactions?: CreditTransaction[];
}

export type UpdateBookingStatusPayload = {
    status: BookingStatus;
    cancellation_reason?: string | null;
};

export interface FetchMyBookingsFilters {
    page: number;
    limit: number;
    status?: BookingStatus;
    search?: string;
};

export interface FetchAllBookingsFilters extends FetchMyBookingsFilters {
    userId?: string;
    resourceId?: string;
    dateRange?: string; // e.g., "2024-01-01 to 2024-01-07"
}

export interface getBookingStatsFilters {
    startDate: string;
    endDate: string;
    groupBy: "day" | "week" | "month";
}

export interface CreateBookingPayload {
    resource_id: string;
    start_time: string; // ISO string
    end_time: string;   // ISO string
    notes?: string;
}