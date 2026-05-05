import { BookingStatus } from "./booking";


export type TdashboardFilter = {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
}

export interface TdashboardOverviewResponse<T> {
    insights: T;
    message: string
}

/**
 * Represents the usage and billing metrics for a specific user.
 */
interface UserMetrics {
    myCurrentBalance: number;
    totalSpent: number;
    lastTransaction: {
        amount: number;
        date: string; // ISO 8601 format
        source: string;
        type: 'SPEND' | 'DEPOSIT'; // Inferred from "SPEND"
        description: string;
    };
    usageCount: number;
    currentMonthSpent: number;
}

/**
 * Represents the log of recent booking activities.
 */
interface RecentActivity {
    bookingId: string;
    resourceName: string;
    status: BookingStatus; // Based on "CANCELLED"
    description: string;
    createdAt: string; // ISO 8601 format
}

/**
 * Details of the resources most frequently used by the user.
 */
interface MostUsedResource {
    id: string;
    name: string;
    type: string; // Generic string fallback for other types
    image: string;
    isOccupied: boolean;
    usageCount: number;
}

/**
 * Historical record of specific resource usage sessions.
 */
interface UsageHistory {
    bookingId: string;
    resourceId: string;
    resourceName: string;
    status: BookingStatus; // Based on "CANCELLED"
    totalCost: number;
    durationMinutes: number;
}

/**
 * The root data structure provided.
 */
export interface StaffDashboardData {
    scope: string;
    user: {
        id: string;
        email: string;
    };
    metrics: UserMetrics;
    recentActivity: RecentActivity[];
    mostUsedResources: MostUsedResource[];
    usageHistory: UsageHistory[];
}