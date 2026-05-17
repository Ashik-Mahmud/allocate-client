"use client"

import React from 'react'
import {
    Wrench,
    Plus,
    Search,
    Filter,
    History,
    ShieldCheck,
    ArrowRight,
    Hammer,
    Construction,
    RotateCcw,
    Eye,
    Lock,
    MessageSquare,
    Calendar,
    Clock3,
    ShieldAlert,
    ShieldX
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import CommunityHeader from './CommunityHeader';
import { useAcknowledgeCommunityPostMutation, useCommunityPostsQuery } from '@/features/community';
import { CommunityHub, CommunityPostFilter } from '@/types/community';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import AllocatePopover from '@/components/shared/allocate-popover';
import { BiSupport } from 'react-icons/bi';
import { BsPostageFill } from 'react-icons/bs';
import { formatDistanceToNow } from 'date-fns';
import { useCurrentUser } from '@/features/auth';
import { Role, User } from '@/types';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils/cn';
import { useRouter } from 'next/navigation';

// Extracted local enums for UI rendering sync
enum PostTypeEnum {
    ANNOUNCEMENT = 'ANNOUNCEMENT',
    RESOURCE_SPOTLIGHT = 'RESOURCE_SPOTLIGHT',
    USER_STORY = 'USER_STORY',
    EVENT = 'EVENT',
    ISSUES = 'ISSUES',
    RESOLVED = 'RESOLVED',
    GENERAL_DISCUSSION = 'GENERAL_DISCUSSION',
    OTHER = 'OTHER',
    SYSTEM_QUERY = 'SYSTEM_QUERY',
}

enum StatusEnum {
    PUBLISHED = 'PUBLISHED',
    DRAFT = 'DRAFT',
    ARCHIVED = 'ARCHIVED',
}

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

const CommunityMain = (props: Props) => {
    const t = useTranslations("dashboard.community");
    const { user } = useCurrentUser();
    const [filters, setFilters] = React.useState<CommunityPostFilter>(defaultFilter);
    const { data, isLoading } = useCommunityPostsQuery(filters);
    const acknowledgeMutation = useAcknowledgeCommunityPostMutation();

    const posts: CommunityHub[] = data?.data || [];
    const totalCount = posts.length;
    const router = useRouter();

    const updateFilterField = (key: keyof CommunityPostFilter, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === 'ALL' || value === '' ? undefined : value,
            page: 1 // Reset page if search parameters shift
        }));
    };

    const resetFilters = () => {
        setFilters(defaultFilter);
    };

    // Safe short date utility formatting
    const getFormattedDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleAcknowledge = async (post: CommunityHub) => {
        // Placeholder for acknowledge action - could be an API call to register the acknowledgment
        console.log(`Acknowledged post with ID: ${post.id}`);
        // Here you would typically call a mutation to update the acknowledgment status of the post
        try {
            await acknowledgeMutation.mutateAsync(post.id);
            // Optionally show a success message or update local state to reflect the acknowledgment
        } catch (error) {
            console.error("Failed to acknowledge the post:", error);
            // Optionally show an error message to the user
        }
    }

    return (
        <div className="w-full mx-auto space-y-6 text-neutral-900 dark:text-neutral-100">

            {/* Header Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                <h2 className="font-semibold flex items-center gap-2 text-base tracking-tight">
                    Active Requests
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 font-bold px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-400">
                        {isLoading ? "..." : totalCount}
                    </span>
                </h2>

                {/* Search Input field + Popover Filter Trigger Group */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-60">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                        <Input
                            placeholder="Search requests..."
                            value={filters.search || ''}
                            onChange={(e) => updateFilterField('search', e.target.value)}
                            className="pl-9 h-9 text-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-visible:ring-slate-400"
                        />
                    </div>

                    <AllocatePopover
                        trigger={
                            <button className="flex items-center gap-1.5 h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300">
                                <Filter className="w-4 h-4 text-slate-400" />
                                <span>Filter</span>
                            </button>
                        }
                        align="end"
                    >
                        {/* Filter Dropdown Layout Context Panel */}
                        <div className=" space-y-4 font-sans bg-white dark:bg-slate-950">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Advanced Filter</span>
                                <button
                                    onClick={resetFilters}
                                    className="text-[11px] flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    <RotateCcw className="w-3 h-3" /> Reset
                                </button>
                            </div>

                            {/* Filter Row: Post Type */}
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-medium text-slate-500">Post Type</Label>
                                <Select
                                    value={filters.postType || 'ALL'}
                                    onValueChange={(val) => updateFilterField('postType', val)}
                                >
                                    <SelectTrigger className="h-8! w-full! text-xs border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                                        <SelectItem value="ALL" className="text-xs">All Types</SelectItem>
                                        {Object.values(PostTypeEnum).map(type => (
                                            <SelectItem key={type} value={type} className="text-xs capitalize">
                                                {type.replace('_', ' ').toLowerCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>




                        </div>
                    </AllocatePopover>
                </div>
            </div>

            {/* Main Dynamic Content Display List Area */}
            {isLoading ? (
                <div className="grid grid-cols-1 gap-4">
                    {[1, 2].map((n) => (
                        <div key={n} className="w-full h-36 bg-slate-100 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/65 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/30 dark:bg-slate-900/10">
                    <Clock3 className="w-6 h-6 mx-auto mb-3 text-slate-400 dark:text-slate-500" />
                    <p className="text-sm text-slate-400 dark:text-slate-500">No active posts or tickets match the selection filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {posts.map((post) => {
                        const initials = post.authorName ? post.authorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
                        return (
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
                                            {user?.id === post.authorId && (
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
                                        onClick={()=>{
                                            router.push(ROUTES.dashboardCommon.community+`/${post?.id}`)
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
                                            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md transition-all duration-200 select-none cursor-pointer border ${post?.acknowledgments?.includes((user as any)?.id)
                                                    ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/60 shadow-sm"
                                                    : "bg-emerald-50 text-emerald-600 border-emerald-200/60 hover:bg-emerald-100 hover:text-emerald-700 dark:bg-emerald-900/40 dark:text-slate-400 dark:border-slate-800/80 dark:hover:bg-slate-800/60 dark:hover:text-slate-300"
                                                }`}
                                            onClick={() => handleAcknowledge(post)}
                                        >
                                            {post?.acknowledgments?.includes((user as any)?.id) ? (
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
                        );
                    })}
                </div>
            )}

          
        </div>
    )
}

export default CommunityMain;