"use client"
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CommunityPostFilter } from '@/types/community';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react'

type Props = {
    filters: CommunityPostFilter;
    updateFilterField: (key: keyof CommunityPostFilter, value: any) => void;
    totalPages: number;
}

const CommunityPagination = ({ filters, updateFilterField, totalPages }: Props) => {
    return (
        <div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 font-sans text-xs text-neutral-500 dark:text-neutral-400">

                {/* Limit / Size select field item controls */}
                <div className="flex items-center gap-2">
                    <span>Show rows per page</span>
                    <Select
                        value={String(filters.limit || 10)}
                        onValueChange={(val) => updateFilterField('limit', Number(val))}
                    >
                        <SelectTrigger className="w-16 h-8 text-xs border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 min-w-16">
                            {[5, 10, 20, 50].map(size => (
                                <SelectItem key={size} value={String(size)} className="text-xs cursor-pointer">
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Pagination Navigation Page Toggle Triggers */}
                <div className="flex items-center gap-4">
                    <span>
                        Page <strong>{filters.page}</strong> of <strong>{totalPages}</strong>
                    </span>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateFilterField('page', (filters.page || 1) - 1)}
                            disabled={filters.page === 1}
                            className="w-8 h-8 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 disabled:opacity-40"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateFilterField('page', (filters.page || 1) + 1)}
                            disabled={filters.page === totalPages}
                            className="w-8 h-8 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 disabled:opacity-40"
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommunityPagination