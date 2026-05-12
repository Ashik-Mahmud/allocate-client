import { SaleInquiryStatus } from "@/types/sales";

type SortKey = "createdAt" | "updatedAt" | "name" | "business_email" | "country" | "status"
export type InquiryFilters = {
    search: string
    status: "all" | SaleInquiryStatus
    country: string
    orgId: string
    sortBy: SortKey
    sortOrder: "asc" | "desc"
    page: number
    limit: number
}

const STATUS_OPTIONS = Object.values(SaleInquiryStatus)

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
    { value: "createdAt", label: "Newest" },
    { value: "updatedAt", label: "Last updated" },
    { value: "name", label: "Name" },
    { value: "business_email", label: "Email" },
    { value: "country", label: "Country" },
    { value: "status", label: "Status" },
]

const PAGE_SIZE_OPTIONS = [10, 20, 50]

const DEFAULT_FILTERS: InquiryFilters = {
    search: "",
    status: "all",
    country: "",
    orgId: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
}

const STATUS_META: Record<SaleInquiryStatus, { label: string; className: string }> = {
    [SaleInquiryStatus.PENDING]: {
        label: "Pending",
        className: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    },
    [SaleInquiryStatus.CONTACTED]: {
        label: "Contacted",
        className: "bg-sky-500/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
    },
    [SaleInquiryStatus.CONVERTED]: {
        label: "Converted",
        className: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    },
    [SaleInquiryStatus.CLOSED]: {
        label: "Closed",
        className: "bg-slate-500/10 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
    },
}

export {
    STATUS_OPTIONS,
    SORT_OPTIONS,
    PAGE_SIZE_OPTIONS,
    DEFAULT_FILTERS,
    STATUS_META,
}