import React from 'react'
import { TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface StatItemProps {
    label: string
    value: string | number
    variant?: 'default' | 'warning' | 'success'
    icon?: React.ReactNode
    progress?: number
}

const StatItem = ({ label, value, variant = 'default', icon, progress }: StatItemProps) => {
    const gradients = {
        default: 'from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-900/30',
        warning: 'from-amber-500/10 to-amber-600/5 border-amber-200 dark:border-amber-900/30',
        success: 'from-green-500/10 to-green-600/5 border-green-200 dark:border-green-900/30',
    }[variant]

    const textColor = {
        default: 'text-blue-700 dark:text-blue-400',
        warning: 'text-amber-700 dark:text-amber-400',
        success: 'text-green-700 dark:text-green-400',
    }[variant]

    const badgeIcon = {
        default: <TrendingUp size={14} />,
        warning: <AlertTriangle size={14} />,
        success: <CheckCircle2 size={14} />,
    }[variant]

    return (
        <div className={`p-4 rounded-xl border bg-linear-to-br ${gradients} hover:shadow-md transition-all duration-300 group cursor-default`}>
            <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">{label}</p>
                <div className={`p-1.5 rounded-lg ${textColor} bg-white dark:bg-slate-800/50 group-hover:scale-110 transition-transform`}>
                    {icon || badgeIcon}
                </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
            {progress !== undefined && (
                <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-500 ${
                            variant === 'warning' ? 'bg-amber-500' : 
                            variant === 'success' ? 'bg-green-500' : 
                            'bg-blue-500'
                        }`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    )
}

interface MetricsSummaryProps {
    totalStaff: number
    organizationCreditPool: number
    totalCreditsAssigned: number
    lowCreditAlertsCount: number
    totalBookings: number
    upcomingBookings: number
}

export const MetricsSummary = ({
    totalStaff,
    organizationCreditPool,
    totalCreditsAssigned,
    lowCreditAlertsCount,
    totalBookings,
    upcomingBookings,
}: MetricsSummaryProps) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
            <StatItem label="Staff" value={totalStaff} variant="default" />
            <StatItem 
                label="Org Credits" 
                value={organizationCreditPool} 
                variant={organizationCreditPool < 50 ? 'warning' : 'default'}
                progress={Math.min(100, (organizationCreditPool / 100) * 100)}
            />
            <StatItem label="Assigned" value={totalCreditsAssigned} variant="default" />
            <StatItem 
                label="Low Alerts" 
                value={lowCreditAlertsCount} 
                variant={lowCreditAlertsCount > 0 ? 'warning' : 'success'}
            />
            <StatItem label="Bookings" value={totalBookings} variant="default" />
            <StatItem 
                label="Upcoming" 
                value={upcomingBookings} 
                variant={upcomingBookings > 0 ? 'success' : 'default'}
            />
        </div>
    )
}
