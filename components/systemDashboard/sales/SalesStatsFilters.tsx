"use client"

import React, { useState } from "react"
import { Check, ChevronsUpDown, X, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SalesStatsFiltersDto } from "@/types/sales"
import { useFetchOrganizations } from "@/features/system/hooks"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils/cn"
import { fetchOrganizations } from "@/lib/services/system";
import { toast } from "sonner";
import { SearchableSelect } from "@/components/shared/searchable-select";
import { DatePickerField } from "@/components/shared/datePickerField";

type SalesStatsFiltersProps = {
    filters: SalesStatsFiltersDto
    onChange: (patch: Partial<SalesStatsFiltersDto>) => void
    onReset: () => void
}

const SalesStatsFilters = ({ filters, onChange, onReset }: SalesStatsFiltersProps) => {
    const [open, setOpen] = React.useState(false)

    // Local state to handle the search input for the API call
    // Note: If your API is fast, you can sync this with CommandInput
    const [searchedOrg, setSearchedOrg] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)




    const onChangeSearch = async (value: string) => {
        // Call the service directly to search users
        const response = await fetchOrganizations({ name: value, limit: 10, showDeletedOrg: false });
        setSearchedOrg(response?.data || []);
    }

    // Memoize the selected organization name to display on the button trigger
    const selectedOrgName = React.useMemo(() => {
        if (!filters.org_id) return null
        return searchedOrg.find((org: any) => org.id === filters.org_id)?.name
    }, [filters.org_id, searchedOrg])

    return (
        <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200/50 transition-colors">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-base font-bold tracking-tight text-slate-800">Analytics Filters</h2>
                    <p className="text-xs text-slate-400 font-medium">Refine lead statistics by organization and date range.</p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onReset}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                    <X size={14} className="mr-1" /> Clear All
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {/* Organization Searchable Selector */}
                <SearchableSelect
                    isMulti={false}
                    label="Organization"
                    placeholder="Select organization"
                    onChange={(value) => onChange({ org_id: value })}
                    value={filters.org_id}
                    options={searchedOrg.map((org: any) => ({ value: org.id, label: org.name }))}
                    emptyMessage='Search for organization by name...'
                    onSearchChange={onChangeSearch}
                />

                <DatePickerField
                    label="From Date"
                    value={filters.startDate ? new Date(filters.startDate) : undefined}
                    onChange={(date) => onChange({ startDate: date ? new Date(date).toISOString() : undefined })}
                    inputClassName="justify-start"
                />
                <DatePickerField
                    label="To Date"
                    value={filters.endDate ? new Date(filters.endDate) : undefined}
                    onChange={(date) => onChange({ endDate: date ? new Date(date).toISOString() : undefined })}
                    inputClassName="justify-start"
                />
           
            </div>
        </section>
    )
}

export default SalesStatsFilters