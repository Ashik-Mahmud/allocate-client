export type notificationFilters ={
    limit?: number;
    page?: number;
    is_read?: boolean;
    search?: string;
}

export enum NotificationType {
  // Booking Related
  BOOKING_REQUESTED = 'BOOKING_REQUESTED',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_REJECTED = 'BOOKING_REJECTED',
  BOOKING_REMINDER = 'BOOKING_REMINDER',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',

  // Credit Related
  CREDIT_RECEIVED = 'CREDIT_RECEIVED',
  CREDIT_REVOKED = 'CREDIT_REVOKED',
  LOW_CREDIT_WARNING = 'LOW_CREDIT_WARNING',

  // Invitation & Staff
  INVITATION_RECEIVED = 'INVITATION_RECEIVED',
  STAFF_JOINED = 'STAFF_JOINED',

  // Subscription
  SUBSCRIPTION_EXPIRING = 'SUBSCRIPTION_EXPIRING',
  SUBSCRIPTION_EXPIRED = 'SUBSCRIPTION_EXPIRED',

  // System
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  MAINTENANCE_NOTICE = 'MAINTENANCE_NOTICE',
}

export interface Notification {
  id: string;
  user_id: string;
  org_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  reference_id?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}