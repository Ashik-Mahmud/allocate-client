"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Resource } from "@/types/resources";
import { MoreHorizontalIcon } from "lucide-react";

type Props = {
  items: Resource[];
  isLoading: boolean;
  onEdit: (resource: Resource) => void;
  onUpdateRules: (resource: Resource) => void;
  onToggleActive: (resource: Resource) => void;
  onDelete: (resource: Resource) => void;
  activeResourceId?: string | null;
};

export function ResourceListTable({
  items,
  isLoading,
  onEdit,
  onUpdateRules,
  onToggleActive,
  onDelete,
  activeResourceId,
}: Props) {
  if (isLoading) {
    return <p className="text-sm text-slate-600 dark:text-slate-400">Loading resources...</p>;
  }

  return (
    <div className="relative rounded-xl border border-transparent dark:border-slate-800 bg-white dark:bg-zinc-950">

      {/* 2. Scrollable area with a max-height (e.g., h-[500px] or h-[calc(100vh-300px)]) */}
      <div className="h-83 overflow-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        <Table className="relative w-full">
          <TableHeader className="sticky top-0 z-10 bg-slate-100 dark:bg-zinc-950 shadow-sm">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Under Maintenance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right sticky top-0">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100 dark:divide-slate-800" >
            {items.map((resource) => (
              <TableRow
                key={resource.id}
                className={cn(
                  "transition-colors",
                  activeResourceId === resource.id
                    ? "bg-slate-100/50 dark:bg-slate-800/50"
                    : "hover:bg-slate-50/50 dark:hover:bg-slate-900/50"
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
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(resource)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateRules(resource)}>Update rules</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleActive(resource)}>
                        {resource.is_active ? "Disable" : "Enable"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        Delete
                      </DropdownMenuItem>
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
