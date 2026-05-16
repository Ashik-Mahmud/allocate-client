"use client"
import DialogPopup from '@/components/shared/dialog-popup';
import { History, Plus } from 'lucide-react';
import React from 'react'
import { PostCommunityInnerForm } from './PostCommunityForm';
import { PostCommunityFormData } from '@/types/community';
import { usePostCommunityMutation } from '@/features/community';
import { toast } from 'sonner';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/lib/constants/routes';
import { usePathname } from 'next/navigation';

type Props = {}

const CommunityHeader = (props: Props) => {

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const communtionMutation = usePostCommunityMutation();
    const path = usePathname();

    const isOnMyPostsPage = path?.includes(ROUTES.dashboardCommon.myPosts);

    // on submit handler for the form
    const onHandleSubmit = async (data: PostCommunityFormData) => {
        try {
            const result = await communtionMutation.mutateAsync(data);
            if (result?.success) {
                toast.success("Community post created successfully!");
                setIsDialogOpen(false);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to create community post.");
        }
    }

    return (
        <>
            <div>
                {/* Header section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Community Support</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            View and manage your community posts, track their status, and get help from our team.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {
                            isOnMyPostsPage ? (
                                <Link href={ROUTES.dashboardCommon.community} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                                    <History className="w-4 h-4" />
                                    View All Posts
                                </Link>
                            ) : <Link href={ROUTES.dashboardCommon.myPosts} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                                <History className="w-4 h-4" />
                                View My Requests
                            </Link>
                        }

                        <button
                            onClick={() => setIsDialogOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all shadow-blue-500/20">
                            <Plus className="w-4 h-4" />
                            New Post
                        </button>
                    </div>
                </header>


            </div>
            <DialogPopup
                open={isDialogOpen}
                onOpenChange={() => setIsDialogOpen(false)}
                title="Create New Community Post"
                className="max-w-lg"
                footer={null}
            >
                <PostCommunityInnerForm
                    isSubmitting={communtionMutation.isPending}
                    onCancel={() => setIsDialogOpen(false)}

                    onSubmit={onHandleSubmit}
                />
            </DialogPopup>
        </>
    )
}

export default CommunityHeader