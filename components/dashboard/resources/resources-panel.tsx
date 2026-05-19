"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useCreateResourceMutation,
  useDeleteResourceMutation,
  useResourcesListQuery,
  useResourceUnderMaintenanceMutation,
  useUpdateResourceMutation,
  useUpdateResourceRulesMutation,
} from "@/features/resources";
import type {
  CreateResourcePayload,
  Resource,
  ResourceListFilters,
  ResourceType,
  UpdateResourcePayload,
} from "@/types/resources";

import { ResourceCreateForm } from "@/components/dashboard/resources/resource-create-form";
import { ResourceErrorState } from "@/components/dashboard/resources/resource-error-state";
import { ResourceFilterForm } from "@/components/dashboard/resources/resource-filter-form";
import { ResourceListTable } from "@/components/dashboard/resources/resource-list-table";
import { ResourcePagination } from "@/components/dashboard/resources/resource-pagination";
import { ResourceRulesForm } from "@/components/dashboard/resources/resource-rules-form";
import { toast } from "sonner";
import ConfirmationAlert from "@/components/shared/confirmationAlert";
import DialogPopup from "@/components/shared/dialog-popup";
import AllocateDrawer from "@/components/shared/allocate-drawer";
import MarkAsUnderMaintenace from "./markAsMaintenance";

