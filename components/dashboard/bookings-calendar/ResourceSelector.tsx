"use client"
import React from 'react'
import { Resource } from '@/types/resources'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'
import BookingStatusBadge from '../my-bookings/BookingStatus'
import { BookingStatus } from '@/types/booking'

interface ResourceSelectorProps {
    resources: Resource[]
    selectedResourceId: string | undefined
    onResourceSelect: (resourceId: string) => void
    isLoading?: boolean
}

const ResourceSelector = ({
    resources,
    selectedResourceId,
    onResourceSelect,
    isLoading = false
}: ResourceSelectorProps) => {
    const [searchTerm, setSearchTerm] = React.useState('')

    const filteredResources = React.useMemo(() => {
        return resources.filter(r =>
            r.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [resources, searchTerm])

    const selectedResource = resources.find(r => r.id === selectedResourceId)

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    Select Resource
                </h3>

                {/* Search Input */}
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-xl"
                    />
                </div>

                {/* Resource Grid */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-2 max-h-80 overflow-y-auto scrollbar-hide">
                    {isLoading ? (
                        <div className="col-span-full text-center py-6">
                            <p className="text-sm text-slate-500">Loading resources...</p>
                        </div>
                    ) : filteredResources.length > 0 ? (
                        filteredResources.map((resource) => (
                            <button
                                key={resource.id}
                                onClick={() => onResourceSelect(resource.id)}
                                className={cn(
                                    "group relative cursor-pointer p-3 rounded-2xl border-2 transition-all duration-200 text-left",
                                    selectedResourceId === resource.id
                                        ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/10"
                                        : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950"
                                )}
                            >
                                <div className="flex gap-3 items-start">
                                    {/* Photo */}
                                    <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                        {resource.photo ? (
                                            <img
                                                src={resource.photo}
                                                alt={resource.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-linear-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-slate-500">
                                                <span className="text-xs font-bold">IMG</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                            {resource.name}
                                        </h4>

                                        {resource?.is_occupied ? <div className='w-max'>
                                            <BookingStatusBadge status={BookingStatus.CHECKED_IN} />
                                        </div> : <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {resource.type || 'Resource'}
                                        </p>}
                                        <div className="flex items-baseline gap-1 mt-1">
                                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                {typeof resource.hourly_rate === 'string'
                                                    ? resource.hourly_rate
                                                    : resource.hourly_rate?.toFixed(2)
                                                }cr</span>
                                            <span className="text-[10px] text-slate-400">/hour</span>
                                        </div>
                                    </div>

                                    {/* Status Indicator */}
                                    {selectedResourceId === resource.id && (
                                        <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-6">
                            <p className="text-sm text-slate-500">No resources found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Selected Resource Info */}
            {selectedResource && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Selected Resource
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                        {selectedResource.name}
                    </p>
                </div>
            )}
        </div>
    )
}

export default ResourceSelector
