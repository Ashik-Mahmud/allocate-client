import { TrendingUp, AlertTriangle, CheckCircle2, BarChart3 } from 'lucide-react'
import React from 'react'

interface ExecutiveSummaryProps {
    summary: string
    criticalAlertCount: number
    staffCount: number
    activeStaffCount: number
    totalBookings: number
    upcomingBookings: number
    creditCoverageRatio: number
}

export const ExecutiveSummary = ({
    summary,
    criticalAlertCount,
    staffCount,
    activeStaffCount,
    totalBookings,
    upcomingBookings,
    creditCoverageRatio,
}: ExecutiveSummaryProps) => {
    const utilizationRate = Math.round((activeStaffCount / staffCount) * 100)
    const healthStatus = criticalAlertCount > 2 ? 'critical' : criticalAlertCount > 0 ? 'warning' : 'healthy'
    const healthColors = {
        critical: 'from-rose-600 to-rose-700 text-white',
        warning: 'from-amber-600 to-amber-700 text-white',
        healthy: 'from-green-600 to-green-700 text-white',
    }

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3 flex-1">
                    <div className={`p-3 rounded-xl bg-linear-to-br ${healthColors[healthStatus]}/20`}>
                        <BarChart3 size={24} className={`text-${healthStatus === 'critical' ? 'rose' : healthStatus === 'warning' ? 'amber' : 'green'}-600 dark:text-${healthStatus === 'critical' ? 'rose' : healthStatus === 'warning' ? 'amber' : 'green'}-400`} />
                    </div>
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Executive Summary</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Organization health & performance</p>
                    </div>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold text-white bg-linear-to-r ${healthColors[healthStatus]}`}>
                    {healthStatus === 'critical' ? '🔴 Critical' : healthStatus === 'warning' ? '🟠 Warning' : '🟢 Healthy'}
                </div>
            </div>

            <div className="mb-6 p-4 rounded-lg bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{summary}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="p-3 rounded-lg bg-linear-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-900/30">
                    <p className="text-[10px] md:text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">Utilization</p>
                    <p className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-300 mt-1">{utilizationRate}%</p>
                    <p className="text-[9px] text-blue-600 dark:text-blue-500 mt-0.5">{activeStaffCount} of {staffCount} active</p>
                </div>

                <div className="p-3 rounded-lg bg-linear-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-900/30">
                    <p className="text-[10px] md:text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">Bookings</p>
                    <p className="text-xl md:text-2xl font-bold text-purple-900 dark:text-purple-300 mt-1">{totalBookings}</p>
                    <p className="text-[9px] text-purple-600 dark:text-purple-500 mt-0.5">{upcomingBookings} upcoming</p>
                </div>

                <div className="p-3 rounded-lg bg-linear-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
                    <p className="text-[10px] md:text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Coverage</p>
                    <p className="text-xl md:text-2xl font-bold text-emerald-900 dark:text-emerald-300 mt-1">{(creditCoverageRatio * 100).toFixed(0)}%</p>
                    <p className="text-[9px] text-emerald-600 dark:text-emerald-500 mt-0.5">Pool vs Assigned</p>
                </div>

                <div className={`p-3 rounded-lg bg-linear-to-br ${
                    criticalAlertCount > 2 
                        ? 'from-rose-50 to-rose-100/50 dark:from-rose-900/20 dark:to-rose-900/10' 
                        : 'from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10'
                } border ${criticalAlertCount > 2 ? 'border-rose-200 dark:border-rose-900/30' : 'border-amber-200 dark:border-amber-900/30'}`}>
                    <p className={`text-[10px] md:text-xs font-semibold uppercase tracking-wide ${
                        criticalAlertCount > 2 
                            ? 'text-rose-700 dark:text-rose-400' 
                            : 'text-amber-700 dark:text-amber-400'
                    }`}>Critical Alerts</p>
                    <p className={`text-xl md:text-2xl font-bold mt-1 ${
                        criticalAlertCount > 2 
                            ? 'text-rose-900 dark:text-rose-300' 
                            : 'text-amber-900 dark:text-amber-300'
                    }`}>{criticalAlertCount}</p>
                    <p className={`text-[9px] mt-0.5 ${
                        criticalAlertCount > 2 
                            ? 'text-rose-600 dark:text-rose-500' 
                            : 'text-amber-600 dark:text-amber-500'
                    }`}>Immediate action</p>
                </div>
            </div>
        </div>
    )
}
