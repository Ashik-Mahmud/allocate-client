"use client"

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'

export const BillingFooter: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 sm:px-6">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Need more capacity?</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Use the upgrade card or move straight to credits management.</p>
      </div>
      <Link
        href={ROUTES.dashboardOrgAdmin.creditManagement}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Manage credits
        <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}
