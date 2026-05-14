"use client"
import { DatePickerField } from '@/components/shared/datePickerField';
import { SearchableSelect } from '@/components/shared/searchable-select';
import { RevenueAnalyticsFilters } from '@/types/systemGlobal';
import { CalendarIcon, RefreshCw } from 'lucide-react';
import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchOrganizations } from '@/lib/services/system';

type Props = {
    onFilterChange: React.Dispatch<React.SetStateAction<RevenueAnalyticsFilters>>,
    filters: RevenueAnalyticsFilters
}

const FilterRevenueAnalysis = ({ onFilterChange, filters }: Props) => {

    const [searchedOrgs, setSearchedOrgs] = useState<{ value: string; label: string }[]>([]);

    // handle organization search for filter
    const handleOrgSearch = async (query: string) => {
        try {
            const result = await fetchOrganizations({ search: query, limit: 5, showDeletedOrg: false });

            if (result?.success) {
                const options = result?.data?.map(org => ({ value: org.id, label: org.name }));
                setSearchedOrgs(
                    options || []
                );
            }

        } catch (error) {
            console.error("Error fetching organizations for search:", error);
        }
    };
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Revenue Analytics</h1>
                    <p className="text-sm text-slate-500">Detailed financial performance and subscriber growth.</p>
                </div>

                <div className="flex items-center gap-4">

                    {/* By Date Range */}
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 dark:border-slate-600 p-2 rounded-2xl shadow-sm border border-slate-100">
                        <DatePickerField
                            label=""
                            value={filters.startDate ? new Date(filters.startDate) : undefined}
                            onChange={(value) => onFilterChange(prev => ({ ...prev, startDate: value?.toDateString() }))}
                            placeholder="Start Date"
                            className="text-left"
                        />
                        <span className="text-slate-400">to</span>
                        <DatePickerField
                            label=""
                            value={filters.endDate ? new Date(filters.endDate) : undefined}
                            onChange={(value) => onFilterChange(prev => ({ ...prev, endDate: value?.toDateString() }))}
                            placeholder="End Date"
                            className="text-left"
                        />

                    </div>

                    {/* By Orgnization */}
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 dark:border-slate-600 p-2 rounded-2xl shadow-sm border border-slate-100">
                        <SearchableSelect
                            label=""
                            placeholder="Filter by organization"
                            onChange={(value) => onFilterChange(prev => ({ ...prev, organizationId: value }))}
                            value={filters.organizationId}
                            options={searchedOrgs}
                            onSearchChange={handleOrgSearch}
                            emptyMessage='Search for organization by name...'
                            isMulti={false}
                            inputClassName="text-left "
                            icon={<CalendarIcon className="h-4 w-4 text-slate-400 " />}
                        />
                    </div>

                    {/* Group By */}
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 dark:border-slate-600 p-3.5 rounded-2xl shadow-sm border border-slate-100">
                        <span className="text-xs font-medium text-slate-400 ml-2">Group By</span>
                        <Select
                            value={filters.groupBy}
                            onValueChange={(val: any) => onFilterChange((prev: RevenueAnalyticsFilters) => ({ ...prev, groupBy: val }))}
                        >
                            <SelectTrigger className="w-30 border-none shadow-none focus:ring-0 font-semibold h-8 uppercase text-[10px] tracking-wider">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="day">Day</SelectItem>
                                <SelectItem value="week">Week</SelectItem>
                                <SelectItem value="month">Month</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Reset Filters */}
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 dark:border-slate-600 py-5 px-4 active:scale-95 rounded-2xl shadow-sm border border-slate-100 cursor-pointer" onClick={() => onFilterChange({ groupBy: 'month', organizationId: undefined, startDate: undefined, endDate: undefined })}>
                        <RefreshCw className="h-4 w-4 text-slate-400 dark:text-slate-200" />
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-200 ">Reset</span>
                    </div>


                </div>
            </div>

        </div>
    )
}

export default FilterRevenueAnalysis