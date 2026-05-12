import { TransactionType } from "./credits";
import { PlanType } from "./organization";
export type AlertType = 'info' | 'warning' | 'error' | 'success';

export interface GlobalAlert {
  title: string;
  body: string;
  type: AlertType;
  show: boolean;
  createdAt: Date;
  updatedAt: Date;
  buttonText?: string;
  buttonLink?: string;
}

export interface FeatureFlags {
  can_export_logs: boolean;
  ui_dark_mode: boolean;
}

export interface SystemSettingsData {
  id: string;
  support_email: string;
  maintenance_mode: boolean;
  global_alert_message: GlobalAlert;
  features_flags: FeatureFlags;
}

export interface OrganizationListFilters {
  organizationId?: string;
  name?: string;
  verified?: boolean;
  page?: number;
  limit?: number;
  search?: string;
  planType?: PlanType | "all";
  showDeletedOrg?: boolean;
}

export interface BroadcastAnnouncementPayload {
  title: string,
  message: string,
  orgIds: string[],
  type: 'SYSTEM_ALERT' | 'MAINTENANCE_NOTICE'
  metadata: Record<string, any>,
  receiverType: 'ALL' | 'ORG' | 'STAFF' | 'INDIVIDUAL',
}

export interface AdminUserFilters {
  organizationId?: string;
  name?: string;
  email?: string;
  role?: "ORG_ADMIN" | "STAFF";
  page?: number;
  limit?: number;
  search?: string;
}

export interface TransactionListFilters {
  organizationId?: string;
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

export interface RevenueAnalyticsFilters {
  startDate: string;
  endDate: string;
  organizationId?: string;
  groupBy: "day" | "week" | "month";
}

export interface ActivityLogFilters {
  organizationId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

export interface UpdateOrganizationPayload {
  name: string;
  isVerified?: boolean;
  hasUsedTrial?: boolean;
  isTrialAllowed?: boolean;
  is_active?: boolean;
  needUpdateOrg?: boolean;
  trialEndsAt?: string;
}
  