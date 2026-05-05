import { PlanType } from "@/types/organization";

export const SUBSCRIPTION_LIMITS = {
    [PlanType.FREE]: {
        MAX_USERS: 5,
        MAX_RESOURCES: 2,
        INITIAL_CREDITS: 100,
        BOOKING_WINDOW_DAYS: 7, // Bookings can only be made up to 7 days in advance
        FEATURES: {
            AI_INSIGHTS: false,
            ADVANCED_RULES: false,
            PRIORITY_SUPPORT: false,
        },
    },
    [PlanType.PRO]: {
        MAX_USERS: 50,
        MAX_RESOURCES: 20,
        INITIAL_CREDITS: 1000,
        BOOKING_WINDOW_DAYS: 30, 
        FEATURES: {
            AI_INSIGHTS: true,
            ADVANCED_RULES: true,
            PRIORITY_SUPPORT: true,
        },
    },
    [PlanType.ENTERPRISE]: {
        MAX_USERS: 9999, // Practically unlimited
        MAX_RESOURCES: 9999,
        INITIAL_CREDITS: 5000,
        BOOKING_WINDOW_DAYS: 90,
        FEATURES: {
            AI_INSIGHTS: true,
            ADVANCED_RULES: true,
            PRIORITY_SUPPORT: true,
        },
    },
};