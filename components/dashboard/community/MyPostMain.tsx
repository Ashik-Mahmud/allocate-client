"use client"

import React from 'react'
import { useDeleteCommunityMutation, useMyCommunityPostsQuery, useRestoreCommunityMutation, useUpdateCommunityMutation } from '@/features/community';
import { CommunityHub, CommunityHubPostType, CommunityHubStatus, CommunityPostFilter, PostCommunityFormData } from '@/types/community';
import { CommunityPostCard } from './CommunityPostCard';
import { Filter, ChevronLeft, ChevronRight, Search, RotateCcw } from 'lucide-react';
import AllocatePopover from '@/components/shared/allocate-popover';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AllocateConfirmationAlert from '@/components/shared/TriggerConfirmation';
import DialogPopup from '@/components/shared/dialog-popup';
import { PostCommunityInnerForm } from './PostCommunityForm';


type Props = {}

const defaultFilter: CommunityPostFilter = {
    postType: undefined,
    status: undefined,
    isPrivate: null,
    search: undefined,
    page: 1,
    limit: 10,
    authorId: undefined,
}

const MyPostMain = (props: Props) => {
    const [filter, setFilter] = React.useState<CommunityPostFilter>(defaultFilter);
    const { data, isLoading } = useMyCommunityPostsQuery(filter);
    const updateCommunityMutation = useUpdateCommunityMutation();
    const deleteCommunityMutation = useDeleteCommunityMutation();
    const restoreCommunityMutation = useRestoreCommunityMutation(); // Reuse update mutation for restore action since it’s a status change

    const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);
    const [selectedPostId, setSelectedPostId] = React.useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedPostData, setSelectedPostData] = React.useState<CommunityHub | null>(null);

    const posts: CommunityHub[] = data?.data || [];
    // Fallback pagination data safely handled if backend returns meta descriptors
    const totalCount = data?.pagination?.total || posts.length;
    const totalPages = Math.ceil(totalCount / (filter.limit || 10)) || 1;

    const handleEdit = async (post: Partial<CommunityHub>) => {

        try {
            const updatedData: PostCommunityFormData = {
                title: post.title || '',
                content: post.content || '',
                imageUrl: post.imageUrl || '',
                visibility: post.visibility || { showToAdmin: true, showToStaff: true, showToOrgAdmin: true },
                isPrivate: post.isPrivate || false,
                postType: post.postType || CommunityHubPostType.OTHER,
                status: post.status || CommunityHubStatus.DRAFT,
            };
            const result = await updateCommunityMutation.mutateAsync({ postId: selectedPostData?.id!, data: updatedData });
            if (result?.success) {
                toast.success("Post updated successfully!");
                setSelectedPostData(null);
                setIsDialogOpen(false);
            }
        } catch (error) {
            console.error("Failed to update post for ID:", selectedPostData?.id, error);
            toast.error("Failed to update post.");
        }

    };

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteCommunityMutation.mutateAsync(id);
            if (result?.success) {
                toast.success("Post deleted successfully!");
            }
        } catch (error) {
            console.error("Failed to delete post for ID:", id, error);
            toast.error("Failed to delete post.");
        }
    };

    const handleRestore = async (id: string) => {
        try {
            const result = await restoreCommunityMutation.mutateAsync(id);
            if (result?.success) {
                toast.success("Post restored successfully!");
            }
        } catch (error) {
            console.error("Failed to restore post for ID:", id, error);
            toast.error("Failed to restore post.");
        }
    };

    const handleChangeStatus = async (id: string, newStatus: CommunityHubStatus) => {
        try {
            const result = await updateCommunityMutation.mutateAsync({ postId: id, data: { status: newStatus } as PostCommunityFormData });
            if (result?.success) {
                toast.success(`Status updated to ${newStatus.toLowerCase()} successfully!`);
            }
        } catch (error) {
            console.error("Failed to update status for ID:", id, error);
            toast.error("Failed to update status.");
        }
    };

    // State utility updates resets current view back to page 1 to protect boundary queries
    const updateFilterField = (key: keyof CommunityPostFilter, value: any) => {
        setFilter(prev => ({
            ...prev,
            [key]: value === 'ALL' || value === '' ? undefined : value,
            page: key === 'page' ? value : 1 // Reset page if other filter metrics change
        }));
    };

    const resetFilters = () => {
        setFilter(defaultFilter);
    };

    return (
        <div className="w-full mx-auto space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                        My Community Posts
                    </h1>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Manage and check publication visibility rules for your articles.
                    </p>
                </div>

                {/* Global Toolbar Filters */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-60">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400 pointer-events-none" />
                        <Input
                            placeholder="Search posts..."
                            value={filter.search || ''}
                            onChange={(e) => updateFilterField('search', e.target.value)}
                            className="pl-9 h-9 text-sm border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus-visible:ring-neutral-400"
                        />
                    </div>

                    <AllocatePopover
                        trigger={
                            <button className="flex items-center gap-1.5 h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-neutral-700 dark:text-neutral-300">
                                <Filter className="w-4 h-4 text-neutral-400" />
                                <span>Filter</span>
                            </button>
                        }
                        align="end"
                    >
                        {/* Popover Filter Body Content */}
                        <div className="space-y-4 font-sans bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
                            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Advanced Filter</span>
                                <button
                                    onClick={resetFilters}
                                    className="text-[11px] flex items-center gap-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                                >
                                    <RotateCcw className="w-3 h-3" /> Reset
                                </button>
                            </div>

                            {/* Filter: Post Type Selector */}
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-medium text-neutral-500">Post Type</Label>
                                <Select
                                    value={filter.postType || 'ALL'}
                                    onValueChange={(val) => updateFilterField('postType', val)}
                                >
                                    <SelectTrigger className="h-8! w-full! text-xs border-neutral-200 dark:border-neutral-800">
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800">
                                        <SelectItem value="ALL" className="text-xs">All Types</SelectItem>
                                        {Object.values(CommunityHubPostType).map(type => (
                                            <SelectItem key={type} value={type} className="text-xs capitalize">
                                                {type.replace('_', ' ').toLowerCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Filter: Status Selector */}
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-medium text-neutral-500">Status</Label>
                                <Select
                                    value={filter.status || 'ALL'}
                                    onValueChange={(val) => updateFilterField('status', val)}
                                >
                                    <SelectTrigger className="h-8! w-full! text-xs border-neutral-200 dark:border-neutral-800">
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800">
                                        <SelectItem value="ALL" className="text-xs">All Status</SelectItem>
                                        {Object.values(CommunityHubStatus).map(status => (
                                            <SelectItem key={status} value={status} className="text-xs capitalize">
                                                {status.toLowerCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Filter: Privacy Options Selection */}
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-medium text-neutral-500">Privacy Scope</Label>
                                <Select
                                    value={filter.isPrivate === null ? 'ALL' : String(filter.isPrivate)}
                                    onValueChange={(val) => updateFilterField('isPrivate', val === 'ALL' ? null : val === 'true')}
                                >
                                    <SelectTrigger className="h-8! w-full! text-xs border-neutral-200 dark:border-neutral-800">
                                        <SelectValue placeholder="All Access" />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800">
                                        <SelectItem value="ALL" className="text-xs">All Access</SelectItem>
                                        <SelectItem value="true" className="text-xs">Private Only</SelectItem>
                                        <SelectItem value="false" className="text-xs">Public Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </AllocatePopover>
                </div>
            </div>

            {/* Conditional List Rendering */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="w-full h-32 bg-neutral-100 dark:bg-neutral-900/40 border border-neutral-50 dark:border-neutral-800/65 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                    <p className="text-sm text-neutral-400 dark:text-neutral-500">No posts found matching criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {posts.map((post) => (
                        <CommunityPostCard
                            key={post.id}
                            post={post}
                            onEdit={(data) => {
                                setSelectedPostData(post);
                                setIsDialogOpen(true);
                            }}
                            onDelete={(id: string) => {
                                setSelectedPostId(id);
                                setIsConfirmationOpen(true);
                            }}
                            onRestore={handleRestore}
                            onChangeStatus={handleChangeStatus}
                        />
                    ))}
                </div>
            )}

            {/* Pagination Container Controls */}
            {posts.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 font-sans text-xs text-neutral-500 dark:text-neutral-400">

                    {/* Limit / Size select field item controls */}
                    <div className="flex items-center gap-2">
                        <span>Show rows per page</span>
                        <Select
                            value={String(filter.limit || 10)}
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
                            Page <strong>{filter.page}</strong> of <strong>{totalPages}</strong>
                        </span>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateFilterField('page', (filter.page || 1) - 1)}
                                disabled={filter.page === 1}
                                className="w-8 h-8 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 disabled:opacity-40"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateFilterField('page', (filter.page || 1) + 1)}
                                disabled={filter.page === totalPages}
                                className="w-8 h-8 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 disabled:opacity-40"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            <AllocateConfirmationAlert
                title="Confirm Action"
                description="You are about to perform an important action. Are you sure you want to proceed?"
                onOpenChange={setIsConfirmationOpen}
                open={isConfirmationOpen}
                cancelText="Cancel"
                confirmText="Confirm"
                onConfirm={() => {
                    selectedPostId && handleDelete(selectedPostId)
                }}
            />
            <DialogPopup
                open={isDialogOpen}
                onOpenChange={() => setIsDialogOpen(false)}
                title={selectedPostData ? "Edit Community Post" : "Create New Community Post"}
                size="full"
                footer={null}
            >
                <PostCommunityInnerForm
                    key={selectedPostData ? selectedPostData.id : 'create-new-mode'}
                    isSubmitting={updateCommunityMutation.isPending}
                    onCancel={() => setIsDialogOpen(false)}
                    isEdit={!!selectedPostData}
                    initialData={selectedPostData || undefined}
                    onSubmit={handleEdit}
                />
            </DialogPopup>
        </div>
    )
}

export default MyPostMain