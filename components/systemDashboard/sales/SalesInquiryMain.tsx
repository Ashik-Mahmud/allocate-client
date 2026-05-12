"use client"

import React, { useMemo, useState } from "react"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight, Eye, Filter, MoreHorizontal, RefreshCw, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDeleteSalesInquiry, useSalesInquiries, useSalesInquiryDetails, useUpdateSalesInquiry } from "@/features/sales/hooks"
import { SaleInquiryStatus, SalesInquiry } from "@/types/sales"
import { DEFAULT_FILTERS, InquiryFilters, PAGE_SIZE_OPTIONS, SORT_OPTIONS, STATUS_META, STATUS_OPTIONS } from "./Sales.constant";

import ViewSalesInquiry from "./ViewSalesInquiry"

function formatDate(value: string | Date | null | undefined) {
    if (!value) return "-"

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "-"

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date)
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
            <div className="text-sm text-foreground">{value}</div>
        </div>
    )
}

function formatStatus(status: SaleInquiryStatus) {
    return STATUS_META[status]?.label ?? status
}

function StatusBadge({ status }: { status: SaleInquiryStatus }) {
    const meta = STATUS_META[status]

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${meta.className}`}>
            {meta.label}
        </span>
    )
}

const SalesInquiryMain = () => {
    const [filters, setFilters] = useState<InquiryFilters>(DEFAULT_FILTERS)
    const [selectedInquiry, setSelectedInquiry] = useState<SalesInquiry | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<SalesInquiry | null>(null)

    const queryFilters = useMemo(
        () => ({
            search: filters.search.trim() || undefined,
            status: filters.status === "all" ? undefined : filters.status,
            country: filters.country.trim() || undefined,
            org_id: filters.orgId.trim() || undefined,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
            page: filters.page,
            limit: filters.limit,
        }),
        [filters]
    )

    const { data, isLoading, isFetching, error } = useSalesInquiries(queryFilters)
    const { data: inquiryDetails, isLoading: isInquiryLoading } = useSalesInquiryDetails(selectedInquiry?.id ?? "")
    const updateSalesInquiryMutation = useUpdateSalesInquiry()
    const deleteSalesInquiryMutation = useDeleteSalesInquiry()

    const inquiries = data?.data ?? []
    const pagination = data?.pagination
    const detailInquiry = inquiryDetails?.data ?? selectedInquiry

    const updateFilters = (patch: Partial<InquiryFilters>, resetPage = true) => {
        setFilters((current) => ({
            ...current,
            ...patch,
            page: resetPage ? 1 : patch.page ?? current.page,
        }))
    }

    const resetFilters = () => {
        setFilters(DEFAULT_FILTERS)
        toast.success("Filters reset")
    }

    const openInquiry = (inquiry: SalesInquiry) => {
        setSelectedInquiry(inquiry)
    }

    const closeInquiry = () => {
        setSelectedInquiry(null)
    }

    const confirmDeleteInquiry = async () => {
        if (!deleteTarget?.id) {
            return
        }

        try {
            await deleteSalesInquiryMutation.mutateAsync(deleteTarget.id)
            toast.success("Inquiry deleted successfully")

            if (selectedInquiry?.id === deleteTarget.id) {
                setSelectedInquiry(null)
            }
            setDeleteTarget(null)
        } catch (mutationError) {
            toast.error(mutationError instanceof Error ? mutationError.message : "Unable to delete inquiry")
        }
    }

    const updateStatus = async (inquiryId: string, status: SaleInquiryStatus) => {
        try {
            await updateSalesInquiryMutation.mutateAsync({
                id: inquiryId,
                data: { status },
            })

            toast.success(`Status updated to ${formatStatus(status)}`)

            if (selectedInquiry?.id === inquiryId) {
                setSelectedInquiry((current) => (current ? { ...current, status } : current))
            }
        } catch (mutationError) {
            toast.error(mutationError instanceof Error ? mutationError.message : "Unable to update inquiry status")
        }
    }

    const totalCount = pagination?.total ?? inquiries.length
    const totalPages = pagination?.totalPages ?? 1
    const currentPage = pagination?.page ?? filters.page

    return (
        <div className="space-y-5">
            <section className="rounded-3xl border border-border bg-card p-4 shadow-sm shadow-black/5 transition-colors md:p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Sales</p>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sales inquiries</h1>
                        <p className="max-w-2xl text-sm text-muted-foreground">
                            Review inbound leads, inspect the message, and move the status forward without leaving the page.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {isFetching ? <RefreshCw className="size-3.5 animate-spin" /> : null}
                        <span>{totalCount} inquiries</span>
                        <span className="hidden h-1 w-1 rounded-full bg-border sm:inline-flex" />
                        <span>
                            Page {currentPage} of {Math.max(totalPages, 1)}
                        </span>
                    </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-12">
                    <div className="md:col-span-4">
                        <Label className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">Search</Label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={filters.search}
                                onChange={(event) => updateFilters({ search: event.target.value })}
                                placeholder="Search name, email, or message"
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <Label className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">Status</Label>
                        <Select
                            value={filters.status}
                            onValueChange={(value) => updateFilters({ status: value as InquiryFilters["status"] })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                {STATUS_OPTIONS.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {formatStatus(status)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="md:col-span-2">
                        <Label className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">Country</Label>
                        <Input
                            value={filters.country}
                            onChange={(event) => updateFilters({ country: event.target.value })}
                            placeholder="Country"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Label className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">Org ID</Label>
                        <Input
                            value={filters.orgId}
                            onChange={(event) => updateFilters({ orgId: event.target.value })}
                            placeholder="Optional"
                        />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 md:col-span-2 md:grid-cols-2">
                        <div>
                            <Label className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">Sort by</Label>
                            <Select
                                value={filters.sortBy}
                                onValueChange={(value) => updateFilters({ sortBy: value as InquiryFilters["sortBy"] })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SORT_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">Order</Label>
                            <Select
                                value={filters.sortOrder}
                                onValueChange={(value) => updateFilters({ sortOrder: value as InquiryFilters["sortOrder"] })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="desc">Newest first</SelectItem>
                                    <SelectItem value="asc">Oldest first</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-end gap-2 md:col-span-12 md:justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-28">
                                <Label className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">Rows</Label>
                                <Select value={String(filters.limit)} onValueChange={(value) => updateFilters({ limit: Number(value) })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PAGE_SIZE_OPTIONS.map((option) => (
                                            <SelectItem key={option} value={String(option)}>
                                                {option} per page
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button variant="outline" onClick={resetFilters}>
                            <Filter className="size-4" />
                            Reset filters
                        </Button>
                    </div>
                </div>
            </section>

            {error ? (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                    {error instanceof Error ? error.message : "Unable to load sales inquiries"}
                </div>
            ) : null}

            <section className="rounded-3xl border border-border bg-card shadow-sm shadow-black/5 transition-colors">
                {isLoading ? (
                    <div className="p-4 md:p-5">
                        <div className="animate-pulse space-y-3">
                            <div className="h-10 rounded-xl bg-muted" />
                            <div className="hidden space-y-3 md:block">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <div key={index} className="h-12 rounded-xl bg-muted/80" />
                                ))}
                            </div>
                            <div className="grid gap-3 md:hidden">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="h-32 rounded-2xl bg-muted/80" />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : inquiries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
                        <div className="rounded-full border border-dashed border-border bg-muted/40 p-3 text-muted-foreground">
                            <Search className="size-5" />
                        </div>
                        <p className="text-sm font-medium text-foreground">No inquiries found</p>
                        <p className="max-w-sm text-xs text-muted-foreground">
                            Try a wider search or clear a filter to see more results.
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Org</TableHead>
                                        <TableHead>Country</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inquiries.map((inquiry) => (
                                        <TableRow key={inquiry.id}>
                                            <TableCell className="max-w-50 whitespace-normal font-medium">{inquiry.name}</TableCell>
                                            <TableCell className="max-w-55 whitespace-normal text-muted-foreground">
                                                {inquiry.business_email}
                                            </TableCell>
                                            <TableCell>{inquiry.phone ?? "-"}</TableCell>
                                            <TableCell className="max-w-45 whitespace-normal">
                                                {inquiry.organization?.name ?? inquiry.org_id ?? "-"}
                                            </TableCell>
                                            <TableCell>{inquiry.country ?? "-"}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={inquiry.status} />
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{formatDate(inquiry.createdAt)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => openInquiry(inquiry)}>
                                                        <Eye className="size-4" />
                                                        View
                                                    </Button>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon-sm" aria-label="Update status">
                                                                <MoreHorizontal className="size-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuLabel>Status</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            {STATUS_OPTIONS.map((status) => (
                                                                <DropdownMenuItem
                                                                    key={status}
                                                                    disabled={updateSalesInquiryMutation.isPending}
                                                                    onClick={() => {
                                                                        void updateStatus(inquiry.id, status)
                                                                    }}
                                                                >
                                                                    {formatStatus(status)}
                                                                </DropdownMenuItem>
                                                            ))}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                disabled={deleteSalesInquiryMutation.isPending}
                                                                onClick={() => setDeleteTarget(inquiry)}
                                                            >
                                                                <Trash2 className="size-4" />
                                                                Delete inquiry
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="grid gap-3 p-3 md:hidden">
                            {inquiries.map((inquiry) => (
                                <Card key={inquiry.id} className="border-border/70 shadow-none">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="space-y-1">
                                                <CardTitle className="text-base">{inquiry.name}</CardTitle>
                                                <CardDescription className="break-all">{inquiry.business_email}</CardDescription>
                                            </div>
                                            <StatusBadge status={inquiry.status} />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <Field label="Phone" value={inquiry.phone ?? "-"} />
                                            <Field label="Country" value={inquiry.country ?? "-"} />
                                            <Field label="Org" value={inquiry.organization?.name ?? inquiry.org_id ?? "-"} />
                                            <Field label="Created" value={formatDate(inquiry.createdAt)} />
                                        </div>

                                        <div className="flex items-center gap-2 pt-1">
                                            <Button variant="outline" size="sm" className="flex-1" onClick={() => openInquiry(inquiry)}>
                                                <Eye className="size-4" />
                                                View
                                            </Button>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon-sm" aria-label="Update status">
                                                        <MoreHorizontal className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {STATUS_OPTIONS.map((status) => (
                                                        <DropdownMenuItem
                                                            key={status}
                                                            disabled={updateSalesInquiryMutation.isPending}
                                                            onClick={() => {
                                                                void updateStatus(inquiry.id, status)
                                                            }}
                                                        >
                                                            {formatStatus(status)}
                                                        </DropdownMenuItem>
                                                    ))}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        disabled={deleteSalesInquiryMutation.isPending}
                                                        onClick={() => setDeleteTarget(inquiry)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                        Delete inquiry
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-5">
                            <p className="text-sm text-muted-foreground">
                                Showing {inquiries.length} of {totalCount} inquiries
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateFilters({ page: Math.max(1, filters.page - 1) }, false)}
                                    disabled={filters.page <= 1}
                                >
                                    <ChevronLeft className="size-4" />
                                    Prev
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateFilters({ page: Math.min(totalPages, filters.page + 1) }, false)}
                                    disabled={filters.page >= totalPages}
                                >
                                    Next
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <ViewSalesInquiry
                open={Boolean(selectedInquiry)}
                inquiry={detailInquiry}
                isLoading={isInquiryLoading}
                isUpdating={updateSalesInquiryMutation.isPending}
                onOpenChange={(open) => (!open ? closeInquiry() : null)}
                onUpdateStatus={(status) => {
                    const inquiryId = detailInquiry?.id ?? selectedInquiry?.id

                    if (inquiryId) {
                        void updateStatus(inquiryId, status)
                    }
                }}
            />

            <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => (!open ? setDeleteTarget(null) : null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete sales inquiry?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete {deleteTarget?.name ?? "this inquiry"}. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteSalesInquiryMutation.isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            disabled={deleteSalesInquiryMutation.isPending}
                            onClick={() => {
                                void confirmDeleteInquiry()
                            }}
                        >
                            {deleteSalesInquiryMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default SalesInquiryMain