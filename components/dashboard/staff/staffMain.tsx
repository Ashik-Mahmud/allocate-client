"use client"

import React, { useState } from 'react'
import { useCreateStaffByOrgAdminMutation, useDeleteStaffMutation, useGetStaffsQuery, useUpdateStaffDetailsMutation } from '@/features/staff'

import { Button } from '@/components/ui/button'
import { Search, ChevronLeft, ChevronRight, Loader2, Plus } from 'lucide-react'
import { useDebounce } from '@/hooks'
import StaffUserCard from './staffUserCard'
import { Input } from '@/components/ui/input'
import DialogPopup from '@/components/shared/dialog-popup'
import StaffManagementForm from './staff-manage-form'
import { StaffDetails, StaffManagementFormValues } from '@/types/staff'
import { toast } from 'sonner'
import AllocateConfirmationAlert from '@/components/shared/TriggerConfirmation'
import { is } from 'zod/v4/locales'

export interface StaffListFilters {
    page?: number;
    limit?: number;
    search?: string;
    email?: string;
}

const StaffMain = () => {
    // 1. Local State for Filters
    const [filters, setFilters] = useState<StaffListFilters>({
        page: 1,
        limit: 6,
        search: '',
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffDetails | null>(null); // Replace 'any' with your staff type

    // 2. Debounce Search to avoid excessive API calls
    const debouncedSearch = useDebounce(filters.search, 500);

    // 3. Fetch Data with dynamic filters
    const { data, isLoading, isFetching } = useGetStaffsQuery({
        ...filters,
        search: debouncedSearch,
    });

    const createStaff = useCreateStaffByOrgAdminMutation();
    const updateStaff = useUpdateStaffDetailsMutation();
    const deleteStaff = useDeleteStaffMutation()
    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };


    // 4. Handle Form Submission (for Add/Edit)
    const handleOnSubmit = async (values: StaffManagementFormValues) => {
        // Implement your add/edit logic here
        const response = await createStaff.mutateAsync(values)
        if (response?.success) {
            toast.success("Staff member added successfully!")
            setIsDialogOpen(false);
        }
    };

    // 5. Handle Edit Submission
    const handleOnEditSubmit = async (values: StaffManagementFormValues) => {
        if (!selectedStaff?.id) return;
        const changedFields: Partial<StaffManagementFormValues> = {};
        if (values.name !== selectedStaff.name) changedFields.name = values.name;
        if (values.email !== selectedStaff.email) changedFields.email = values.email;
        if (values.photo !== selectedStaff.photo) changedFields.photo = values.photo;
        if (values.password) changedFields.password = values.password; // Only include password if it's provided

        const response = await updateStaff.mutateAsync({ staffId: selectedStaff.id, payload: changedFields })
        if (response?.success) {
            toast.success("Staff member updated successfully!")
            setIsDialogOpen(false);
            setSelectedStaff(null);
        }
    };
    // 6. Handle Delete Confirmation
    const handleDeleteConfirm = async () => {
        // Implement your delete logic here, using selectedStaff state to identify which staff to delete
        if (selectedStaff) {
            const result = await deleteStaff.mutateAsync(selectedStaff?.id || '');
            if (result?.success) {
                setIsConfirmationOpen(false);
                toast.success("Staff member deleted successfully!")
                setSelectedStaff(null);
            }
        }
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="title-section flex items-center justify-between flex-wrap gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                        Staff Management
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Assign and manage organization members and their access levels.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsDialogOpen(true)}
                        className="rounded-lg bg-primary/90 px-4 py-2 text-sm font-semibold text-white hover:bg-primary flex items-center gap-1 cursor-pointer">
                        <Plus className="size-4 mr-1" />
                        Add Staff
                    </button>
                </div>
            </div>


            <div className="staff-management-section space-y-6 flex flex-col flex-1">
                {/* Filter Section */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Search by name or email..."
                            className="pl-10 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                        />
                    </div>
                    {isFetching && <Loader2 className="size-4 animate-spin text-slate-400" />}
                </div>

                {/* Staff Grid */}
                <div className="staff-list  h-[58dvh] overflow-y-auto ">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse dark:bg-slate-900" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data?.data?.map((staff: StaffDetails) => (
                                <StaffUserCard
                                    key={staff.id} user={staff}
                                    onEdit={() => {
                                        setSelectedStaff(staff);
                                        setIsDialogOpen(true);
                                    }}

                                    onDelete={() => {
                                        // Handle delete logic here, possibly with a confirmation dialog
                                        setSelectedStaff(staff);
                                        setIsConfirmationOpen(true);
                                    }}



                                />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && data?.data?.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-2xl">
                            <p className="text-slate-500">No staff members found.</p>
                        </div>
                    )}
                </div>

                {/* Pagination Footer */}
                {data?.pagination && data.pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between border-t pt-4 dark:border-zinc-800 mt-auto">
                        <p className="text-xs text-slate-500">
                            Showing page {data.pagination.page} of {data.pagination.totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={filters.page === 1}
                                onClick={() => handlePageChange(filters.page! - 1)}
                            >
                                <ChevronLeft className="size-4 mr-1" /> Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={filters.page === data.pagination.totalPages}
                                onClick={() => handlePageChange(filters.page! + 1)}
                            >
                                Next <ChevronRight className="size-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            {/* Dialog Popup for adding/editing staff */}
            <DialogPopup
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                title={selectedStaff?.id ? "Edit Staff" : "Add Staff"}
                description={selectedStaff?.id ? "Fill in the details to edit this staff member." : "Fill in the details to add a new staff member."}
            >
                <StaffManagementForm
                    onSubmit={
                        selectedStaff?.id ? handleOnEditSubmit : handleOnSubmit
                    }
                    isLoading={createStaff.isPending || updateStaff.isPending}
                    errorMessage={createStaff.isError || updateStaff.isError ? createStaff?.error?.message || updateStaff?.error?.message : ''}
                    initialData={selectedStaff || undefined}
                    isEdit={!!selectedStaff?.id}
                />
            </DialogPopup>
            {/* Confirmation Dialog for deleting staff */}
            <AllocateConfirmationAlert
                open={isConfirmationOpen}
                title="Delete Staff Member"
                description={`Are you sure you want to delete ${selectedStaff?.name}? This action cannot be undone.`}
                variant='destructive'
                errorMessage={deleteStaff.isError ? deleteStaff?.error?.message : ''}
                onOpenChange={() => {
                    setIsConfirmationOpen(false);
                    setTimeout(() => setSelectedStaff(null), 300); // Clear selected staff after closing the dialog
                }}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    )
}

export default StaffMain