export function ResourcesPanel() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"" | ResourceType>("");
  const [isActive, setIsActive] = useState<"" | "true" | "false">("");
  const [isMaintenance, setIsMaintenance] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [selectedResourceName, setSelectedResourceName] = useState<string>("");

  // open mark as maintenance confirmation when toggling maintenance mode on a resource
  const [maintenanceConfirmationOpen, setMaintenanceConfirmationOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [search, type, isActive, isMaintenance, limit]);

  const filters = useMemo<ResourceListFilters>(
    () => ({
      page,
      limit,
      search: search || undefined,
      type: type || undefined,
      is_active: isActive === "" ? undefined : isActive === "true" ? 'true' : 'false',
      is_maintenance: isMaintenance === "" ? undefined : isMaintenance === "true" ? 'true' : 'false',
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    [isActive, isMaintenance, limit, page, search, type]
  );

  const resourcesQuery = useResourcesListQuery(filters);
  const createMutation = useCreateResourceMutation();
  const updateMutation = useUpdateResourceMutation();
  const deleteMutation = useDeleteResourceMutation();
  const rulesMutation = useUpdateResourceRulesMutation();
  const maintenanceMutation = useResourceUnderMaintenanceMutation();

  const items = resourcesQuery.data?.data ?? [];
  const meta = resourcesQuery.data?.pagination
  const total = meta?.total ?? items.length;
  const currentPage = meta?.page ?? page;
  const totalPages = Math.max(meta?.totalPages ?? 1, 1);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const handleUnderMaintenance = async (resourceId: string) => {
    const result = await maintenanceMutation.mutateAsync({ resourceId });
    if (result.data?.is_maintenance) {
      toast.success(`Resource "${result.data.name}" is now under maintenance.`);
    } else {
      toast.success(`Resource "${result?.data?.name}" is now operational.`);
    }
    if (result?.success) {
      setMaintenanceConfirmationOpen(false);
      setSelectedResource(null);
    }
  }


  return (
    <section className="space-y-4">
      <ResourceFilterForm
        search={search}
        type={type}
        isActive={isActive}
        limit={limit}
        onSearchChange={setSearch}
        onTypeChange={setType}
        onActivityChange={setIsActive}
        onLimitChange={setLimit}
        onCreate={() => setCreateOpen(true)}
        isMaintenance={isMaintenance}
        onMaintenanceChange={setIsMaintenance}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="hidden">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Resources</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage resources, edit details, and update booking rules.
            </p>
          </div>
          {resourcesQuery.isFetching ? (
            <span className="text-xs text-slate-500 dark:text-slate-400">Refreshing...</span>
          ) : null}
        </div>

        {resourcesQuery?.isError ? (
          <ResourceErrorState
            message={resourcesQuery.error instanceof Error ? resourcesQuery.error.message : "Could not load resources."}
          />
        ) : (
          <ResourceListTable
            items={Array.isArray(items) ? items.flat() : items ?? []}
            isLoading={resourcesQuery.isLoading}
            activeResourceId={selectedResource?.id ?? selectedResourceId}
            onEdit={(resource) => {
              setSelectedResource(resource);
              setEditOpen(true);
            }}
            onUpdateRules={(resource) => {
              setSelectedResourceId(resource.id);
              setSelectedResourceName(resource.name);
              setSelectedResource(resource);
              setRulesOpen(true);
            }}
            onToggleActive={(resource) =>
              updateMutation.mutate({
                resourceId: resource.id,
                payload: { is_active: !resource.is_active },
              })
            }
            onDelete={(resource) => {
              deleteMutation.mutate(resource.id);
              toast.success(`Resource "${resource.name}" has been deleted.`);
            }}
            onMarkAsMaintenance={(resource) => {
              setMaintenanceConfirmationOpen(true)
              setSelectedResource(resource)
            }}
          />
        )}

        <div className="mt-4">
          <ResourcePagination
            page={currentPage}
            totalPages={totalPages}
            total={total}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            onPrevious={() => setPage((prev) => Math.max(prev - 1, 1))}
            onNext={() => setPage((prev) => prev + 1)}
          />
        </div>
      </div>

      <DialogPopup
        open={createOpen}
        title="Create organization resource"
        description="Fill resource details and save it as a reusable booking asset."
        onOpenChange={setCreateOpen}
        size="lg"
      >
        <ResourceCreateForm
          onSubmit={async (payload: CreateResourcePayload) => {
            await createMutation.mutateAsync(payload);
          }}
          isSubmitting={createMutation.isPending}
          onSuccess={() => setCreateOpen(false)}
          className="space-y-4 mt-5"
          mode="create"
        />
      </DialogPopup>

      <DialogPopup
        open={editOpen}
        title="Edit organization resource"
        description="Fill resource details and save it as a reusable booking asset."
        onOpenChange={(open) => {
          setEditOpen(open);

          if (!open) {
            setSelectedResource(null);
          }
        }}
        size="lg"
      >
        {selectedResource ? (
          <ResourceCreateForm
            initialValues={selectedResource}
            mode="edit"
            submitLabel="Save changes"
            onSubmit={async (payload: CreateResourcePayload) => {
              const updatePayload: UpdateResourcePayload = {
                ...payload,
              };

              await updateMutation.mutateAsync({
                resourceId: selectedResource.id,
                payload: updatePayload,
              });
            }}
            isSubmitting={updateMutation.isPending}
            onSuccess={() => setEditOpen(false)}
            className="space-y-4"
          />
        ) : null}
      </DialogPopup>

      <DialogPopup
        open={rulesOpen}
        onOpenChange={(open) => {
          setRulesOpen(open);

          if (!open) {
            setSelectedResourceId(null);
            setSelectedResourceName("");
          }
        }}
        title="Update booking rules"
        description={
          selectedResourceName
            ? `Adjust booking constraints for ${selectedResourceName}.`
            : "Adjust booking constraints for this resource."
        }
        size="lg"
      >
        {selectedResourceId ? (
          <ResourceRulesForm
            resourceId={selectedResourceId}
            onSubmit={async (resourceId, payload) => {
              await rulesMutation.mutateAsync({ resourceId, payload });
            }}
            isSubmitting={rulesMutation.isPending}
            onSuccess={() => setRulesOpen(false)}
            className="space-y-4"
            defaultValues={selectedResource?.resourcesRules}
          />
        ) : null}
      </DialogPopup>

      <AllocateDrawer
        open={maintenanceConfirmationOpen}
        onOpenChange={setMaintenanceConfirmationOpen}
        title={selectedResource?.is_maintenance ? `Mark ${selectedResource.name} as operational?` : `Mark as under maintenance?`}
        description={selectedResource?.is_maintenance ? `Are you sure you want to mark ${selectedResource.name} as operational? This will make the resource available for bookings again.` : `Are you sure you want to mark ${selectedResource?.name} as under maintenance? `}
        footer={<div>
          {/* Bottom Action */}
          <div className="flex flex-col gap-3 pt-4  border-slate-100 dark:border-slate-800 sticky bottom-0">
            <p className="text-[11px] text-center text-slate-500">
              By clicking below, you confirm that {selectedResource?.organization?.name} admin handles are authorized to override these schedules.
            </p>
            <button
              onClick={() => {

                handleUnderMaintenance(selectedResource?.id as string);
              }}
              className="w-full cursor-pointer py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-lg hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white transition-all duration-200 shadow-lg"
              disabled={!selectedResource || maintenanceMutation.isPending}
            >
              {
                maintenanceMutation.isPending ?
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div> : selectedResource?.is_maintenance ? "Confirm & Mark as Operational" : "Confirm & Mark Under Maintenance"
              }


            </button>
            <button className="w-full py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
              onClick={() => {
                setMaintenanceConfirmationOpen(false);
                setSelectedResource(null);
              }
              }

            >
              Cancel
            </button>
          </div>
        </div>}
        position="bottom"
        showHandler={false}
      >
        <MarkAsUnderMaintenace
          resourceId={selectedResource?.id}
          onSuccess={() => setMaintenanceConfirmationOpen(false)}
        />
      </AllocateDrawer>

    </section>
  );
}
