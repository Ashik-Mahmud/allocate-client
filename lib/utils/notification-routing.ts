import { NotificationType } from "@/types/notification";
import { AppRole, APP_ROLES } from "@/lib/constants/roles";
import { ROUTES } from "@/lib/constants/routes";

/**
 * Determines the redirect route based on notification type and user role.
 * This enables role-based navigation when clicking on notifications.
 */
export function getNotificationRedirectRoute(
  notificationType: NotificationType | string,
  userRole: AppRole | null | undefined
): string {
  const role = userRole as AppRole | null;

  // Booking-related notifications
  if (
    notificationType === NotificationType.BOOKING_REQUESTED ||
    notificationType === NotificationType.BOOKING_CONFIRMED ||
    notificationType === NotificationType.BOOKING_REJECTED ||
    notificationType === NotificationType.BOOKING_CANCELLED ||
    notificationType === NotificationType.BOOKING_REMINDER
  ) {
    if (role === APP_ROLES.STAFF) {
      return ROUTES.dashboardCommon.myBookings;
    }
    if (role === APP_ROLES.ORG_ADMIN) {
      return ROUTES.dashboardOrgAdmin.bookingManagement;
    }
    // Default for ADMIN or unknown
    return ROUTES.dashboardCommon.notifications;
  }

  // Credit-related notifications
  if (
    notificationType === NotificationType.CREDIT_RECEIVED ||
    notificationType === NotificationType.CREDIT_REVOKED ||
    notificationType === NotificationType.LOW_CREDIT_WARNING
  ) {
    if (role === APP_ROLES.ORG_ADMIN) {
      return ROUTES.dashboardOrgAdmin.creditManagement;
    }
    if (role === APP_ROLES.STAFF) {
      // Staff might want to see credit history or go to notifications
      return ROUTES.dashboardCommon.notifications;
    }
    // Default for ADMIN
    return ROUTES.dashboardCommon.notifications;
  }

  // Invitation & Staff notifications
  if (
    notificationType === NotificationType.INVITATION_RECEIVED ||
    notificationType === NotificationType.STAFF_JOINED
  ) {
    if (role === APP_ROLES.ORG_ADMIN) {
      return ROUTES.dashboardOrgAdmin.staffManagement;
    }
    // Default for STAFF, ADMIN, or unknown
    return ROUTES.dashboardCommon.notifications;
  }

  // Subscription notifications
  if (
    notificationType === NotificationType.SUBSCRIPTION_EXPIRING ||
    notificationType === NotificationType.SUBSCRIPTION_EXPIRED
  ) {
    if (role === APP_ROLES.ORG_ADMIN) {
      return ROUTES.dashboardOrgAdmin.billing;
    }
    // Default for STAFF, ADMIN, or unknown
    return ROUTES.dashboardCommon.notifications;
  }

  // System alerts and maintenance notices always go to notifications
  if (
    notificationType === NotificationType.SYSTEM_ALERT ||
    notificationType === NotificationType.MAINTENANCE_NOTICE
  ) {
    return ROUTES.dashboardCommon.notifications;
  }

  // Fallback to notifications page
  return ROUTES.dashboardCommon.notifications;
}
