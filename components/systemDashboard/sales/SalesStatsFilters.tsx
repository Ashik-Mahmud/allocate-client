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

            <div className="grid gap-4 md:grid-cols-4">
                {/* Organization Searchable Selector */}
                <div className="md:col-span-2 flex flex-col gap-1.5">
                    <Label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Organization</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between rounded-xl border-slate-200 h-11 px-4 text-slate-600 hover:bg-slate-50 shadow-none font-medium"
                            >
                                {selectedOrgName ? selectedOrgName : "Select organization..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-2xl shadow-xl border-slate-100" align="start">
                            <Command className="rounded-2xl" shouldFilter={true}>
                                {/* 
                  shouldFilter={true} allows the Command component to filter internally 
                  based on the 'value' prop provided in CommandItem.
                */}
                                <CommandInput
                                    placeholder="Search organization..."
                                    className="h-11"
                                    onValueChange={onChangeSearch} // Trigger API search on type
                                />
                                <CommandList>
                                    {isLoading && (
                                        <div className="flex items-center justify-center py-6">
                                            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                        </div>
                                    )}
                                    <CommandEmpty>No organization found.</CommandEmpty>
                                    <CommandGroup>
                                        {searchedOrg.map((org: any) => (
                                            <CommandItem
                                                key={org.id}
                                                // CRITICAL: value must be unique and usually stringified for Command internal filtering
                                                value={org.name}
                                                onSelect={() => {
                                                    // Update parent filters state with the selected ID
                                                    onChange({ org_id: org.id })
                                                    setOpen(false)
                                                }}
                                                className="rounded-lg m-1 py-2 cursor-pointer"
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4 text-blue-600",
                                                        filters.org_id === org.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <span className="font-medium text-slate-700">{org.name}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Date Filter: From */}
                <div className="flex flex-col gap-1.5">
                    <Label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">From Date</Label>
                    <input
                        type="date"
                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                        value={filters.startDate ? new Date(filters.startDate).toISOString().split('T')[0] : ''}
                        onChange={(event) => onChange({ startDate: new Date(event.target.value)?.toISOString() || undefined })}
                    />
                </div>

                {/* Date Filter: To */}
                <div className="flex flex-col gap-1.5">
                    <Label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">To Date</Label>
                    <input
                        type="date"
                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                        value={filters.endDate ? new Date(filters.endDate).toISOString().split('T')[0] : ''}
                        onChange={(event) => {
                            // Ensure end date is always greater than or equal to start date
                            const selectedEndDate = new Date(event.target.value)
                            const currentStartDate = filters.startDate ? new Date(filters.startDate) : new Date()
                            if (selectedEndDate >= currentStartDate) onChange({ endDate: selectedEndDate.toISOString() || undefined })
                            else {
                                toast.error("End date cannot be before start date.", {
                                    description: "Please select a valid end date.",
                                })
                            }
                        }}
                    />
                </div>
            </div>
        </section>
    )
}

export default SalesStatsFilters