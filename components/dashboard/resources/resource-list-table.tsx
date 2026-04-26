"use client";

import { Button } from "@/components/ui/button";
import type { Resource } from "@/types/resources";

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
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <th className="px-2 py-1">Name</th>
            <th className="px-2 py-1">Type</th>
            <th className="px-2 py-1">Rate</th>
            <th className="px-2 py-1">Status</th>
            <th className="px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((resource) => (
            <tr
              key={resource.id}
              className={
                activeResourceId === resource.id
                  ? "rounded-xl bg-slate-100 ring-1 ring-slate-300 dark:bg-slate-800/70 dark:ring-slate-700"
                  : "rounded-xl bg-slate-50/90 dark:bg-slate-900/70"
              }
            >
              <td className="px-2 py-2 font-medium text-slate-900 dark:text-slate-100">{resource.name}</td>
              <td className="px-2 py-2 text-slate-700 dark:text-slate-300">{resource.type}</td>
              <td className="px-2 py-2 text-slate-700 dark:text-slate-300">{String(resource.hourly_rate)}</td>
              <td className="px-2 py-2 text-slate-700 dark:text-slate-300">
                {resource.is_active ? "Active" : "Inactive"} / {resource.is_available ? "Available" : "Unavailable"}
              </td>
              <td className="px-2 py-2">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(resource)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onUpdateRules(resource)}>
                    Update rules
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onToggleActive(resource)}>
                    {resource.is_active ? "Disable" : "Enable"}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(resource)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {items.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
          No resources found for this filter.
        </p>
      ) : null}
    </div>
  );
}
