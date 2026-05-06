import { PieChart, TrendingDown, AlertCircle } from 'lucide-react'
import React from 'react'

interface TopSpender {
    name: string
    creditsSpent: number
}

interface FinancialOverviewProps {
    organizationCreditPool: number
    totalCreditsAssigned: number
    creditCoverageRatio: number
    lowCreditAlertsCount: number
    lowCreditSeverity: string
    totalCreditsSpentThisMonth: number
    topSpenders: TopSpender[]
}

export const FinancialOverview = ({
    organizationCreditPool,
    totalCreditsAssigned,
    creditCoverageRatio,
    lowCreditAlertsCount,
    lowCreditSeverity,
    totalCreditsSpentThisMonth,
    topSpenders,
}: FinancialOverviewProps) => {
    const severityColor = {
        HIGH: 'from-rose-600 to-rose-700 text-white',
        MEDIUM: 'from-amber-600 to-amber-700 text-white',
        LOW: 'from-green-600 to-green-700 text-white',
    }

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-linear-to-br from-emerald-200 to-emerald-100 dark:from-emerald-800/50 dark:to-emerald-900/30">
                    <PieChart size={24} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
                        Financial Overview
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Credit usage & spending patterns</p>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-lg bg-linear-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
                    <p className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Org Pool</p>
                    <p className="text-lg md:text-xl font-bold text-emerald-900 dark:text-emerald-300 mt-1">{organizationCreditPool}</p>
                </div>

                <div className="p-3 rounded-lg bg-linear-to-br from-teal-50 to-teal-100/50 dark:from-teal-900/20 dark:to-teal-900/10 border border-teal-200 dark:border-teal-900/30">
                    <p className="text-[10px] font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wide">Assigned</p>
                    <p className="text-lg md:text-xl font-bold text-teal-900 dark:text-teal-300 mt-1">{totalCreditsAssigned}</p>
                </div>

                <div className={`p-3 rounded-lg bg-linear-to-br ${creditCoverageRatio < 0.5 ? 'from-rose-50 to-rose-100/50 dark:from-rose-900/20 dark:to-rose-900/10' : 'from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10'} border ${creditCoverageRatio < 0.5 ? 'border-rose-200 dark:border-rose-900/30' : 'border-blue-200 dark:border-blue-900/30'}`}>
                    <p className={`text-[10px] font-semibold uppercase tracking-wide ${creditCoverageRatio < 0.5 ? 'text-rose-700 dark:text-rose-400' : 'text-blue-700 dark:text-blue-400'}`}>Coverage Ratio</p>
                    <p className={`text-lg md:text-xl font-bold mt-1 ${creditCoverageRatio < 0.5 ? 'text-rose-900 dark:text-rose-300' : 'text-blue-900 dark:text-blue-300'}`}>{(creditCoverageRatio * 100).toFixed(1)}%</p>
                </div>
            </div>

            {/* Spending This Month */}
            <div className="mb-6 p-4 rounded-lg bg-linear-to-r from-indigo-50 to-indigo-50/50 dark:from-indigo-900/20 dark:to-indigo-900/10 border border-indigo-200 dark:border-indigo-900/30">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide mb-1">Spending This Month</p>
                        <p className="text-2xl md:text-3xl font-bold text-indigo-900 dark:text-indigo-300">{totalCreditsSpentThisMonth}</p>
                    </div>
                    <TrendingDown size={24} className="text-indigo-600 dark:text-indigo-400" />
                </div>
            </div>

            {/* Top Spenders */}
            <div className="mb-6">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">Top Spenders</p>
                <div className="space-y-2.5">
                    {topSpenders.map((spender, idx) => {
                        const percentage = (spender.creditsSpent / totalCreditsSpentThisMonth) * 100
                        return (
                            <div key={idx} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                                <div className="flex items-start justify-between mb-2">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{spender.name}</p>
                                    <p className="text-base font-bold text-indigo-600 dark:text-indigo-400 shrink-0">{spender.creditsSpent}</p>
                                </div>
                                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-linear-to-r from-indigo-400 to-indigo-600 transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">{percentage.toFixed(0)}% of monthly spend</p>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Severity Alert */}
            <div className={`p-4 rounded-lg bg-linear-to-r ${severityColor[lowCreditSeverity as keyof typeof severityColor]} flex items-start gap-3`}>
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <div>
                    <p className="text-xs font-bold uppercase tracking-wide">Credit Coverage Severity</p>
                    <p className="text-sm mt-1">{lowCreditSeverity} - {lowCreditAlertsCount} staff below critical threshold</p>
                </div>
            </div>
        </div>
    )
}
