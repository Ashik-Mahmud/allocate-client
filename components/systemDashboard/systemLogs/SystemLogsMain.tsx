"use client";

import { useFetchActivityLogs } from '@/features/system/hooks';
import { ActivityLog, ActivityLogFilters } from '@/types/systemGlobal';
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ActivityLogsFilters } from './ActivityLogsFilters';
import { ActivityLogsTable } from './ActivityLogsTable';
import { ActivityLogsPagination } from './ActivityLogsPagination';



interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type Props = {};

const SystemLogsMain = (props: Props) => {
  const [filters, setFilters] = useState<ActivityLogFilters>({
    page: 1,
    limit: 10,
  });

  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});

  const { data: logsData, isLoading, isError, refetch } = useFetchActivityLogs(filters) as any;

  const handleDateRangeChange = (start?: Date, end?: Date) => {
    setDateRange({ start, end });

    setFilters(prev => ({
      ...prev,
      startDate: start ? format(start, 'yyyy-MM-dd') : undefined,
      endDate: end ? format(end, 'yyyy-MM-dd') : undefined,
      page: 1,
    }));
  };

  const handleSearch = (organizationId?: string, userId?: string) => {
    setFilters(prev => ({
      ...prev,
      organizationId: organizationId || undefined,
      userId: userId || undefined,
      page: 1,
    }));
  };

  const handleReset = () => {
    setFilters({
      page: 1,
      limit: 10,
    });
    setDateRange({});
  };

  const handleExport = () => {
    const csvContent = generateCSV(logsData?.data || []);
    downloadCSV(csvContent);
  };

  const generateCSV = (data: ActivityLog[]) => {
    const headers = ['ID', 'User', 'Organization', 'Action', 'User Agent', 'Date', 'IP Address'];
    const rows = data.map(log => [
      log.id,
      log.user?.name,
      log.organization?.name || log.org_id || 'System Admin',
      log.action,
      log.userAgent,
      format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm'),
      log.ipAddress || '-',
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  };

  const downloadCSV = (content: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `activity-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const logs = logsData?.data || [];
  const totalPages = logsData?.pagination?.totalPages || 1;

  return (
    <div className="w-full space-y-4 p-4 ">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">System Activity Logs</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Monitor and track all system activities and user actions</p>
      </div>

      {/* Filters Component */}
      <ActivityLogsFilters
        onSearch={handleSearch}
        onDateRangeChange={handleDateRangeChange}
        onReset={handleReset}
        onRefresh={() => refetch()}
        onExport={handleExport}
        isLoading={isLoading}
        hasLogs={logs.length > 0}
        dateRange={dateRange}
      />

      {/* Table Component */}
      <ActivityLogsTable
        logs={logs}
        isLoading={isLoading}
        isError={isError}
        onRefresh={() => refetch()}
      />

      {/* Pagination Component */}
      {!isLoading && logs.length > 0 && (
        <ActivityLogsPagination
          page={filters.page}
          limit={filters.limit}
          total={logsData?.pagination?.total || 0}
          totalPages={totalPages}
          onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
          onLimitChange={(limit) => setFilters(prev => ({ ...prev, limit, page: 1 }))}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default SystemLogsMain;