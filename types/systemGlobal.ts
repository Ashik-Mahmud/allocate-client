import { User } from ".";
import { TransactionType } from "./credits";
import { Organizations, PlanType, Subscription } from "./organization";
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
  createdAt: string;
  updatedAt: string;
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
  is_active?: boolean;
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
  startDate?: string;
  endDate?: string;
  organizationId?: string;
  groupBy?: "day" | "week" | "month";
}

export interface RevenueAnalyticsData {
  filters: RevenueAnalyticsFilters;
  summary: {
    totalRevenue: number;
    totalTransactions: number;
    activePayingOrganizations: number;
    avgTransactionValue: number;
    avgRevenuePerPayingOrganization: number;
  };
  subscribers: {
    totalOrganizations: number;
    free: number;
    pro: number;
    enterprise: number;
    paid: number;
  };
  grouped: Array<{
    period: string;
    revenue: number;
    transactionCount: number;
    activeOrganizations: number;
    revenueByPlan: {
      free: number;
      pro: number;
      enterprise: number;
    };
  }>;
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


export interface CreditsTopUpPayload {
  credits: number;
  price: number;
  extendDate?: string | undefined;
  planType?: PlanType | undefined;
}


export interface ActivityLog {
  id: string;
  org_id: string;
  user_id: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any> | null;
  createdAt: Date;
  details?: string | null;
  user?: Partial<User>
  organization?: Partial<Organizations>
}

/**
 * Main response object for the dashboard insights
 */
export interface PlatformDashboardResponse {
  insights: PlatformInsights;
  message: string;
}

export interface PlatformInsights {
  scope: string;
  platformSummary: PlatformSummary;
  revenueAndGrowth: RevenueAndGrowth;
  tenantAndUsageMonitoring: TenantAndUsageMonitoring;
  systemHealthAndSecurity: SystemHealthAndSecurity;
  administrativeControls: AdministrativeControls;
  dataNotes: DataNotes;
}

// --- Platform Summary ---

export interface PlatformSummary {
  totalOrganizations: number;
  totalPlatformUsers: number;
  totalRevenue: TotalRevenue;
  globalCreditsSold: number;
}

export interface TotalRevenue {
  /** Derived from TOP_UP credit transactions */
  lifetimeCreditSales: number;
  monthlyCreditSales: number;
  completedSubscriptionSalesCount: number;
  completedPaidSubscriptionSalesCount: number;
}

export interface RevenueAndGrowth {
  revenueTrends: RevenueTrends;
  planDistribution: PlanDistribution[];
  newSignups: Signups;
}

export interface RevenueTrends {
  daily: Array<{ date: string; amount: number }>;
  weekly: Array<{ weekKey: string; amount: number }>;
}

export interface PlanDistribution {
  planType: PlanType;
  count: number;
  ratio: number;
}

export interface Signups {
  last7Days: number;
  last30Days: number;
}


export interface TenantAndUsageMonitoring {
  top5Organizations: Organization[];
  expiringSubscriptions:  Partial<Subscription>[]; // Adjust type if detailed objects exist
  inactiveOrganizations: Partial<Organizations>[]; // Adjust type if detailed objects exist
}

export interface Organization {
  id: string;
  name: string;
  planType: PlanType;
  createdAt: string;
  staffCount: number;
  creditConsumption: number;
  totalAssignedCredits: number;
  creditPool: number;
}


export interface SystemHealthAndSecurity {
  criticalErrorLogs: SystemErrorLog[];
  failedTransactions: any[];
  systemStatus: SystemStatus;
}

export interface SystemErrorLog {
  id: string;
  action: 'SYSTEM_ERROR' | string;
  details: string;
  createdAt: string;
  org_id: 'SYSTEM' | string;
  user_id: string;
}

export interface SystemStatus {
  database: 'UP' | 'DOWN';
  api: 'UP' | 'DOWN';
  checkedAt: string;
}


export interface AdministrativeControls {
  globalAnnouncementStatus: GlobalAnnouncementStatus;
  pendingSupportRequests: number;
}

export interface GlobalAnnouncementStatus {
  maintenanceMode: boolean;
  activeBanner: ActiveBanner;
  updatedAt: string;
}

export interface ActiveBanner {
  body: string;
  show: boolean;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  buttonLink: string;
  buttonText: string;
}

export interface DataNotes {
  /** Monetary revenue fields are derived from TOP_UP credit transactions; subscription model currently has no amount column. */
  revenueComputation: string;
  /** Pending support requests are derived from ActivityLog action containing SUPPORT_REQUEST_PENDING. */
  supportRequestsComputation: string;
}