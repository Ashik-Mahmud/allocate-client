"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Building2, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useFetchOrganizations, useRestoreOrganizationMutation, useUpdateOrganizationMutation } from "@/features/system/hooks";
import { Organizations } from "@/types/organization";
import { OrganizationListFilters } from "@/types/systemGlobal";
import OrganizationsFilters from "./OrganizationsFilters";
import OrganizationsTable from "./OrganizationsTable";
import DialogPopup from "@/components/shared/dialog-popup";
import OrganizationDetail from "./OrganizationDetail";
import AllocateConfirmationAlert from "@/components/shared/TriggerConfirmation";
import { set } from "date-fns";
import ExtendTrialForm from "./ExtendTrialForm";
import ViewSubscription from "./ViewSubscription";
import DeleteOrganizationDialog from "./DeleteOrganizationDialog";
import AllocateDrawer from "@/components/shared/allocate-drawer";
import ManualTopUp from "../creditTransactions/ManualTopUp";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

const defaultFilters: OrganizationListFilters = {
    organizationId: "",
    name: "",
    verified: undefined,
    page: 1,
    is_active: undefined,
    search: "",
    planType: "all",
    showDeletedOrg: false,
    limit: 10,

};

export type OrgTableActionTypes = "toggle-verify" | "toggle-active" | 'copy-id' | "view" | 'delete' | 'restore' | 'trial' | 'edit' | 'top-up-credits' | 'need-update' | 'extend-trial' | 'view-subscription' | null;

