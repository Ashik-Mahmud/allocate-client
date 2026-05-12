"use client";

import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ActivityLogsPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading?: boolean;
}

export const ActivityLogsPagination = ({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  isLoading = false,
}: ActivityLogsPaginationProps) => {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-slate-600 dark:text-slate-400">
        Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{start}</span> to{' '}
        <span className="font-semibold text-slate-900 dark:text-slate-100">{end}</span> of{' '}
        <span className="font-semibold text-slate-900 dark:text-slate-100">{total}</span> logs
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        {/* Page Navigation */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1 || isLoading}
            variant="outline"
            className="h-9 gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          {/* Page Numbers */}
          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  disabled={isLoading}
                  variant={page === pageNum ? 'default' : 'outline'}
                  className={cn(
                    'h-9 w-9 p-0',
                    page === pageNum
                      ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900 disabled:opacity-50'
                  )}
                >
                  {pageNum}
                </Button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="flex items-center px-1 text-slate-400">...</span>
                <Button
                  onClick={() => onPageChange(totalPages)}
                  disabled={page === totalPages || isLoading}
                  variant="outline"
                  className="h-9 w-9 p-0 border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900 disabled:opacity-50"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || isLoading}
            variant="outline"
            className="h-9 gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Rows Per Page */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
            Rows per page:
          </label>
          <Select
            value={String(limit)}
            onValueChange={(value) => onLimitChange(parseInt(value))}
            disabled={isLoading}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Select>
        </div>
      </div>
    </div>
  );
};
