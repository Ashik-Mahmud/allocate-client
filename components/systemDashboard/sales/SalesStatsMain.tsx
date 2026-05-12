"use client"

import React, { useMemo, useState } from "react"
import { RefreshCw } from "lucide-react"

import { useSalesStats } from "@/features/sales/hooks"
import { SalesStatsFiltersDto } from "@/types/sales"
import SalesStatsFilters from "./SalesStatsFilters"
import SalesStatsOverview from "./SalesStatsOverview"

const DEFAULT_STATS_FILTERS: SalesStatsFiltersDto = {
    org_id: undefined,
    startDate: undefined,
    endDate: undefined,
}

const SalesStatsMain = () => {
    const [filters, setFilters] = useState<SalesStatsFiltersDto>(DEFAULT_STATS_FILTERS)

    const queryFilters = useMemo(
        () => ({
            org_id: filters.org_id?.trim() || undefined,
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
        }),
        [filters]
    )

    const { data, isLoading, isFetching, error } = useSalesStats(queryFilters)

    const updateFilters = (patch: Partial<SalesStatsFiltersDto>) => {
        setFilters((current) => ({
            ...current,
            ...patch,
        }))
    }


    return (
        <div className="space-y-5">
            <section className="rounded-3xl border border-border bg-card p-4 shadow-sm shadow-black/5 transition-colors md:p-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Sales</p>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sales stats</h1>
                        <p className="text-sm text-muted-foreground">Overview of lead pipeline status, countries, and team-size distribution.</p>
                    </div>

                    <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                        {isFetching ? <RefreshCw className="size-3.5 animate-spin" /> : null}
                        <span>Live stats</span>
                    </div>
                </div>
            </section>

            <SalesStatsFilters
                filters={filters}
                onChange={updateFilters}
                onReset={() => setFilters(DEFAULT_STATS_FILTERS)}
            />

            {error ? (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                    {error instanceof Error ? error.message : "Unable to load sales stats"}
                </div>
            ) : null}

            <SalesStatsOverview stats={data?.data?.data} isLoading={isLoading} />
        </div>
    )
}

export default SalesStatsMain