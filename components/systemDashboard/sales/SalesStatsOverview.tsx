"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SaleInquiryStatus, SalesStatsResponse } from "@/types/sales"
import { STATUS_META } from "./Sales.constant"
import { Users, Globe, TrendingUp, Inbox } from "lucide-react"
import { cn } from "@/lib/utils/cn";

type SalesStatsOverviewProps = {
  stats: SalesStatsResponse["data"] | undefined
  isLoading?: boolean
}

const STATUS_ORDER: SaleInquiryStatus[] = [
  SaleInquiryStatus.PENDING,
  SaleInquiryStatus.CONTACTED,
  SaleInquiryStatus.CONVERTED,
  SaleInquiryStatus.CLOSED,
]

const TEAM_SIZE_ORDER = ["1-10", "11-50", "51-100", "100+", "Unknown"] as const

const SalesStatsOverview = ({ stats, isLoading = false }: SalesStatsOverviewProps) => {
  // Skeleton Loader
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-[2rem] bg-slate-50" />
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No Stats Available</p>
        <p className="text-xs text-slate-400 mt-1">Adjust filters to see lead performance.</p>
      </div>
    )
  }

  const topCountries = Object.entries(stats?.byCountry || {})
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)

  // Helper to calculate percentage for progress bars
  const getPercentage = (value: number, total: number) => {
    if (!total) return 0
    return Math.min(Math.round((value / total) * 100), 100)
  }


  return (
    <div className="space-y-6">
      {/* Top Row: Hero Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Leads" value={stats.totalLeads} icon={Inbox} color="text-blue-600" />
        <StatCard title="Pending Today" value={stats.pendingToday} icon={ClockIcon} color="text-orange-500" />
        <StatCard title="Conversion" value={`${stats.conversionRate}`} icon={TrendingUp} color="text-green-600" />
        <StatCard title="Global Reach" value={Object.keys(stats.byCountry || {}).length} icon={Globe} color="text-purple-600" />
      </div>

      {/* Detail Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* By Status */}
        <DetailCard title="Pipeline Status">
          {STATUS_ORDER.map((status) => {
            const count = stats.byStatus?.[status] || 0
            const percentage = getPercentage(count, stats.totalLeads)
            return (
              <div key={status} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                  <span className={cn("px-2 py-0.5 rounded-md", STATUS_META[status]?.className)}>
                    {STATUS_META[status]?.label}
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">{count}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-900 dark:bg-slate-500 transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </DetailCard>

        {/* Top Countries */}
        <DetailCard title="Top Countries">
          {topCountries.length > 0 ? (
            topCountries.map(([country, count]) => {
              const percentage = getPercentage(count as number, stats.totalLeads)
              return (
                <div key={country} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                    <span>{country}</span>
                    <span className="text-slate-900 dark:text-slate-300">{count as number}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-xs text-slate-400 italic">No geographic data found.</p>
          )}
        </DetailCard>

        {/* By Team Size */}
        <DetailCard title="Organization Size">
          <div className="space-y-4">
            {TEAM_SIZE_ORDER.map((bucket) => {
              const count = stats.byTeamSize?.[bucket] || 0
              return (
                <div key={bucket} className="flex items-center gap-3">
                   <div className="w-10 text-[10px] font-black text-slate-400">{bucket}</div>
                   <div className="flex-1 h-8 bg-slate-50 dark:bg-slate-900 rounded-lg border relative border-slate-100 dark:border-slate-800 flex items-center px-3 justify-between">
                      <div 
                        className="absolute h-full bg-slate-200/50 dark:bg-slate-700/50 left-0 top-0 rounded-lg" 
                        style={{ width: `${getPercentage(count, stats.totalLeads)}%` }}
                      />
                      <span className="relative z-10 text-xs font-bold text-slate-700 dark:text-slate-300">{count}</span>
                      <Users size={12} className="relative z-10 text-slate-300" />
                   </div>
                </div>
              )
            })}
          </div>
        </DetailCard>
      </div>
    </div>
  )
}

// Reusable Small Stat Card
const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 dark:border-slate-800 rounded-3xl overflow-hidden">
    <CardContent className="p-5 flex items-center gap-4">
      <div className={cn("p-3 rounded-2xl bg-slate-50", color)}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black text-slate-900 dark:text-slate-300">{value}</p>
      </div>
    </CardContent>
  </Card>
)

// Reusable Detailed Section Card
const DetailCard = ({ title, children }: any) => (
  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 dark:border-slate-800 rounded-[2rem] p-2">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-300">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-5">
      {children}
    </CardContent>
  </Card>
)

const ClockIcon = ({ size, className }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} height={size} 
    viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" 
    strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

export default SalesStatsOverview