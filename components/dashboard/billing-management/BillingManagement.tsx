"use client"

import React, { useEffect } from 'react'
import { useCurrentUser } from '@/features/auth'
import { SUBSCRIPTION_LIMITS } from '@/lib/constants/subscription'
import { PaymentStatus, PlanType } from '@/types/organization'
import { BillingFooter } from './BillingFooter'
import { BillingHeader } from './BillingHeader'
import { PricingComparison } from './PricingComparison'
import { SubscriptionMetrics } from './SubscriptionMetrics'
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ROUTES } from '@/lib/constants/routes';
import AllocateDrawer from '@/components/shared/allocate-drawer';
import PaymentForm from './PaymentForm';
import { Check } from 'lucide-react';

const BillingManagement = () => {
    const { user, isLoading } = useCurrentUser()
    const organization = user?.organization ?? null
    const subscription = organization?.subscription ?? null

    const currentPlan = subscription?.plan_name ?? organization?.plan_type ?? PlanType.FREE
    const billingStatus = subscription?.payment_status ?? (currentPlan === PlanType.FREE ? PaymentStatus.PENDING : PaymentStatus.COMPLETED)

    const searchParams = useSearchParams();
    const router = useRouter();
    const [isOpenPaymentMethod, setIsOpenPaymentMethod] = React.useState(false)


    // Check for payment success in URL parameters and show toast notification
    useEffect(() => {
        if (searchParams.get('payment') === 'success') {
            toast.success('Subscription Activated!', {
                description: 'Your credits have been added to the pool.',
                position: 'top-center',
            });

            // Redirect to dashboard
            router.replace(ROUTES.dashboardOrgAdmin.billing);
        }
    }, [searchParams, router]);

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
                    onExtend={() => {
                        setIsOpenPaymentMethod(true)
                    }}
                />

                <PricingComparison currentPlan={currentPlan} onUpgrade={(type) => {
                    setIsOpenPaymentMethod(true)
                }} />
            </div>

            <BillingFooter />

            <AllocateDrawer
                open={isOpenPaymentMethod}
                onOpenChange={() => setIsOpenPaymentMethod(false)}
                title="Payment Method"
                description="Add your payment method to upgrade your subscription and enjoy uninterrupted access to Allocate's features."
                position="bottom"
                showHandler={false}

                footer={
                    <div className="flex items-center text-center justify-center gap-4 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                        <p className="text-[10px] font-medium uppercase tracking-widest flex items-center gap-1.5">
                            <Check className="h-3 w-3" /> Secure Payment Gateway
                        </p>
                    </div>
                }
            >

                <PaymentForm currentPlan={currentPlan as PlanType} onSuccess={() => {
                    setIsOpenPaymentMethod(false)
                }} />
            </AllocateDrawer>


        </div>
    )
}

export default BillingManagement