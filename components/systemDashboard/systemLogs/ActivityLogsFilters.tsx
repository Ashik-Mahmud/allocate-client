"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils/cn';
import { format } from 'date-fns';
import { Clock, Search, Filter, Download, RefreshCw, Building2, User, X } from 'lucide-react';
import { useState } from 'react';
import { ActivityLogFilters } from '@/types/systemGlobal';
import { DatePickerField } from '@/components/shared/datePickerField';
import { SearchableSelect } from '@/components/shared/searchable-select';
import { fetchOrganizations, fetchUsers } from '@/lib/services/system';

interface DateRange {
    start?: Date;
    end?: Date;
}

interface ActivityLogsFiltersProps {
    onSearch: (organizationId?: string, userId?: string) => void;
    onDateRangeChange: (start?: Date, end?: Date) => void;
    onReset: () => void;
    onRefresh: () => void;
    onExport: () => void;
    isLoading?: boolean;
    hasLogs?: boolean;
    dateRange?: DateRange;
}

export const ActivityLogsFilters = ({
    onSearch,
    onDateRangeChange,
    onReset,
    onRefresh,
    onExport,
    isLoading,
    hasLogs = false,
    dateRange = {},
}: ActivityLogsFiltersProps) => {
    const [organizationFilter, setOrganizationFilter] = useState('');
    const [userFilter, setUserFilter] = useState('');
    const [localDateRange, setLocalDateRange] = useState<DateRange>(dateRange);
    const [searchedOrgs, setSearchedOrgs] = useState<{ value: string; label: string }[]>([]);
    const [searchedUsers, setSearchedUsers] = useState<{ value: string; label: string }[]>([]);

    const handleStartDateChange = (date: Date | undefined) => {
        setLocalDateRange(prev => ({ ...prev, start: date }));
        onDateRangeChange(date, localDateRange.end);
    };

    const handleEndDateChange = (date: Date | undefined) => {
        setLocalDateRange(prev => ({ ...prev, end: date }));
        onDateRangeChange(localDateRange.start, date);
    };

    const handleSearch = () => {
        onSearch(organizationFilter || undefined, userFilter || undefined);
    };

    const handleReset = () => {
        setOrganizationFilter('');
        setUserFilter('');
        setLocalDateRange({});
        onReset();
    };


    const onSearchChange = async (search: string) => {
        // Implement search logic for organizations if needed
        try {
            const result = await fetchOrganizations({
                name: search,
                limit: 10,
                showDeletedOrg: false
            })
            const proccessedOrgs = result?.data?.map((org: any) => ({
                value: org.id,
                label: `${org?.name} (${org?._count?.users || 0} users)`
            }));
            setSearchedOrgs(proccessedOrgs || []);
        } catch (error) {
            console.error('Error fetching organizations:', error);
        }

    }

    const onSearchUserChange = async (search: string) => {
        // Implement search logic for users if needed
        // You can create a similar API call to fetch users based on the search term
        try {
            const result = await fetchUsers({
                name: search,
                page: 1,
                limit: 10,
            })
            const proccessedUsers = result?.data?.map((user: any) => ({
                value: user.id,
                label: `${user.name} (${user.email})`
            }));
            setSearchedUsers(proccessedUsers || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }


    return (
        <Card className="border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 md:p-6">
            <div className="space-y-4">
                {/* Filter Header */}
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <h2 className="font-semibold text-slate-900 dark:text-slate-50">Filters</h2>
                </div>

                {/* Filter Grid */}
                <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {/* Organization Filter */}
                    <SearchableSelect
                        label="Organization"
                        placeholder="Select organization"
                        onChange={(value) => setOrganizationFilter(value)}
                        value={organizationFilter}
                        options={searchedOrgs}
                        emptyMessage='Search for organization by name...'
                        onSearchChange={onSearchChange}
                        isMulti={false}
                        inputClassName="text-left "
                        icon={<Building2 className="h-4 w-4 text-slate-400 dark:text-slate-600" />}
                    />

                    <SearchableSelect
                        label="User"
                        placeholder="Select user"
                        onChange={(value) => setUserFilter(value)}
                        value={userFilter}
                        options={searchedUsers}
                        emptyMessage='Search for user by name...'
                        onSearchChange={onSearchUserChange}
                        isMulti={false}
                        inputClassName="text-left "
                        icon={<User className="h-4 w-4 text-slate-400 dark:text-slate-600" />}
                    />
                   
                    {/* Start Date */}
                    <DatePickerField
                        label="Start Date"
                        value={localDateRange.start}
                        onChange={handleStartDateChange}
                        placeholder="Pick date"
                        inputClassName="text-left justify-start"
                    />

                    {/* End Date */}
                    <DatePickerField
                        label="End Date"
                        value={localDateRange.end}
                        onChange={handleEndDateChange}
                        placeholder="Pick date"
                        inputClassName="text-left justify-start"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="h-9 gap-2 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Search className="h-4 w-4" />
                        Search
                    </Button>
                    <Button
                        onClick={handleReset}
                        disabled={isLoading}
                        variant="outline"
                        className="h-9 border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900 disabled:opacity-50"
                    >
                        Reset
                    </Button>
                    <Button
                        onClick={onRefresh}
                        disabled={isLoading}
                        variant="outline"
                        className="h-9 gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900 disabled:opacity-50"
                    >
                        <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                        Refresh
                    </Button>
                    <Button
                        onClick={onExport}
                        disabled={!hasLogs || isLoading}
                        variant="outline"
                        className="h-9 gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>
        </Card>
    );
};
