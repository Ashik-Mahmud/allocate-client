import { ResourcesPanel } from "@/components/dashboard/resources";

export default function ResourcesManagementPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Resources Management
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Manage organization resources, availability, and booking rules.
        </p>
      </div>

      <ResourcesPanel />
    </div>
  );
}