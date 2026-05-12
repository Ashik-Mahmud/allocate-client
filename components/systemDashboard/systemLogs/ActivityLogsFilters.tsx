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

    const handleStartDateChange = (date: Date | undefined) => {
        setLocalDateRange(prev => ({ ...prev, start: date }));
        onDateRangeChange(date, localDateRange.end);
    };

    const handleEndDateChange = (date: Date | undefined) => {
        setLocalDateRange(prev => ({ ...prev, end: date }));
        onDateRangeChange(localDateRange.start, date);
    };

    const clearStartDate = () => {
        setLocalDateRange(prev => ({ ...prev, start: undefined }));
        onDateRangeChange(undefined, localDateRange.end);
    };

    const clearEndDate = () => {
        setLocalDateRange(prev => ({ ...prev, end: undefined }));
        onDateRangeChange(localDateRange.start, undefined);
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
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Organization</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-600" />
                            <Input
                                placeholder="Enter org ID"
                                value={organizationFilter}
                                onChange={(e) => setOrganizationFilter(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-9 h-9 text-sm border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
                            />
                        </div>
                    </div>

                    {/* User Filter */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">User ID</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-600" />
                            <Input
                                placeholder="Enter user ID"
                                value={userFilter}
                                onChange={(e) => setUserFilter(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-9 h-9 text-sm border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
                            />
                        </div>
                    </div>

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

// DatePicker component
const DatePicker = ({ selected, onChange }: { selected?: Date; onChange: (date: Date) => void }) => {
    const [month, setMonth] = useState(selected || new Date());

    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth(month) }, (_, i) => i + 1);

    const previousMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1));
    const nextMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1));

    const isSelected = (day: number) => {
        if (!selected) return false;
        return (
            selected.getDate() === day &&
            selected.getMonth() === month.getMonth() &&
            selected.getFullYear() === month.getFullYear()
        );
    };

    const handleDayClick = (day: number) => {
        onChange(new Date(month.getFullYear(), month.getMonth(), day));
    };

    return (
        <div className="w-80">
            {/* Month/Year Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={previousMonth}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                >
                    ←
                </button>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    {format(month, 'MMMM yyyy')}
                </h3>
                <button
                    onClick={nextMonth}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                >
                    →
                </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 h-8 flex items-center justify-center">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8" />
                ))}

                {/* Days */}
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => handleDayClick(day)}
                        className={cn(
                            "h-8 rounded text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800",
                            isSelected(day)
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'text-slate-900 dark:text-slate-100'
                        )}
                    >
                        {day}
                    </button>
                ))}
            </div>
        </div>
    );
};
