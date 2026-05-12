"use client";

import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

import { useFetchAllUsers } from "@/features/system/hooks";
import { Button } from "@/components/ui/button";
import { AdminUserFilters } from "@/types/systemGlobal";
import { UsersFilters } from "./UsersFilters";
import { UsersTable } from "./UsersTable";
import { User } from "@/types";
import { toast } from "sonner";
import DialogPopup from "@/components/shared/dialog-popup";
import ViewUserDetail from "./ViewUserDetail";

const DEFAULT_FILTERS: AdminUserFilters = {
    page: 1,
    limit: 20,
    search: "",
    email: "",
    name: "",
    organizationId: "",
    role: undefined,
};

const UsersManagementMain = () => {
    const [draftFilters, setDraftFilters] = useState<AdminUserFilters>(DEFAULT_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState<AdminUserFilters>(DEFAULT_FILTERS);
    const [showFilters, setShowFilters] = useState(false);
    const [showUserDetail, setShowUserDetail] = useState<{ open: boolean; user?: User }>({ open: false });

    const { data: usersResponse, isLoading, isFetching } = useFetchAllUsers(appliedFilters);
    const users = (usersResponse as any)?.data || [];
    const pagination = (usersResponse as any)?.pagination || {};

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (draftFilters.search?.trim()) count++;
        if (draftFilters.name?.trim()) count++;
        if (draftFilters.email?.trim()) count++;
        if (draftFilters.organizationId?.trim()) count++;
        if (draftFilters.role) count++;
        return count;
    }, [draftFilters]);

    const isDirty = useMemo(() => {
        return JSON.stringify({ ...draftFilters, page: 1 }) !== JSON.stringify({ ...appliedFilters, page: 1 });
    }, [draftFilters, appliedFilters]);

    const handleFiltersChange = (newFilters: Partial<AdminUserFilters>) => {
        setDraftFilters((prev) => ({ ...prev, ...newFilters }));
    };

    const handleApplyFilters = () => {
        setAppliedFilters((prev) => ({
            ...prev,
            ...draftFilters,
            page: 1,
        }));
        toast.success("Filters applied");
    };

    const handleResetFilters = () => {
        setDraftFilters(DEFAULT_FILTERS);
        setAppliedFilters(DEFAULT_FILTERS);
        toast.success("Filters reset");
    };

    const handlePageChange = (direction: "prev" | "next") => {
        setAppliedFilters((prev) => ({
            ...prev,
            page: direction === "prev" ? Math.max(1, (prev.page ?? 1) - 1) : (prev.page ?? 1) + 1,
        }));
    };

    const handleUserAction = (action: string, user: User) => {
        switch (action) {
            case "view":
                setShowUserDetail({ open: true, user });
                break;
            case "reset-password":
                toast.success(`Password reset link sent to ${user.email}`);
                break;

            default:
                break;
        }
    };

    const currentPage = appliedFilters.page ?? 1;
    const currentLimit = appliedFilters.limit ?? 20;
    const total = pagination.total || 0;
    const from = users.length > 0 ? (currentPage - 1) * currentLimit + 1 : 0;
    const to = Math.min(currentPage * currentLimit, total);

    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/40">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Users Management</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Filter and manage platform users with role-based controls.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground dark:bg-slate-700/60">
                            {total} total users
                        </span>
                        <Button
                            variant="outline"
                            className="h-9"
                            onClick={() => setShowFilters((prev) => !prev)}
                        >
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            {showFilters ? "Hide Filters" : "Show Filters"}
                        </Button>
                    </div>
                </div>
            </div>

            {showFilters && (
                <UsersFilters
                    filters={draftFilters}
                    onFiltersChange={handleFiltersChange}
                    onApply={handleApplyFilters}
                    onReset={handleResetFilters}
                    activeFilterCount={activeFilterCount}
                    isApplying={isFetching && isDirty}
                />
            )}

            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/40">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="font-semibold text-foreground">{from}</span> to{" "}
                        <span className="font-semibold text-foreground">{to}</span> of{" "}
                        <span className="font-semibold text-foreground">{total}</span>
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange("prev")}
                            disabled={currentPage <= 1 || isLoading || isFetching}
                            className="h-9"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="min-w-16 text-center text-sm font-medium text-foreground">
                            Page {currentPage}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange("next")}
                            disabled={currentPage >= (pagination.totalPages || 1) || isLoading || isFetching}
                            className="h-9"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <UsersTable users={users} isLoading={isLoading} onAction={handleUserAction} />
            </div>
            <DialogPopup
                open={showUserDetail.open}
                onOpenChange={()=>{
                    setShowUserDetail({ open: false, user: undefined });
                }}
                size="xl"
            >
                <ViewUserDetail user={showUserDetail.user as User} // Just show the first user as an example, you can enhance this to show the selected user's details
                    
                />
            </DialogPopup>
        </div>
    );
};

export default UsersManagementMain;

