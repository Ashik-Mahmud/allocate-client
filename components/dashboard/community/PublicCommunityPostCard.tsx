"use client";
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils/cn';
import { Role } from '@/types';
import { CommunityHub } from '@/types/community';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import {
    ShieldCheck,
    ArrowRight,
    Eye,
    MessageSquare,
    Clock3,
    ShieldAlert,
    ShieldX,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from '@/lib/navigation';
type Props = {
    post: CommunityHub;
    handleAcknowledge: (post: CommunityHub) => void;
    userId?: string | null;

}

const PublicCommunityPostCard = ({ post, handleAcknowledge, userId }: Props) => {
       const router = useRouter();
    const initials = post.authorName ? post.authorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
    return (
        <div>
            <div
                key={post.id}
                className={cn(
                    // Base styles for all cards
                    "group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl transition-all duration-200",

                    // Normal post hover state
                    "hover:border-blue-500/40 dark:hover:border-blue-500/30",

                    // Clean, premium Admin overrides using native Tailwind priority syntax
                    post?.authorRole === Role.ADMIN
                        ? "border-rose-500/40! dark:border-rose-500/30! bg-rose-50/20! dark:bg-rose-950/10! shadow-[0_0_15px_-3px_rgba(244,63,94,0.05)]! hover:border-rose-500/60! dark:hover:border-rose-500/50!"
                        : ""
                )}
            >
                {/* Top accent gradient bar explicitly for system broadcasts */}
                {post?.authorRole === Role.ADMIN && (
                    <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-linear-to-r from-rose-500 to-pink-500 opacity-80 dark:opacity-60" />
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                                #{post.id.substring(3, 10).toUpperCase()}
                            </span>

                            {/* PostType Badge */}
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {post.postType.replace('_', ' ')}
                            </span>

                            {/* Status Indicator Badges */}
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${post.status === 'PUBLISHED'
                                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                                : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'
                                }`}>
                                {post.status}
                            </span>

                            {/* Privacy locks status indicator */}
                            {post.isPrivate && (
                                <span className="flex items-center gap-1 text-[10px] font-medium bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded">
                                    <Lock className="w-2.5 h-2.5" /> Private
                                </span>
                            )}
                            {userId === post.authorId && (
                                <span className="flex items-center gap-1 text-[10px] font-medium bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">
                                    <Eye className="w-2.5 h-2.5" /> Your Post
                                </span>
                            )}
                        </div>

                        {/* Post Title - transitions to accent colors depending on ownership/role on hover */}
                        <h3 className={cn(
                            "font-bold text-base leading-tight cursor-pointer text-slate-900 dark:text-slate-50 tracking-tight transition-colors",
                            post?.authorRole === Role.ADMIN
                                ? "group-hover:text-rose-600 dark:group-hover:text-rose-400"
                                : "group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        )}
                            onClick={() => {
                                router.push(ROUTES.dashboardCommon.community + `/${post?.id}`)
                            }}
                        >
                            {post.title}
                        </h3>
                        <p
                            className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed pt-0.5"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>

                    {/* Dynamic Icon Indicator Badge Element changes colors contextually */}
                    <div className={cn(
                        "h-9 w-9 rounded-full flex items-center justify-center border shrink-0 transition-colors",
                        post?.authorRole === Role.ADMIN
                            ? "bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/50"
                            : "bg-slate-50 dark:bg-slate-800/80 border-slate-100 dark:border-slate-700/60"
                    )}>
                        {post?.authorRole === Role.ADMIN ? (
                            <ShieldAlert className="w-4.5 h-4.5 text-rose-500 dark:text-rose-400" />
                        ) : (
                            <ShieldCheck className="w-4.5 h-4.5 text-blue-500 dark:text-blue-400" />
                        )}
                    </div>
                </div>

                {/* Card Item Metadata Row Footer */}
                <div className="flex flex-wrap items-center justify-between text-xs pt-3 border-t border-slate-50 dark:border-slate-800/40 gap-y-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {/* User Profile Avatar Initials */}
                        <div className={cn(
                            "w-6 h-6 rounded-full border border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-semibold text-white select-none",
                            post?.authorRole === Role.ADMIN ? "bg-rose-500" : "bg-indigo-500"
                        )}>
                            {initials}
                        </div>

                        <span className={cn(
                            "font-medium",
                            post?.authorRole === Role.ADMIN
                                ? "text-rose-600 dark:text-rose-400 font-semibold"
                                : "text-slate-500 dark:text-slate-400"
                        )}>
                            {post?.authorRole === Role.ADMIN ? 'System Admin' : post.authorName}
                        </span>

                        <span className="h-3 w-0.5 bg-slate-200 dark:bg-slate-800 rounded-full hidden sm:inline-block"></span>

                        {/* Time Counter Label */}
                        <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium flex items-center gap-1">
                            <Clock3 className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </span>

                        <span className="h-3 w-0.5 bg-slate-200 dark:bg-slate-800 rounded-full"></span>

                        {/* Dynamic Acknowledge / Verification Badge Count */}
                        <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium flex items-center gap-1.5" title="Acknowledgements">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-400/80 dark:text-blue-500/80" /> Acknowledgement:
                            <span>{post?.acknowledgments?.length || 0}</span>
                        </span>

                        <span className="h-3 w-0.5 bg-slate-200 dark:bg-slate-800 rounded-full"></span>

                        {/* Dynamic Comment Tracker Counter */}
                        <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium flex items-center gap-1.5" title="Comments">
                            <MessageSquare className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            <span>{post?.comments?.length || 0}</span>
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {/* Acknowledgement Button */}
                        <button
                            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md transition-all duration-200 select-none cursor-pointer border ${post?.acknowledgments?.includes(userId as any)
                                ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/60 shadow-sm"
                                : "bg-emerald-50 text-emerald-600 border-emerald-200/60 hover:bg-emerald-100 hover:text-emerald-700 dark:bg-emerald-900/40 dark:text-slate-400 dark:border-slate-800/80 dark:hover:bg-slate-800/60 dark:hover:text-slate-300"
                                }`}
                            onClick={() => handleAcknowledge(post)}
                        >
                            {post?.acknowledgments?.includes(userId as any) ? (
                                <>
                                    <ShieldX className="w-3.5 h-3.5 stroke-[2.5]" />
                                    <span>Unacknowledge Post</span>
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-3.5 h-3.5 stroke-2" />
                                    <span>Acknowledge Post</span>
                                </>
                            )}
                        </button>
                        <Link
                            href={ROUTES.dashboardCommon.community + `/${post?.id}`}
                            className={cn(
                                "text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 transition-colors cursor-pointer select-none ml-auto sm:ml-0",
                                post?.authorRole === Role.ADMIN
                                    ? "group-hover:text-rose-500 dark:group-hover:text-rose-400"
                                    : "group-hover:text-slate-600 dark:group-hover:text-slate-300"
                            )}
                        >
                            View Details <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PublicCommunityPostCard