"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAcknowledgeCommunityPostMutation, useAddCommentToCommunityPostMutation, useCommunityPostQuery, useDeleteCommentFromCommunityPostMutation } from '@/features/community';
import { CommunityHub, CommentStructure } from '@/types/community';
import {
    ArrowLeft,
    Clock3,
    Lock,
    MessageSquare,
    ShieldCheck,
    ShieldX,
    Sparkles,
    CornerDownRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import CommentSection from './CommentSection';
import { useCurrentUser } from '@/features/auth';
import { useRefineNote } from '@/hooks/use-refine-note';
import { PlanType } from '@/types/organization';
import { Role } from '@/types';

type Props = {
    postId: string;
};

// Placeholder logged-in user context


const CommunityPostDetail = ({ postId }: Props) => {
    const { user } = useCurrentUser();
    const router = useRouter();
    const { data, isLoading } = useCommunityPostQuery(postId);
    const acknowledgeMutation = useAcknowledgeCommunityPostMutation();
    const { refineNote, isLoading: isRefineNoteLoading } = useRefineNote(user?.organization?.plan_type !== PlanType.FREE)
    const addCommentMutation = useAddCommentToCommunityPostMutation(postId);
    const deleteCommentMutation = useDeleteCommentFromCommunityPostMutation();
    const [commentText, setCommentText] = useState('');

    // Extract the inner payload safely
    const post: CommunityHub | undefined = data?.data;

    if (isLoading) {
        return (
            <div className="w-full space-y-6 p-4 animate-pulse">
                <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
                    <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-7 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="space-y-2 pt-4">
                        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl mx-auto">
                <p className="text-sm text-slate-400 dark:text-slate-500">Post not found or has been deleted.</p>
                <button onClick={() => router.back()} className="mt-4 text-xs font-medium text-blue-500 hover:underline">
                    Go Back
                </button>
            </div>
        );
    }

    // Handle cross-checking primitive strings vs complex acknowledgment objects safely
    const isAcknowledged = post.acknowledgments?.some((ack: any) => {
        if (typeof ack === 'string') return ack === user?.id;
        return ack?.userId === user?.id;
    }) ?? false;

    const handleAcknowledgeToggle = async () => {
        try {
            await acknowledgeMutation.mutateAsync(post.id);
            // Optionally show a success message or update local state to reflect the acknowledgment
        } catch (error) {
            console.error("Failed to acknowledge the post:", error);
            // Optionally show an error message to the user
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        // Trigger comment mutation action here
        console.log("Submitting comment:", commentText);
        setCommentText('');

        try {
            await addCommentMutation.mutateAsync(commentText);
            // Optionally show a success message or update local state to reflect the new comment
        } catch (error) {
            console.error("Failed to add comment:", error);
            // Optionally show an error message to the user
        }
    };

    // on delete comment handler
    const handleDeleteComment = async (commentId: string) => {
        try {
            const confirm = window.confirm("Are you sure you want to delete this comment? This action cannot be undone.");
            if (!confirm) return;
            await deleteCommentMutation.mutateAsync(commentId);
        } catch (error) {
            console.error("Failed to delete comment:", error);
            // Optionally show an error message to the user
        }
    }

    const handleRefineWithAI = async () => {
        if (!commentText.trim()) return;
        // Call AI text adjustment layer
        const instructions = `Refine the following comment for clarity, professionalism, and conciseness while preserving the original intent. Avoid changing the meaning or adding new information. Return only the refined comment text without any additional commentary. Comment: "${commentText}"`;
        const refined = await refineNote(instructions);
        if (refined) {
            setCommentText(refined);
        } else {                 // Fallback to original text if refinement fails
            setCommentText(prev => prev);
        }
    };

    const authorInitials = post.authorName
        ? post.authorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'U';

    return (
        <div className="w-full  space-y-6 p-4 text-neutral-900 dark:text-neutral-100 font-sans">

            {/* Dynamic Back Navigation Anchor */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group cursor-pointer"
            >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                BACK TO REQUESTS
            </button>

            {/* Main Container Card Block */}
            <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 space-y-5">

                    {/* Metadata Badges Array Header */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                            #{post.id.substring(3, 10).toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {post.postType.replace('_', ' ')}
                        </span>
                        {post.isPrivate && (
                            <span className="flex items-center gap-1 text-[10px] font-medium bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded">
                                <Lock className="w-2.5 h-2.5" /> Private Scope
                            </span>
                        )}
                    </div>

                    {/* Title Text Content */}
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        {post.title}
                    </h1>

                    {/* User Author Matrix Element Block */}
                    <div className="flex items-center justify-between border-y border-slate-100 dark:border-slate-800/60 py-3 text-xs">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center font-bold text-[10px] text-white">
                                {authorInitials}
                            </div>
                            <div>
                                <div className="font-semibold text-slate-800 dark:text-slate-200"> {post?.authorRole === Role.ADMIN ? 'System Admin' : post.authorName}</div>
                                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{post.authorRole}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 font-medium">
                            <Clock3 className="w-3.5 h-3.5" />
                            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                        </div>
                    </div>

                    {/* Optional Image Enclosure Render */}
                    {post.imageUrl && (
                        <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 mt-4">
                            <img
                                src={post.imageUrl}
                                alt="Post attachment asset"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    )}
                    {/* Body Content Prose Text Layer */}
                    <div
                        className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 wrap-break-word line-clamp-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-pre:bg-slate-50 dark:prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-200 dark:prose-pre:border-slate-800"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />



                    {/* Interaction Acknowledgements Button Toolbar Row */}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/40">
                        <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                            <ShieldCheck className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                            <span>{post.acknowledgments?.length || 0} Acknowledgements verified</span>
                        </div>

                        <button
                            onClick={handleAcknowledgeToggle}
                            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 select-none cursor-pointer border ${isAcknowledged
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/60 shadow-sm"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:bg-slate-800/60 dark:hover:text-slate-300"
                                }`}
                        >
                            {isAcknowledged ? (
                                <>
                                    <ShieldX className="w-3.5 h-3.5 stroke-[2.5]" />
                                    <span>Unacknowledge</span>
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-3.5 h-3.5 stroke-2" />
                                    <span>Acknowledge Request</span>
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </article>

            {/* Discussion Dynamic Comment Render Block Component area */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Discussion Thread ({post.comments?.length || 0})
                </h3>

                {/* Dynamic Inner Component Render Passing Structured Array List */}
                <CommentSection comments={post?.comments || []} currentUserId={user?.id!} onDeleteComment={handleDeleteComment} />

                {/* Dynamic New Textarea Form Input Segment Block */}
                <form onSubmit={handleAddComment} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
                    <div className="relative">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a message response inside the community workspace thread..."
                            rows={3}
                            className="w-full text-sm bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-700 resize-none text-slate-800 dark:text-slate-200"
                        />

                        {/* Inline AI Action Button */}
                        {commentText.trim() && (
                            <button
                                type="button"
                                onClick={handleRefineWithAI}
                                disabled={true || isRefineNoteLoading || !commentText.trim() || user?.organization?.plan_type === PlanType.FREE}
                                className="absolute right-2.5 bottom-3 text-[11px] font-medium flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors shadow-sm cursor-pointer group disabled:opacity-40 disabled:hover:bg-slate-900/0 disabled:hover:text-slate-500 disabled:cursor-not-allowed"
                            >
                                <Sparkles className="w-3 h-3 text-amber-500 group-hover:animate-pulse" />
                                {
                                    isRefineNoteLoading ? "Refining..." : "Refine with AI"
                                }
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <CornerDownRight className="w-3.5 h-3.5 text-slate-300" />
                            <span>Replying as <strong className="font-semibold text-slate-600 dark:text-slate-400">{user?.name}</strong></span>
                        </div>

                        <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="px-4 py-1.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 transition-all text-xs cursor-pointer shadow-sm shadow-blue-500/10"
                        >
                            Post Comment
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default CommunityPostDetail;