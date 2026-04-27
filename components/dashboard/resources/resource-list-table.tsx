"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Resource } from "@/types/resources";
import { MoreHorizontalIcon } from "lucide-react";
import ConfirmationAlert from "@/components/shared/confirmationAlert";

type Props = {
  items: Resource[];
  isLoading: boolean;
  onEdit: (resource: Resource) => void;
  onUpdateRules: (resource: Resource) => void;
  onToggleActive: (resource: Resource) => void;
  onDelete: (resource: Resource) => void;
  activeResourceId?: string | null;
};

/**
 * Hook to calculate dynamic table height based on available viewport space
 * Accounts for header, pagination, and other UI elements
 */
function useTableHeight(minHeight = 250, maxHeight = 400) {
  const [height, setHeight] = useState(maxHeight);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateHeight = () => {
      if (!containerRef.current) return;

      // Get container's position and available space
      const rect = containerRef.current.getBoundingClientRect();
      const availableHeight = window.innerHeight - rect.top - 80; // 80px for padding/footer/gaps

      // Constrain between min and max
      const calculatedHeight = Math.max(minHeight, Math.min(availableHeight, maxHeight));
      setHeight(calculatedHeight);
    };

    // Initial calculation
    calculateHeight();

    // Recalculate on window resize
    window.addEventListener("resize", calculateHeight);

    return () => {
      window.removeEventListener("resize", calculateHeight);
    };
  }, [minHeight, maxHeight]);

  return { height, containerRef };
}

export function ResourceListTable({
  items,
  isLoading,
  onEdit,
  onUpdateRules,
  onToggleActive,
  onDelete,
  activeResourceId,
}: Props) {
  const { height, containerRef } = useTableHeight(300, 330);

  if (isLoading) {
    return <p className="text-sm text-slate-600 dark:text-slate-400">Loading resources...</p>;
  }

  return (
    <div ref={containerRef} className="relative rounded-xl border border-transparent dark:border-slate-800 bg-white dark:bg-zinc-950">

      {/* Scrollable area with fixed height */}
      <div className="overflow-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800" style={{ maxHeight: `${height}px` }}>
        <Table className="w-full border-collapse">
          <TableHeader className="bg-slate-100 dark:bg-zinc-900">
            <TableRow className="hover:bg-transparent border-b dark:border-slate-800 sticky top-0 z-20">
              <TableHead className="sticky top-0 z-20 bg-slate-100 dark:bg-slate-900 dark:text-white">Name</TableHead>
              <TableHead className="sticky top-0 z-20 bg-slate-100 dark:bg-slate-900 dark:text-white">Type</TableHead>
              <TableHead className="sticky top-0 z-20 bg-slate-100 dark:bg-slate-900 dark:text-white">Rate</TableHead>
              <TableHead className="sticky top-0 z-20 bg-slate-100 dark:bg-slate-900 dark:text-white">Availability</TableHead>
              <TableHead className="sticky top-0 z-20 bg-slate-100 dark:bg-slate-900 dark:text-white">Under Maintenance</TableHead>
              <TableHead className="sticky top-0 z-20 bg-slate-100 dark:bg-slate-900 dark:text-white">Status</TableHead>
              <TableHead className="text-right sticky top-0 z-20 bg-slate-100 dark:bg-slate-900 dark:text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100 dark:divide-slate-800" >
            {items.map((resource) => (
              <TableRow
                key={resource.id}
                className={cn(
                  "transition-colors",
                  activeResourceId === resource.id
                    ? "bg-slate-100/50 dark:bg-slate-800"
                    : "hover:bg-slate-50/50 dark:hover:bg-slate-900/50 dark:bg-slate-900/50 "
                )}
              >
                <TableCell className="font-medium">{resource.name}</TableCell>
                <TableCell className="px-2 py-2 text-slate-700 dark:text-slate-300">{resource.type}</TableCell>
                <TableCell className="px-2 py-2 text-slate-700 dark:text-slate-300">{String(resource.hourly_rate)} Credit</TableCell>
                <TableCell className="px-2 py-2 text-slate-700 dark:text-slate-300">
                  {resource.is_available ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Available</span> : <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">Unavailable</span>}
                </TableCell>
                <TableCell className="px-2 py-2 text-slate-700 dark:text-slate-300">
                  {resource.is_maintenance ? <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Yes</span> : <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">No</span>}
                </TableCell>
                <TableCell className="px-2 py-2 text-slate-700 dark:text-slate-300">
                  {resource.is_active ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                      Inactive
                    </span>
                  )}
                </TableCell>
                <TableCell className="px-2 py-2 justify-end self-end text-right">

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 dark:text-white dark:bg-slate-800">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="dark:bg-slate-800">
                      <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(resource)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => onUpdateRules(resource)}>Update rules</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => onToggleActive(resource)}>
                        {resource.is_active ? "Disable" : "Enable"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="dark:bg-slate-600" />
                      <ConfirmationAlert title={`Delete ${resource.name}?`} description={`Are you sure you want to delete the resource "${resource.name}"? This action cannot be undone.`} onConfirm={() => {
                        onDelete(resource);
                      }} confirmButtonClassName="bg-red-500 hover:bg-red-600" >
                        <button className="cursor-pointer text-sm px-2 text-red-600" >Delete</button>
                      </ConfirmationAlert>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>

        {items.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
            No resources found for this filter.
          </p>
        ) : null}
      </div>
    </div>
  );
}
