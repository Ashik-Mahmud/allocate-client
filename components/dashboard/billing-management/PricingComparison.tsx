"use client"

import React from 'react'
import { SUBSCRIPTION_LIMITS } from '@/lib/constants/subscription'
import { PlanType } from '@/types/organization'
import { PLAN_CARDS } from './billing-constants'
import { PlanCard } from './PlanCard'
import DialogPopup from '@/components/shared/dialog-popup';
import ContactSalesForm from './ContactSalesPopup';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';
import { useDetectCountry } from '@/hooks/use-detect-country';
import { useCurrentUser } from '@/features/auth';
import useTrialAvailable from '@/hooks/use-trial';
import TrialConfirmationPopup from './TrialConfirmationPopup';

interface PricingComparisonProps {
    currentPlan: PlanType
    onUpgrade?: (type: PlanType) => void
}

function SectionShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>
            {children}
        </section>
    )
}

export const PricingComparison: React.FC<PricingComparisonProps> = ({ currentPlan, onUpgrade }) => {
    const router = useRouter();
    const [isOpenContactSales, setIsOpenContactSales] = React.useState(false)
    const [isOpenTrialConfirmation, setIsOpenTrialConfirmation] = React.useState(false)
    const { isTrialAvailable } = useTrialAvailable();
    return (
        <SectionShell title="Plan comparison" subtitle="The essentials only, so the cards stay short and easy to compare.">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {PLAN_CARDS.map((plan) => (
                    <PlanCard
                        key={plan.plan}
                        plan={plan}
                        isCurrent={plan.plan === currentPlan}
                        currentPlan={currentPlan}
                        isTrialAvailable={isTrialAvailable || false}
                        onClick={(type) => {
                            if (type === PlanType.ENTERPRISE) {
                                setIsOpenContactSales(true)
                            } else if (type === PlanType.FREE) {
                                router.push(ROUTES.pricing)
                            } else if (type === PlanType.PRO) {
                                // setIsOpenPaymentMethod(true)
                                onUpgrade && onUpgrade?.(type)
                            } else if (type === 'trial') {
                                setIsOpenTrialConfirmation(true)
                            }
                        }} // Replace with actual click handler if needed
                    />
                ))}
            </div>

            <DialogPopup
                open={isOpenContactSales}
                onOpenChange={setIsOpenContactSales}
                title="Contact Sales"
                description="Our sales team is here to help you find the perfect plan for your needs. Whether you have questions about features, pricing, or need a custom solution, we're ready to assist you. Fill out the form below, and we'll get back to you as soon as possible."
            >
                <ContactSalesForm />
            </DialogPopup>
            <DialogPopup
                open={isOpenTrialConfirmation}
                onOpenChange={setIsOpenTrialConfirmation}
                size="sm"
            >
                <TrialConfirmationPopup
                    onSuccess={() => {
                        setIsOpenTrialConfirmation(false);
                    }}
                    onCancel={() => setIsOpenTrialConfirmation(false)}
                />
            </DialogPopup>
        </SectionShell>
    )
}
