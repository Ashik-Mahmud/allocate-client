"use client"
import React from 'react'
import {
    Plus, Users, History, Search, Filter,
    Sparkles, ChevronRight, ChevronLeft,
    ArrowUpCircle, ArrowDownCircle, Coins,
    Info
} from 'lucide-react'
import AssignCredits from './assignCredits'
import { useCurrentUser } from '@/features/auth'
import { PlanType } from '@/types/organization'
import { useAssignCreditsToMultipleStaffMutation, useGetStaffCreditLogQuery } from '@/features/staff'
import { CreditTransaction, TransactionType } from '@/types/credits'
import { CreditHistoryTable } from './CreditHistoryTable'
import { cn } from "@/lib/utils"
import { useDebounce } from '@/hooks'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import AllocateTooltip from '@/components/shared/tooltip'
import FeatureGuard from '@/components/shared/FeatureGuard'

type CreditStats = {
    items?: CreditTransaction[];
    activeStaffCount: number;
    allowcatedCredits: number;
    revokedCredits: number;
    spentCredits: number;
}

const CreditManagementMain = () => {
    const { user } = useCurrentUser();
    const [assignOpen, setAssignOpen] = React.useState(false);
    const [selectedStaffIds, setSelectedStaffIds] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [search, setSearch] = React.useState('');
    const [transactionType, setTransactionType] = React.useState<'ALL' | TransactionType>('ALL');

    const isPaidPlan = [PlanType.PRO, PlanType.ENTERPRISE].includes(user?.organization?.plan_type || PlanType.FREE);
    const debouncedSearch = useDebounce(search, 400);
    const assignCreditsMutation = useAssignCreditsToMultipleStaffMutation();

    const apiData = useGetStaffCreditLogQuery({
        page: page,
        limit,
        search: isPaidPlan ? debouncedSearch.trim() : undefined,
        type: transactionType !== 'ALL' ? transactionType : undefined,
    });

    const stats = apiData?.data?.data?.[0] as CreditStats | undefined;
    const rawItems = stats?.items || [];

    const pagination = apiData?.data?.pagination;
    const isPaginationLocked = !isPaidPlan;

    // Handlers for Credit Allocation
    const handleSingleAssign = () => {
        setSelectedStaffIds([]); // Or a specific ID if coming from a row action
        setAssignOpen(true);
    };

    const handleBulkAssign = () => {
        setSelectedStaffIds([]); // Empty array triggers the multi-selector in the drawer
        setAssignOpen(true);
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const nextLimit = Number(event.target.value);
        setLimit(nextLimit);
        setPage(1);
    };

    const handleAssignSubmit = async (data: { staffCredits: { staff_id: string; credits: number }[] }) => {
        try {
            const payload = {
                staffCredits: data.staffCredits.map((item) => ({
                    staff_id: item.staff_id,
                    credits: item.credits,
                })),
            };

            const response = await assignCreditsMutation.mutateAsync(payload);

            if (response?.success) {
                toast.success('Credits assigned successfully.');
                setAssignOpen(false);
                setSelectedStaffIds([]);
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to assign credits.');
        }
    };

    return (
        <div className="mx-auto space-y-8 ">

            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-primary rounded-xl">
                            <Coins className="size-6 text-white" />
                        </div>
                        Credit Center
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Monitor usage and distribute resources across your organization.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* <button
                        onClick={handleBulkAssign}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Users className="size-4" />
                        Bulk Allocate
                    </button> */}
                    <button
                        onClick={handleSingleAssign}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="size-4" />
                        Assign Credits
                    </button>
                </div>
            </div>

            {/* --- STATISTICS GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Allocated"
                    value={stats?.allowcatedCredits || 0}
                    icon={<ArrowUpCircle className="size-10 text-blue-600/20" />}
                    trend=""
                    color="text-blue-600"
                />
                <StatCard
                    label="Credits Revoked"
                    value={stats?.revokedCredits || 0}
                    icon={<ArrowDownCircle className="size-10 text-amber-600/20" />}
                    color="text-amber-600"
                />
                <StatCard
                    label="Team Consumption"
                    value={stats?.spentCredits || 0}
                    icon={<History className="size-10 text-rose-600/20" />}
                    color="text-rose-600"
                />
                <StatCard
                    label="Active Staff"
                    value={stats?.activeStaffCount || 0}
                    icon={<Users className="size-10 text-slate-900/20" />}
                    color="text-slate-900 dark:text-white"
                />
            </div>

            {/* --- HISTORY & TABLES --- */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        Transaction Logs
                        {!isPaidPlan && (
                            <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                Free Tier
                            </span>
                        )}
                    </h2>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">

                    {/* Toolbar */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
                        <div>
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        setPage(1);
                                    }}
                                    disabled={!isPaidPlan}
                                    placeholder={isPaidPlan ? "Search transactions..." : "Upgrade to unlock search"}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                                />

                            </div>
                            <p className="mt-1 ml-2 text-[10px] text-slate-500">
                                <AllocateTooltip content='Tip: You can search transactions by staff member name, email, reference Id, description .' position='top' >
                                    <span className="underline cursor-help">Search tips</span>
                                </AllocateTooltip>
                            </p>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-none">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                                <select
                                    value={transactionType}
                                    onChange={(event) => {
                                        setTransactionType(event.target.value as 'ALL' | TransactionType);
                                        setPage(1);
                                    }}
                                    disabled={!isPaidPlan}
                                    className="w-full min-w-52 appearance-none pl-10 pr-8 py-2.5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-sm font-semibold disabled:opacity-50"
                                >
                                    <option value="ALL">All transaction types</option>
                                    {Object.values(TransactionType).map((type) => (
                                        <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Data Display */}
                    <div className="relative min-h-100">
                        <CreditHistoryTable items={rawItems} isLoading={apiData?.isLoading} />

                        {/* Premium teaser card for free tier */}
                        <FeatureGuard>
                          <div/>
                        </FeatureGuard>

                    </div>

                    {/* Pagination */}
                    {isPaidPlan ? <>
                        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                Page {pagination?.page || 1} of {pagination?.totalPages || 1}
                            </p>

                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-2 py-1.5 bg-white dark:bg-slate-900">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Rows</span>
                                    <select
                                        value={limit}
                                        onChange={handleLimitChange}
                                        disabled={!isPaidPlan}
                                        className="bg-transparent text-xs font-bold outline-none disabled:opacity-50"
                                    >
                                        {[5, 10, 20, 50].map((size) => (
                                            <option key={size} value={size}>{size}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={isPaginationLocked || pagination?.page === 1}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 transition-all text-xs font-bold"
                                >
                                    <ChevronLeft className="size-4" /> Prev
                                </button>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={isPaginationLocked || pagination?.page === pagination?.totalPages}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 transition-all text-xs font-bold"
                                >
                                    Next <ChevronRight className="size-4" />
                                </button>
                            </div>
                        </div>

                    </> : null}
                </div>
            </div>

            <AssignCredits
                open={assignOpen}
                onOpenChange={setAssignOpen}
                selectedStaffIds={selectedStaffIds}
                onSubmit={handleAssignSubmit}
                isLoading={assignCreditsMutation.isPending}
                orgCreditPool={user?.organization?.credit_pool || 0}
                position='bottom'
                error={assignCreditsMutation.error?.message}
            />
        </div>
    )
}

const StatCard = ({ label, value, color, icon, trend }: any) => (
    <div className="p-5 py-3 rounded-3xl relative border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 shadow-sm hover:shadow-md transition-all space-y-1">
        <div className="flex items-center justify-between">
            <div className="p-2  rounded-lg absolute right-0 top-1/2 -translate-y-1/2 -rotate-45">
                {icon}
            </div>
            {trend && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">{trend}</span>}
        </div>
        <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
            <p className={cn("text-3xl font-black tracking-tight mt-0.5", color)}>
                {value?.toLocaleString() || 0}
            </p>
        </div>
    </div>
);

export default CreditManagementMain;