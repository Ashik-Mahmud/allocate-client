"use client"

import React from 'react'
import { useCurrentUser } from '@/features/auth'
import { SUBSCRIPTION_LIMITS } from '@/lib/constants/subscription'
import { PaymentStatus, PlanType } from '@/types/organization'
import { BillingFooter } from './BillingFooter'
import { BillingHeader } from './BillingHeader'
import { PricingComparison } from './PricingComparison'
import { SubscriptionMetrics } from './SubscriptionMetrics'

const BillingManagement = () => {
  const { user, isLoading } = useCurrentUser()
  const organization = user?.organization ?? null
  const subscription = organization?.subscription ?? null

  const currentPlan = subscription?.plan_name ?? organization?.plan_type ?? PlanType.FREE
  const billingStatus = subscription?.payment_status ?? (currentPlan === PlanType.FREE ? PaymentStatus.PENDING : PaymentStatus.COMPLETED)

  console.log(subscription)
  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-40 animate-pulse rounded-[2rem] border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900/70" />
        <div className="grid gap-4 xl:grid-cols-[1.08fr_1fr]">
          <div className="h-80 animate-pulse rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900/70" />
          <div className="h-80 animate-pulse rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900/70" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <BillingHeader currentPlan={currentPlan} billingStatus={billingStatus} renewalDate={subscription?.end_date} />

      <div className="grid gap-4 xl:grid-cols-[1.08fr_1fr]">
        <SubscriptionMetrics
          currentPlan={currentPlan}
          billingStatus={billingStatus}
          subscription={subscription}
          creditPool={organization?.credit_pool ?? 0}
        />

        <PricingComparison currentPlan={currentPlan} />
      </div>

      <BillingFooter />
    </div>
  )
}

export default BillingManagement