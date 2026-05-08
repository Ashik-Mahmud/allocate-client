import { PlanType } from "@/types/organization";
import { tr } from "zod/v4/locales/index.js";

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
            BASIC_DASHBOARD: true,
            AI_GENERATE_CANCEL_REASON: false,
            AI_REFINE_NOTES: false,
            ORGANIZATION_ADMIN_ACTIONABLE_INSIGHTS: false,
            CALENDAR_BASED_AVAILABILITY: false,
            ADVANCE_VIEW_CREDIT_MANAGEMENT: false,
            ADVANCE_BOOKING_STATISTICS: false,
            PEAK_DEMAND_INSIGHTS: false,
            CREDIT_FORECASTING: false,
            BOOKING_COUNTDOWN_TIMER: true,
            BOOKING_RESCHEDULING: true,
            CREDIT_MANAGEMENT: true,
            MANUAL_REMINDER_FOR_BOOKING: true,
            LIMITED_ACCESS_ADVANCE_STAFF_VIEW: true,
            WEEKLY_DEEP_DIVE_REPORTS_BY_EMAIL: false,
            EXPIRED_CREDITS_FROZEN: false,
            ORGANIZATION_VERIFICATION: false,
            EMAIL_NOTIFICATIONS: true,
            IN_APP_NOTIFICATIONS: true,
            PUSH_NOTIFICATIONS: false,
            SMS_NOTIFICATIONS: false,
            WHATSAPP_INTEGRATION: false,
            LOW_CREDIT_ALERTS: true,
            AUTOMATIC_STAFF_CHECK_IN_OUT_FOR_BOOKINGS: true,
            AUTOMATIC_PENDING_BOOKING_REMINDERS_FOR_ADMINS: true,
            AUTOMATIC_FOLLOW_UP_BOOKING_REMINDERS_FOR_STAFF: true,
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
            ADVANCE_DASHBOARD: true,
            AI_GENERATE_CANCEL_REASON: true,
            AI_REFINE_NOTES: true,
            ORGANIZATION_ADMIN_ACTIONABLE_INSIGHTS: true,
            CALENDAR_BASED_AVAILABILITY: true,
            ADVANCE_VIEW_CREDIT_MANAGEMENT: true,
            ADVANCE_BOOKING_STATISTICS: true,
            PEAK_DEMAND_INSIGHTS: true,
            CREDIT_FORECASTING: true,
            BOOKING_COUNTDOWN_TIMER: true,
            BOOKING_RESCHEDULING: true,
            CREDIT_MANAGEMENT: true,
            MANUAL_REMINDER_FOR_BOOKING: true,
            FULL_ACCESS_ADVANCED_STAFF_VIEW: true,
            WEEKLY_DEEP_DIVE_REPORTS_BY_EMAIL: true,
            EXPIRED_CREDITS_FROZEN: true,
            ORGANIZATION_VERIFICATION: true,
            EMAIL_NOTIFICATIONS: true,
            IN_APP_NOTIFICATIONS: true,
            PUSH_NOTIFICATIONS: false,
            SMS_NOTIFICATIONS: false,
            WHATSAPP_INTEGRATION: false,
            LOW_CREDIT_ALERTS: true,
            AUTOMATIC_STAFF_CHECK_IN_OUT_FOR_BOOKINGS: true,
            AUTOMATIC_PENDING_BOOKING_REMINDERS_FOR_ADMINS: true,
            AUTOMATIC_FOLLOW_UP_BOOKING_REMINDERS_FOR_STAFF: true,
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
            ADVANCE_DASHBOARD: true,
            AI_GENERATE_CANCEL_REASON: true,
            AI_REFINE_NOTES: true,
            ORGANIZATION_ADMIN_ACTIONABLE_INSIGHTS: true,
            CALENDAR_BASED_AVAILABILITY: true,
            ADVANCE_VIEW_CREDIT_MANAGEMENT: true,
            ADVANCE_BOOKING_STATISTICS: true,
            PEAK_DEMAND_INSIGHTS: true,
            CREDIT_FORECASTING: true,
            BOOKING_COUNTDOWN_TIMER: true,
            BOOKING_RESCHEDULING: true,
            CREDIT_MANAGEMENT: true,
            MANUAL_REMINDER_FOR_BOOKING: true,
            FULL_ACCESS_ADVANCED_STAFF_VIEW: true,
            WEEKLY_DEEP_DIVE_REPORTS_BY_EMAIL: true,
            EXPIRED_CREDITS_FROZEN: true,
            ORGANIZATION_VERIFICATION: true,
            EMAIL_NOTIFICATIONS: true,
            IN_APP_NOTIFICATIONS: true,
            PUSH_NOTIFICATIONS: true,
            SMS_NOTIFICATIONS: true,
            WHATSAPP_INTEGRATION: true,
            LOW_CREDIT_ALERTS: true,
            AUTOMATIC_STAFF_CHECK_IN_OUT_FOR_BOOKINGS: true,
            AUTOMATIC_PENDING_BOOKING_REMINDERS_FOR_ADMINS: true,
            AUTOMATIC_FOLLOW_UP_BOOKING_REMINDERS_FOR_STAFF: true,
        },
    },
};
export const SUBSCRIPTION_PRICING = {
    [PlanType.FREE]: {
        BDT: {
            monthly: 0,
            annually: 0,
        },
        USD: {
            monthly: 0,
            annually: 0,
        }
    },
    [PlanType.PRO]: {

        BDT: {
            monthly: 999,
            annually: 9990, // 2 months free (10 months at the price of 12 months)
        },
        USD: {
            monthly: 9.99,
            annually: 99.90, // 2 months free (10 months at the price of 12 months)
        }
    },
    [PlanType.ENTERPRISE]: {
        BDT: {
            monthly: 2499,
            annually: 24990,
        },
        USD: {
            monthly: 24.99,
            annually: 249.90,
        }
    },
};