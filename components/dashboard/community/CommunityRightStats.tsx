"use client";

import React from 'react';
import { useCommunityOverviewQuery } from '@/features/community';
import { Hammer, Award, MessageSquare, Flame, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/lib/constants/routes';

interface Author {
    id: string;
    name: string;
    photo: string | null;
    role: string;
    postCount: number;
}

interface CommunityPost {
    id: string;
    title: string;
    postType: string;
    status: string;
    createdAt: string;
    acknowledgments: string[] | null;
    comments: any[];
    authorName: string;
    authorRole: string;
}

const CommunityRightStats = () => {
    const { data, isLoading } = useCommunityOverviewQuery();


    const authors: Author[] = data?.data?.authors || [];
    const acknowledgedPosts: CommunityPost[] = data?.data?.acknowledgedPosts || [];

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-30 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                <div className="h-56 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                <div className="h-56 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
           
            {/* 1. System Status Card (More Minimal & Refined) */}
            <div className="bg-linear-to-br from-slate-900 via-indigo-950 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-2xl p-5 border border-slate-800 shadow-xs text-white">
                <div className="flex items-center gap-2.5 mb-3">
                    <Hammer className="w-4 h-4 text-indigo-400 opacity-90" />
                    <h3 className="font-semibold text-sm tracking-tight text-slate-100">System Status</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Most services are operational. <span className="text-indigo-300 font-medium">Manager DM</span> is undergoing maintenance.
                </p>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>API Gateway Response</span>
                        <span className="font-mono text-indigo-400 font-medium">99.2%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full w-[99.2%] rounded-full" />
                    </div>
                </div>
            </div>

            {/* 2. Top Contributors Card */}
            {authors.length > 0 && (
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-xs">
                    <div className="flex items-center gap-2 mb-4">
                        <Award className="w-4 h-4 text-amber-500" />
                        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">Top Contributors</h3>
                    </div>
                    <div className="space-y-3.5">
                        {authors.map((author, i) => (
                            <div key={author.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    {author.photo ? (
                                        <img
                                            src={author.photo}
                                            alt={author.name}
                                            className="w-8 h-8 rounded-lg object-cover grayscale-25 dark:border dark:border-slate-800"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-100 dark:border-indigo-900/30">
                                            {getInitials(author.name)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                                            {author.name}
                                        </p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 capitalize">
                                            {author.role.toLowerCase().replace('_', ' ')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] font-medium font-mono text-slate-600 dark:text-slate-400">
                                        {author.postCount} {author.postCount === 1 ? 'post' : 'posts'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. Most Acknowledged / Trending Posts Card */}
            {acknowledgedPosts.length > 0 && (
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-xs">
                    <div className="flex items-center gap-2 mb-4">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">Trending Updates</h3>
                    </div>
                    <div className="space-y-4">
                        {acknowledgedPosts.map((post) => {
                            const ackCount = post.acknowledgments?.length || 0;
                            const commentCount = post.comments?.length || 0;

                            return (
                                <Link href={ROUTES.dashboardCommon.community + `/${post?.id}`} key={post.id} className="space-y-1.5 block cursor-pointer group">
                                    <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-snug line-clamp-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                                        {post.title}
                                    </h4>
                                    <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                        <div className="flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                            <span>{ackCount} ack</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="w-3 h-3 text-slate-400" />
                                            <span>{commentCount} replies</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityRightStats;