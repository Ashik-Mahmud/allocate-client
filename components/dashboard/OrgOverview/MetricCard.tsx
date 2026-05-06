import React from 'react'

interface MetricCardProps {
    title: string
    value: string | number
    icon: React.ReactNode
    isCritical?: boolean
    trend?: 'up' | 'down'
}

export const MetricCard = ({ title, value, icon, isCritical, trend }: MetricCardProps) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${isCritical ? 'bg-rose-100 dark:bg-rose-900/20 text-rose-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                {icon}
            </div>
            {isCritical && <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>}
        </div>
        <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
    </div>
)
