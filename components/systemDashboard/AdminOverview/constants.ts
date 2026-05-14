/**
 * Admin Dashboard Constants
 * Mock data and default values for dashboard components
 */

import type { DashboardInsights } from './types';

export const MOCK_DASHBOARD_INSIGHTS: DashboardInsights = {
  scope: 'platform',
  platformSummary: {
    totalOrganizations: 5,
    totalPlatformUsers: 9,
    totalRevenue: {
      lifetimeCreditSales: 548.11,
      monthlyCreditSales: 548.11,
      completedSubscriptionSalesCount: 4,
      completedPaidSubscriptionSalesCount: 3,
    },
    globalCreditsSold: 548.11,
  },
  revenueAndGrowth: {
    revenueTrends: {
      daily: [
        { date: '2026-04-15', amount: 0 },
        { date: '2026-04-16', amount: 0 },
        { date: '2026-04-17', amount: 0 },
        { date: '2026-04-18', amount: 0 },
        { date: '2026-04-19', amount: 0 },
        { date: '2026-04-20', amount: 0 },
        { date: '2026-04-21', amount: 0 },
        { date: '2026-04-22', amount: 0 },
        { date: '2026-04-23', amount: 0 },
        { date: '2026-04-24', amount: 0 },
        { date: '2026-04-25', amount: 0 },
        { date: '2026-04-26', amount: 0 },
        { date: '2026-04-27', amount: 0 },
        { date: '2026-04-28', amount: 0 },
        { date: '2026-04-29', amount: 0 },
        { date: '2026-04-30', amount: 0 },
        { date: '2026-05-01', amount: 0 },
        { date: '2026-05-02', amount: 0 },
        { date: '2026-05-03', amount: 0 },
        { date: '2026-05-04', amount: 0 },
        { date: '2026-05-05', amount: 0 },
        { date: '2026-05-06', amount: 0 },
        { date: '2026-05-07', amount: 0 },
        { date: '2026-05-08', amount: 29.97 },
        { date: '2026-05-09', amount: 8.14 },
        { date: '2026-05-10', amount: 0 },
        { date: '2026-05-11', amount: 0 },
        { date: '2026-05-12', amount: 0 },
        { date: '2026-05-13', amount: 10 },
        { date: '2026-05-14', amount: 500 },
      ],
      weekly: [
        { weekKey: '2026-W16', amount: 0 },
        { weekKey: '2026-W17', amount: 0 },
        { weekKey: '2026-W18', amount: 0 },
        { weekKey: '2026-W19', amount: 38.11 },
        { weekKey: '2026-W20', amount: 510 },
      ],
    },
    planDistribution: [
      { planType: 'FREE', count: 1, ratio: 0.2 },
      { planType: 'PRO', count: 3, ratio: 0.6 },
      { planType: 'ENTERPRISE', count: 1, ratio: 0.2 },
    ],
    newSignups: {
      last7Days: 5,
      last30Days: 5,
    },
  },
  tenantAndUsageMonitoring: {
    top5Organizations: [
      {
        id: 'cmovulzsv0000s8v5atdhs0eo',
        name: 'Veriff Co Ltd.',
        planType: 'PRO',
        createdAt: '2026-05-07T18:57:32.287Z',
        staffCount: 6,
        creditConsumption: 6,
        totalAssignedCredits: 1560,
        creditPool: 1540,
      },
      {
        id: 'cmovv308y000ps8v5oiexgzbv',
        name: 'Nexus Mind',
        planType: 'ENTERPRISE',
        createdAt: '2026-05-07T19:10:46.018Z',
        staffCount: 1,
        creditConsumption: 4,
        totalAssignedCredits: 2129.99,
        creditPool: 2080,
      },
      {
        id: 'cmp1nllji0002x4v50vo78da7',
        name: 'NovaAI',
        planType: 'FREE',
        createdAt: '2026-05-11T20:27:53.550Z',
        staffCount: 1,
        creditConsumption: 0,
        totalAssignedCredits: 50,
        creditPool: 50,
      },
      {
        id: 'cmoxt1eii0000w0v59ktr7abp',
        name: 'Begimin Ltd',
        planType: 'PRO',
        createdAt: '2026-05-09T03:49:04.315Z',
        staffCount: 0,
        creditConsumption: 0,
        totalAssignedCredits: 1700,
        creditPool: 1000,
      },
      {
        id: 'cmp1wkpkm000328v504r25y3x',
        name: 'Wshu Industry Ltd',
        planType: 'PRO',
        createdAt: '2026-05-12T00:39:08.662Z',
        staffCount: 0,
        creditConsumption: 0,
        totalAssignedCredits: 100,
        creditPool: 400,
      },
    ],
    expiringSubscriptions: [],
    inactiveOrganizations: [],
  },
  systemHealthAndSecurity: {
    criticalErrorLogs: [
      {
        id: 'cmp3e4bcc00021kv5ffjjjxjp',
        action: 'SYSTEM_ERROR',
        details:
          'Invalid `tx.creditTransaction.create()` invocation - Foreign key constraint violated on the constraint: `credit_transactions_referenceId_fkey`',
        createdAt: '2026-05-13T01:38:02.988Z',
        org_id: 'SYSTEM',
        user_id: 'ashik-187',
      },
      {
        id: 'cmp24exhv0001qkv57uzufsb2',
        action: 'SYSTEM_ERROR',
        details: 'Unknown argument `not` in User findMany query. Did you mean `AND`?',
        createdAt: '2026-05-12T04:18:35.923Z',
        org_id: 'SYSTEM',
        user_id: 'ashik-187',
      },
      {
        id: 'cmp24ewlt0000qkv51n2d283g',
        action: 'SYSTEM_ERROR',
        details: 'Unknown argument `not` in User findMany query. Did you mean `AND`?',
        createdAt: '2026-05-12T04:18:34.769Z',
        org_id: 'SYSTEM',
        user_id: 'ashik-187',
      },
    ],
    failedTransactions: [],
    systemStatus: {
      database: 'UP',
      api: 'UP',
      checkedAt: '2026-05-14T13:35:46.805Z',
    },
  },
  administrativeControls: {
    globalAnnouncementStatus: {
      maintenanceMode: false,
      activeBanner: {
        body: 'Get your free trial today and use our organization with full potential',
        show: false,
        type: 'success',
        title: '10 Days free trial available',
        buttonLink: '/dashboard/billing',
        buttonText: 'Take it',
      },
      updatedAt: '2026-05-12T23:34:53.585Z',
    },
    pendingSupportRequests: 0,
  },
};

export const PLAN_COLORS = {
  FREE: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
  },
  PRO: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    text: 'text-purple-700 dark:text-purple-300',
    badge: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300',
  },
  ENTERPRISE: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-300',
    badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
  },
};

export const STATUS_COLORS = {
  UP: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30',
  DOWN: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30',
  DEGRADED: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30',
};
