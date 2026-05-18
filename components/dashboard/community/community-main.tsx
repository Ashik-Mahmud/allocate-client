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
    ShieldX,
    ChevronLeft,
    ChevronRight
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
import { div } from 'framer-motion/client';
import { Button } from '@/components/ui/button';
import PublicCommunityPostCard from './PublicCommunityPostCard';
import CommunityPagination from './communityPagination';

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
    // Fallback pagination data safely handled if backend returns meta descriptors
    const totalCount = data?.pagination?.total || posts.length;
    const totalPages = Math.ceil(totalCount / (filters.limit || 10)) || 1;


    const updateFilterField = (key: keyof CommunityPostFilter, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === 'ALL' || value === '' ? undefined : value,
            page: key === 'page' ? value : 1
        }));
    };

    const resetFilters = () => {
        setFilters(defaultFilter);
    };


    const handleAcknowledge = async (post: CommunityHub) => {
        try {
            await acknowledgeMutation.mutateAsync(post.id);
            // Optionally show a success message or update local state to reflect the acknowledgment
        } catch (error) {
            console.error("Failed to acknowledge the post:", error);
            // Optionally show an error message to the user
        }
    }

    return (
        <div className="w-full mx-auto  text-neutral-900 dark:text-neutral-100">

            {/* Header Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
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
            <div >
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="w-full h-36 bg-slate-100 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/65 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/30 dark:bg-slate-900/10">
                        <Clock3 className="w-6 h-6 mx-auto mb-3 text-slate-400 dark:text-slate-500" />
                        <p className="text-sm text-slate-400 dark:text-slate-500">No active posts or tickets match the selection filter.</p>
                    </div>
                ) : (
                    <div className=" md:max-h-[57dvh] overflow-auto">
                        <div className="grid grid-cols-1 gap-4">
                            {posts.map((post) => (
                                <PublicCommunityPostCard
                                    key={post.id}
                                    post={post}
                                    handleAcknowledge={handleAcknowledge}
                                    userId={user?.id}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {/* Pagination Container Controls */}
                {posts.length > 0 && (
                    <CommunityPagination filters={filters} updateFilterField={updateFilterField} totalPages={totalPages} />
                )}
            </div>

        </div>
    )
}

export default CommunityMain;