const OrganizationMain = () => {
    const [appliedFilters, setAppliedFilters] = useState<OrganizationListFilters>(defaultFilters);
    const [draftFilters, setDraftFilters] = useState<OrganizationListFilters>(defaultFilters);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<Organizations | null>(null);
    const [isConfirmingAction, setIsConfirmingAction] = useState(false);
    const [actionType, setActionType] = useState<OrgTableActionTypes>(null);
    const [isOpenExtendTrial, setIsOpenExtendTrial] = useState(false);
    const [isOpenSubscription, setIsOpenSubscription] = useState(false);
    const [isOpenDeleteOrg, setIsOpenDeleteOrg] = useState(false);
    const [isOpenManualTopup, setIsOpenManualTopup] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
   


    const { data, isLoading, isFetching, refetch } = useFetchOrganizations(appliedFilters);
    const updateOrgMutation = useUpdateOrganizationMutation();
    const restoreMutation = useRestoreOrganizationMutation();

    const organizations = useMemo(() => data?.data ?? [], [data?.data]);
    const pagination = data?.pagination;

    const handleFilterChange = (patch: Partial<OrganizationListFilters>) => {
        setDraftFilters((prev) => ({ ...prev, ...patch }));
    };

    const handleApplyFilters = () => {

        setAppliedFilters(draftFilters);
    };

    const handleResetFilters = () => {
        setDraftFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
    };

    const handlePageChange = (nextPage: number) => {
        const page = Math.max(1, nextPage);
        setDraftFilters((prev) => ({ ...prev, page }));
        setAppliedFilters((prev) => ({ ...prev, page }));
    };

    const handleLimitChange = (limit: number) => {
        const next = { ...appliedFilters, limit, page: 1 };
        setDraftFilters(next);
        setAppliedFilters(next);
    };

    const handleAction = async (
        action: OrgTableActionTypes,
        org: Organizations,
    ) => {
        setActionType(action);
        if (action === "copy-id") {
            try {
                await navigator.clipboard.writeText(org.id);
                toast.success("Organization ID copied");
            } catch {
                toast.error("Failed to copy ID");
            }
            return;
        }

        if (action === "view") {
            setSelectedOrg(org);
            setIsDetailsOpen(true);
            return;
        }

        if (action === "toggle-verify") {
            setIsConfirmingAction(true);
            setSelectedOrg(org);
            return;
        }
        if (action === "toggle-active") {
            setIsConfirmingAction(true);
            setSelectedOrg(org);
            return;
        }
        if (action === 'trial') {
            setSelectedOrg(org);
            setIsConfirmingAction(true);
            return;
        }
        if (action === 'need-update') {
            setSelectedOrg(org);
            setIsConfirmingAction(true);
            return;
        }
        if (action === 'extend-trial') {
            setSelectedOrg(org);
            setIsOpenExtendTrial(true);
            return;
        }
        if (action === 'edit') {
            setSelectedOrg(org);
            setIsDetailsOpen(true);
            return;
        }
        if (action === 'top-up-credits') {
            setSelectedOrg(org);
            setIsOpenManualTopup(true);
            return;
        }
        if (action === 'delete') {
            setIsOpenDeleteOrg(true);
            setSelectedOrg(org);
            return;
        }
        if (action === 'restore') {
            setIsConfirmingAction(true);
            setSelectedOrg(org);
            return;
        }
        if (action === 'view-subscription') {
            setSelectedOrg(org);
            setIsOpenSubscription(true);
            return;
        }

    };


    // Handle verification toggle with confirmation
    const handleToggleVerify = async () => {
        try {
            const result = await updateOrgMutation.mutateAsync({
                id: selectedOrg?.id ?? "",
                updateOrganization: {
                    isVerified: !selectedOrg?.isVerified
                }
            });
            if (result.success) {
                toast.success("Verification status updated");
                setIsConfirmingAction(false);
                setSelectedOrg(null)
                setActionType(null);
                refetch();
            }

        } catch (error) {
            toast.error("Failed to update verification status");
        }
    };

    // Handle activation toggle with confirmation
    const handleToggleActive = async () => {
        try {
            const result = await updateOrgMutation.mutateAsync({
                id: selectedOrg?.id ?? "",
                updateOrganization: {
                    is_active: !selectedOrg?.is_active
                }
            });
            if (result.success) {
                toast.success("Activation status updated");
                setIsConfirmingAction(false);
                setSelectedOrg(null)
                setActionType(null);
                refetch();
            }

        } catch (error) {
            toast.error("Failed to update activation status");
        }

    };

    // Allow trial or not
    const handleAllowTrial = async () => {
        try {
            const result = await updateOrgMutation.mutateAsync({
                id: selectedOrg?.id ?? "",
                updateOrganization: {
                    isTrialAllowed: !selectedOrg?.isTrialAllowed
                }
            });
            if (result.success) {
                toast.success("Trial status updated");
                setIsConfirmingAction(false);
                setSelectedOrg(null)
                setActionType(null);
                refetch();
            }

        } catch (error) {
            toast.error("Failed to update trial status");
        }
    };

    // Allow org to edit company info
    const handleNeedUpdateOrg = async () => {
        try {
            const result = await updateOrgMutation.mutateAsync({
                id: selectedOrg?.id ?? "",
                updateOrganization: {
                    needUpdateOrg: !selectedOrg?.needUpdateOrg
                }
            });
            if (result.success) {
                toast.success("Update status updated");
                setIsConfirmingAction(false);
                setSelectedOrg(null)
                setActionType(null);
                refetch();
            }

        } catch (error) {
            toast.error("Failed to update update status");
        }

    }


    // Handle trial extension confirmation
    const handleConfirmExtendTrial = async (extensionDays: Date) => {
        if (!selectedOrg?.id) {
            toast.error("No organization selected");
            return;
        }

        try {
            const newTrialEnd = new Date(extensionDays);
            if (newTrialEnd < new Date()) {
                toast.error("Cannot extend trial to a past date");
                return;
            }

            const result = await updateOrgMutation.mutateAsync({
                id: selectedOrg.id,
                updateOrganization: {
                    trialEndsAt: newTrialEnd.toISOString(),
                    isTrialAllowed: true,
                    hasUsedTrial: false,
                    needUpdateOrg: false
                }
            });
            if (
                result?.success
            ) {
                toast.success(`Trial extended by ${extensionDays.getDate()} days`);
                setIsOpenExtendTrial(false);
                setSelectedOrg(null);
                setActionType(null);
                refetch();
            }


        } catch (error: any) {
            toast.error(error?.message || "Failed to extend trial");
            console.error("Trial Extension Error:", error);
        }
    };

    // Handle restore organization
    const handleRestoreOrganization = async () => {
        try {
            const result = await restoreMutation.mutateAsync(selectedOrg?.id ?? "");
            if (result.success) {
                toast.success("Organization restored", {
                    description: "The organization has been successfully restored and is now active.",
                });
                setIsConfirmingAction(false);
                setSelectedOrg(null)
                setActionType(null);
                refetch();
            }

        } catch (error) {
            toast.error("Failed to restore organization");
        }
    }


    const total = pagination?.total ?? organizations.length;
    const totalPages = pagination?.totalPages ?? 1;
    const currentPage = pagination?.page ?? appliedFilters.page ?? 1;
    const activeFiltersCount = [
        appliedFilters.organizationId,
        appliedFilters.name,
        appliedFilters.search,
        appliedFilters.verified !== undefined ? String(appliedFilters.verified) : "",
    ].filter(Boolean).length;

    useEffect(() => {
        const is_active = searchParams.get("is_active");
        if(is_active !== null){
            const activeValue = is_active === "true" ? true : is_active === "false" ? false : undefined;
            const next = { ...defaultFilters, is_active: activeValue };
            setIsFiltersOpen(true);
            setDraftFilters(next);
            setAppliedFilters(next);
            router.replace(ROUTES.dashboardAdmin.organizations, { scroll: false });
        }
    }, [searchParams])
    return (
        <div className="space-y-4">
            <section className="rounded-2xl border border-border bg-card dark:bg-slate-900 dark:border-slate-800 p-5 shadow-sm transition-colors">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary dark:text-white">
                            <Building2 className="size-3.5" />
                            System Admin
                        </div>
                        <h1 className="text-xl font-semibold text-foreground dark:text-white">Organizations</h1>
                        <p className="text-sm text-muted-foreground dark:text-white/50">Manage organizations, monitor status, and run quick admin actions.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
                            <RefreshCw className="size-4" />
                            Refresh
                        </Button>
                        <div className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground dark:text-white">
                            Total: <span className="font-semibold">{total}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-border bg-card dark:bg-slate-800 dark:border-slate-700 p-3 shadow-sm transition-colors">
                <button
                    type="button"
                    onClick={() => setIsFiltersOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-muted dark:hover:bg-slate-600/30"
                    aria-expanded={isFiltersOpen}
                    aria-controls="organizations-filters-panel"
                >
                    <div>
                        <p className="text-sm font-semibold text-foreground dark:text-white">Filters</p>
                        <p className="text-xs text-muted-foreground dark:text-white/50">
                            {activeFiltersCount > 0
                                ? `${activeFiltersCount} active filter${activeFiltersCount > 1 ? "s" : ""}`
                                : "No active filters"}
                        </p>
                    </div>
                    <div className="text-muted-foreground">
                        {isFiltersOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </div>
                </button>

                {isFiltersOpen ? (
                    <div id="organizations-filters-panel" className="mt-3">
                        <OrganizationsFilters
                            filters={draftFilters}
                            onChange={handleFilterChange}
                            onApply={handleApplyFilters}
                            onReset={handleResetFilters}
                            isFetching={isFetching}
                        />
                    </div>
                ) : null}
            </section>

            <OrganizationsTable organizations={organizations} isLoading={isLoading} onAction={handleAction} />

            <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card dark:bg-slate-900 dark:border-slate-800 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    Page <span className="font-semibold text-foreground dark:text-white">{currentPage}</span> of <span className="font-semibold text-foreground dark:text-white">{totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground">Rows</label>
                    <select
                        value={appliedFilters.limit ?? 10}
                        onChange={(e) => handleLimitChange(Number(e.target.value))}
                        className="h-8 rounded-lg border border-input bg-background px-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:scheme-dark"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>

                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={currentPage <= 1 || isFetching}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        Previous
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        disabled={currentPage >= totalPages || isFetching}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next
                    </Button>
                </div>
            </section>
            <DialogPopup
                title="Organization Details"
                description="Detailed information about the organization and management actions."
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                size="full"
            >
                <OrganizationDetail id={selectedOrg?.id ?? ""} />
            </DialogPopup>
            <AllocateConfirmationAlert open={isConfirmingAction} onOpenChange={setIsConfirmingAction}
                title="Confirm for this action?"
                description="Are you sure you want to perform this action? This cannot be undone."
                onConfirm={() => {
                    if (actionType === "toggle-verify") {
                        handleToggleVerify();
                    } else if (actionType === "toggle-active") {
                        handleToggleActive();
                    } else if (actionType === 'trial') {
                        // For trial extension, you might want to implement a separate handler or pass additional data
                        // For demonstration, let's just call handleToggleActive as a placeholder
                        handleAllowTrial();
                    } else if (actionType === 'need-update') {
                        handleNeedUpdateOrg();
                    } else if (actionType === 'restore') {
                        handleRestoreOrganization();
                    }
                }}
            />
            <DialogPopup
                title="Extend Trial"
                description="Select a new trial end date to extend the organization's trial period."
                open={isOpenExtendTrial}
                onOpenChange={setIsOpenExtendTrial}
                size="full"
            >
                {selectedOrg && <ExtendTrialForm selectedOrg={selectedOrg} onConfirm={handleConfirmExtendTrial} />}
            </DialogPopup>

            <DialogPopup
                title="Organization Subscription"
                description="View and manage the organization's subscription details."
                open={isOpenSubscription}
                onOpenChange={setIsOpenSubscription}
                size="lg"

            >
                {selectedOrg?.id && <ViewSubscription id={selectedOrg?.id ?? ""} />}
            </DialogPopup>


            <DialogPopup
                title=""
                description=""
                open={isOpenDeleteOrg}
                onOpenChange={setIsOpenDeleteOrg}
                size="md"

            >
                <DeleteOrganizationDialog
                    id={selectedOrg?.id ?? ""}
                    orgName={selectedOrg?.name ?? ""}
                    onClose={() => {
                        setIsOpenDeleteOrg(false);
                        setSelectedOrg(null);
                        setActionType(null);
                    }}
                    onSuccess={() => {
                        setIsOpenDeleteOrg(false);
                        setSelectedOrg(null);
                        setActionType(null);
                        refetch();
                    }}
                />
            </DialogPopup>

            <AllocateDrawer
                open={isOpenManualTopup}
                onOpenChange={setIsOpenManualTopup}
                title="Top up Credits"
                position="right"
                showHeader={false}

            >
                <ManualTopUp
                    orgId={selectedOrg?.id}
                    onSuccess={() => {
                        setIsOpenManualTopup(false);
                        refetch();
                    }} />
            </AllocateDrawer>





        </div>
    );
};

export default OrganizationMain;