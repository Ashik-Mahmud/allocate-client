"use client"

import React, { useMemo } from "react"
import { Lock, Crown, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/constants/routes"
import { useCurrentUser } from "@/features/auth"
import { PlanType } from "@/types/organization"

type FeatureGuardProps = {
    children: React.ReactNode
    isPremium?: boolean
    mode?: "blur" | "block"
    title?: string
    description?: string
    className?: string
}

export default function FeatureGuard({
    children,
    isPremium,
    mode = "blur",
    title = "Premium Feature",
    description = "Upgrade your plan to unlock this information.",
    className,
}: FeatureGuardProps) {
    const currentPlan = useCurrentUser().user?.organization?.plan_type
    const isPremiumUser = useMemo(() => {
        return isPremium === undefined ? currentPlan === PlanType.ENTERPRISE || currentPlan === PlanType.PRO : isPremium
    }, [currentPlan, isPremium])

    // If the user is premium, just render the content normally
    if (isPremiumUser) {
        return <>{children}</>
    }

    // MODE: BLOCK (Replaces content with a CTA Card)
    if (mode === "block") {
        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center dark:border-slate-800 dark:bg-slate-900/20",
                    className
                )}
            >
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30">
                    <Crown className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                <p className="mt-2 max-w-70 text-sm text-slate-500 dark:text-slate-400">
                    {description}
                </p>
                <Button asChild className="mt-6 rounded-full bg-slate-900 px-6 dark:bg-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-200">
                    <Link href={ROUTES.dashboardOrgAdmin.billing}>
                        Upgrade Now <ArrowRight className="ml-2 size-4" />
                    </Link>
                </Button>
            </div>
        )
    }

    // MODE: BLUR (Show a blurred "Teaser")
    return (
        <div className={cn("relative group overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950", className)}>

            {/* 1. Fake UI Background (Non-selectable) */}
            <div className="p-4 space-y-4 select-none blur-[6px] grayscale opacity-40 pointer-events-none">
                {/* Fake Header */}
                <div className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>

                {/* Fake Table/Rows */}
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4 items-center">
                        <div className="h-10 w-10 rounded bg-slate-200 dark:bg-slate-700 shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                            <div className="h-3 w-2/3 bg-slate-100 dark:bg-slate-800 rounded" />
                        </div>
                    </div>
                ))}

                {/* Fake Chart area */}
                <div className="h-24 w-full bg-slate-100 dark:bg-slate-800 rounded-lg flex items-end p-2 gap-1">
                    {[40, 70, 45, 90, 65, 80].map((h, i) => (
                        <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                    ))}
                </div>
            </div>

            {/* 2. Glassmorphism Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/30 backdrop-blur-[1px] transition-all group-hover:bg-white/30 dark:bg-slate-950/40">

                {/* Decorative Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none" />

                <div className="relative flex flex-col items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <Lock className="size-4 text-slate-600 dark:text-slate-400" />
                    </div>

                    <div className="text-center space-y-1 px-4">
                        <h4 className="text-[13px] font-bold tracking-tight text-slate-900 dark:text-white uppercase">
                            {title || "Premium Insights"}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-45 leading-tight">
                            {description || "Upgrade to a Pro plan to unlock premium insights."}
                        </p>
                    </div>

                    <Link
                        href={ROUTES.dashboardOrgAdmin.billing}
                        className="mt-2 flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-[11px] font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-700 hover:scale-105 active:scale-95"
                    >
                        <Sparkles className="size-3 fill-current" />
                        UPGRADE NOW
                    </Link>
                </div>
            </div>
        </div>
    );
}