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

export function ResourcesPanel() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"" | ResourceType>("");
  const [isAvailable, setIsAvailable] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [selectedResourceName, setSelectedResourceName] = useState<string>("");

  useEffect(() => {
    setPage(1);
  }, [search, type, isAvailable, limit]);

  const filters = useMemo<ResourceListFilters>(
    () => ({
      page,
      limit,
      search: search || undefined,
      type: type || undefined,
      is_available: isAvailable === "" ? undefined : isAvailable === "true",
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    [isAvailable, limit, page, search, type]
  );

  const resourcesQuery = useResourcesListQuery(filters);
  const createMutation = useCreateResourceMutation();
  const updateMutation = useUpdateResourceMutation();
  const deleteMutation = useDeleteResourceMutation();
  const rulesMutation = useUpdateResourceRulesMutation();

  const items = resourcesQuery.data?.data ?? [];
  const meta = (resourcesQuery.data as { meta?: { total?: number; page?: number; totalPages?: number } } | undefined)
    ?.meta;
  const total = meta?.total ?? items.length;
  const currentPage = meta?.page ?? page;
  const totalPages = Math.max(meta?.totalPages ?? 1, 1);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const createDialogTrigger = (
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Create resource</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create organization resource</DialogTitle>
          <DialogDescription>
            Fill resource details and save it as a reusable booking asset.
          </DialogDescription>
        </DialogHeader>

        <ResourceCreateForm
          onSubmit={async (payload: CreateResourcePayload) => {
            await createMutation.mutateAsync(payload);
          }}
          isSubmitting={createMutation.isPending}
          onSuccess={() => setCreateOpen(false)}
          className="space-y-4 mt-5"
          mode="create"
        />
      </DialogContent>
    </Dialog>
  );

  return (
    <section className="space-y-4">
      <ResourceFilterForm
        search={search}
        type={type}
        isAvailable={isAvailable}
        limit={limit}
        onSearchChange={setSearch}
        onTypeChange={setType}
        onAvailabilityChange={setIsAvailable}
        onLimitChange={setLimit}
        actions={createDialogTrigger}
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
            items={items}
            isLoading={resourcesQuery.isLoading}
            activeResourceId={selectedResource?.id ?? selectedResourceId}
            onEdit={(resource) => {
              setSelectedResource(resource);
              setEditOpen(true);
            }}
            onUpdateRules={(resource) => {
              setSelectedResourceId(resource.id);
              setSelectedResourceName(resource.name);
              setRulesOpen(true);
            }}
            onToggleActive={(resource) =>
              updateMutation.mutate({
                resourceId: resource.id,
                payload: { is_active: !resource.is_active },
              })
            }
            onDelete={(resource) => deleteMutation.mutate(resource.id)}
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

      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);

          if (!open) {
            setSelectedResource(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader className="mb-4">
            <DialogTitle>Edit resource</DialogTitle>
            <DialogDescription>
              {selectedResource ? `Update details for ${selectedResource.name}.` : "Update resource details."}
            </DialogDescription>
          </DialogHeader>

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
        </DialogContent>
      </Dialog>

      <Dialog
        open={rulesOpen}
        onOpenChange={(open) => {
          setRulesOpen(open);

          if (!open) {
            setSelectedResourceId(null);
            setSelectedResourceName("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update booking rules</DialogTitle>
            <DialogDescription>
              {selectedResourceName
                ? `Adjust booking constraints for ${selectedResourceName}.`
                : "Adjust booking constraints for this resource."}
            </DialogDescription>
          </DialogHeader>

          {selectedResourceId ? (
            <ResourceRulesForm
              resourceId={selectedResourceId}
              onSubmit={async (resourceId, payload) => {
                await rulesMutation.mutateAsync({ resourceId, payload });
              }}
              isSubmitting={rulesMutation.isPending}
              onSuccess={() => setRulesOpen(false)}
              className="space-y-4"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
