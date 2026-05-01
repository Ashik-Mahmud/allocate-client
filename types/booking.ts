import { User } from ".";
import { CreditTransaction } from "./credits";
import { Organizations } from "./organization";
import { Resource } from "./resources";
import { CheckCircle2, Clock, XCircle, Ban, Hourglass } from 'lucide-react'

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



export const BOOKING_STATUS_CONFIG = {
    [BookingStatus.PENDING]: {
        label: "Pending",
        color: "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400",
        icon: Hourglass,
    },
    [BookingStatus.CONFIRMED]: {
        label: "Confirmed",
        color: "text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400",
        icon: CheckCircle2,
    },
    [BookingStatus.REJECTED]: {
        label: "Rejected",
        color: "text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400",
        icon: Ban,
    },
    [BookingStatus.CANCELLED]: {
        label: "Cancelled",
        color: "text-slate-500 bg-slate-50 border-slate-100 dark:bg-slate-800 dark:text-slate-400",
        icon: XCircle,
    },
    [BookingStatus.COMPLETED]: {
        label: "Completed",
        color: "text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400",
        icon: Clock,
    },
}