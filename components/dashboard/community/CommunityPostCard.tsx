"use client"

import React, { useState } from 'react'
import {
    MoreVertical,
    Edit2,
    Trash2,
    RefreshCw,
    Eye,
    Lock,
    MessageSquare,
    CheckCircle,
    Calendar
} from 'lucide-react'
import { CommunityHub, CommunityHubStatus } from '@/types/community';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/lib/constants/routes';

// Adjust imports based on your actual types/enums file


type CardProps = {
    post: CommunityHub;
    onEdit: (post: CommunityHub) => void;
    onDelete: (id: string, permanent?: boolean) => void;
    onRestore?: (id: string) => void;
    onChangeStatus: (id: string, newStatus: CommunityHubStatus) => void;
}

export const CommunityPostCard = ({ post, onEdit, onDelete, onRestore, onChangeStatus }: CardProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isDeleted = !!post.deletedAt;

    // Format date simply
    const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="group relative bg-white dark:bg-slate-900 border border-neutral-100 dark:border-slate-800/60 rounded-xl p-5 transition-all duration-200 hover:shadow-sm flex flex-col md:flex-row gap-5">

            {/* Post Image Thumbnail (Optional) */}
            {post.imageUrl && (
                <div className="w-full md:w-32 h-32 md:h-24 rounded-lg overflow-hidden bg-neutral-50 dark:bg-neutral-950 shrink-0 border border-neutral-100 dark:border-neutral-800">
                    <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover grayscale-20 group-hover:grayscale-0 transition-all duration-300"
                    />
                </div>
            )}

            {/* Post Content Details */}
            <Link href={ROUTES.dashboardCommon.community + `/${post?.id}`} className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                    {/* Badges Line */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded">
                            {post.postType.replace('_', ' ')}
                        </span>

                        <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${post.status === 'PUBLISHED'
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                            : post.status === 'ARCHIVED'
                                ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                            }`}>
                            {post.status}
                        </span>

                        {post.isPrivate && (
                            <span className="flex items-center gap-1 text-[10px] font-medium bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded">
                                <Lock className="w-2.5 h-2.5" /> Private
                            </span>
                        )}
                        {
                            isDeleted && (
                                <span className="flex items-center gap-1 text-[10px] font-medium bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded">
                                    <Trash2 className="w-2.5 h-2.5" /> Deleted
                                </span>
                            )
                        }
                    </div>

                    {/* Heading Title */}
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight mb-1 truncate">
                        {post.title}
                    </h3>

                    {/* Body Content Snip */}
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 font-normal leading-relaxed mb-4"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    >

                    </p>
                </div>

                {/* Footer info: Metadata indicators */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-50 dark:border-neutral-800/40 text-xs text-neutral-400 dark:text-neutral-500">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formattedDate}</span>
                        </div>

                        {/* Target Audience preview string */}
                        <div className="flex items-center gap-1 text-[11px]">
                            <Eye className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600" />
                            <span>
                                {[
                                    post?.visibility.showToAdmin && 'Admin',
                                    post?.visibility.showToStaff && 'Staff',
                                    post?.visibility.showToOrgAdmin && 'Org Admin'
                                ].filter(Boolean).join(', ')}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />
                            {post?.comments?.length || 0}
                        </span>
                        <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> {post?.acknowledgments?.length || 0}</span>
                    </div>
                </div>
            </Link>

            {/* Floating Three-Dot Actions Menu */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-1.5 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>

                {isMenuOpen && (
                    <>
                        {/* Click-outside backdrop trap */}
                        <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />

                        <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-md py-1 z-20 font-sans animate-in fade-in slide-in-from-top-1 duration-100">

                            <button
                                onClick={() => { onEdit(post); setIsMenuOpen(false); }}
                                disabled={isDeleted}
                                className="w-full cursor-pointer flex items-center gap-2 px-3 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left transition-colors disabled:pointer-events-none disabled:opacity-40 "
                            >
                                <Edit2 className="w-3.5 h-3.5" /> Edit Post
                            </button>

                            {/* Status toggles */}
                            {post.status !== CommunityHubStatus.PUBLISHED && (
                                <button
                                    disabled={post?.isPrivate || isDeleted}
                                    onClick={() => { onChangeStatus(post.id, CommunityHubStatus.PUBLISHED); setIsMenuOpen(false); }}
                                    className="w-full cursor-pointer flex items-center disabled:pointer-events-none disabled:opacity-40 gap-2 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left transition-colors"
                                >
                                    <CheckCircle className="w-3.5 h-3.5" /> Make Published {post?.isPrivate && <sup>(Private)</sup>}
                                </button>
                            )}

                            {post.status !== CommunityHubStatus.DRAFT && (
                                <button
                                    disabled={post?.isPrivate || isDeleted}
                                    onClick={() => { onChangeStatus(post.id, CommunityHubStatus.DRAFT); setIsMenuOpen(false); }}
                                    className="w-full cursor-pointer flex items-center disabled:pointer-events-none disabled:opacity-40 gap-2 px-3 py-2 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left transition-colors"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" /> Revert to Draft {post?.isPrivate && <sup>(Private)</sup>}
                                </button>
                            )}

                            <hr className="my-1 border-neutral-100 dark:border-neutral-800" />

                            {isDeleted ? (
                                <>
                                    <button
                                        onClick={() => { onRestore?.(post.id); setIsMenuOpen(false); }}
                                        className="w-full flex cursor-pointer items-center gap-2 px-3 py-2 text-xs text-sky-600 dark:text-sky-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left transition-colors"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" /> Restore Post
                                    </button>
                                    <button
                                        onClick={() => { onDelete?.(post.id, true); setIsMenuOpen(false); }}
                                        className="w-full flex cursor-pointer items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-800 text-left transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Permanent delete post
                                    </button></>

                            ) : (
                                <button
                                    onClick={() => { onDelete(post.id); setIsMenuOpen(false); }}
                                    className="w-full flex cursor-pointer items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-left transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete Post
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}