/**
 * Admin Dashboard Types
 * Type definitions for all dashboard components and data structures
 */

import { User } from "@/types";
import { PlanType } from "@/types/organization";

export interface PlatformSummary {
  totalOrganizations?: number;
  totalPlatformUsers?: number;
  totalRevenue?: {
    lifetimeCreditSales?: number;
    monthlyCreditSales?: number;
    completedSubscriptionSalesCount?: number;
    completedPaidSubscriptionSalesCount?: number;
  };
  globalCreditsSold?: number;
}

export interface RevenueTrendData {
  date: string;
  amount: number;
}

export interface WeeklyRevenueTrendData {
  weekKey: string;
  amount: number;
}

export interface RevenueTrends {
  daily?: RevenueTrendData[];
  weekly?: WeeklyRevenueTrendData[];
}

export interface PlanDistributionItem {
  planType: PlanType;
  count: number;
  ratio: number;
}

export interface NewSignups {
  last7Days?: number;
  last30Days?: number;
}

export interface Organization {
  id: string;
  name: string;
  planType: PlanType;
  createdAt: string;
  staffCount?: number;
  creditConsumption?: number;
  totalAssignedCredits?: number;
  creditPool?: number;
}

export interface SystemStatus {
  database?: 'UP' | 'DOWN' | 'DEGRADED';
  api?: 'UP' | 'DOWN' | 'DEGRADED';
  checkedAt?: string;
}

export interface CriticalError {
  id: string;
  action: string;
  details?: string;
  createdAt: string;
  org_id?: string;
  user_id?: string;
  user?:Partial<User>;
  organization?: Partial<Organization>;
  metadata?: Record<string, any>;
}

export interface SystemHealth {
  criticalErrorLogs?: CriticalError[];
  failedTransactions?: any[];
  systemStatus?: SystemStatus;
}

export interface ExpiringSubscription {
  subscriptionId: string;
  organizationId: string;
  organizationName: string;
  plan: PlanType;
  endingAt: string; // ISO Date String
}
export interface InactiveOrg {
  id: string;
  name: string;
  planType: PlanType;
  staffCount: number;
  lastActive?: string; // Optional: helps with "Days Inactive" logic
}
export interface TenantAndUsageMonitoring {
  top5Organizations?: Organization[];
  expiringSubscriptions?: ExpiringSubscription[];
  inactiveOrganizations?: InactiveOrg[];
}

export interface RevenueAndGrowth {
  revenueTrends?: RevenueTrends;
  planDistribution?: PlanDistributionItem[];
  newSignups?: NewSignups;
}

export interface AdministrativeControls {
  globalAnnouncementStatus?: {
    maintenanceMode?: boolean;
    activeBanner?: {
      body?: string;
      show?: boolean;
      type?: 'success' | 'warning' | 'error' | 'info';
      title?: string;
      buttonLink?: string;
      buttonText?: string;
    };
    updatedAt?: string;
  };
  pendingSupportRequests?: number;
}

export interface DashboardInsights {
  scope?: string;
  platformSummary?: PlatformSummary;
  revenueAndGrowth?: RevenueAndGrowth;
  tenantAndUsageMonitoring?: TenantAndUsageMonitoring;
  systemHealthAndSecurity?: SystemHealth;
  administrativeControls?: AdministrativeControls;
  dataNotes?: {
    revenueComputation?: string;
    supportRequestsComputation?: string;
  };
}
