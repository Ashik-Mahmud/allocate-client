"use client";

import { Button } from "@/components/ui/button";

export type ResourcePaginationProps = {
  page: number;
  totalPages: number;
  total?: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function ResourcePagination({
  page,
  totalPages,
  total,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
}: ResourcePaginationProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
      <span>
        Page {page} of {totalPages} {typeof total === "number" ? `(${total} total)` : ""}
      </span>
      <div className="flex items-center gap-2">
        <Button type="button" size="sm" variant="outline" disabled={!hasPrevious} onClick={onPrevious}>
          Previous
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={!hasNext} onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
