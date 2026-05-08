"use client"

import React, { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import jsPDF from 'jspdf'

import { cn } from '@/lib/utils/cn'
import type { CreditTransaction } from '@/types/credits'
import type { Subscription } from '@/types/organization'

interface InvoiceDownloadCardProps {
    organizationName?: string | null
    subscription: Subscription | null
    creditTransactions?: CreditTransaction[]
}

function formatPlanLabel(plan?: string | null) {
    if (!plan) return 'Starter'

    return plan
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

function formatDate(value?: string | Date | null) {
    if (!value) return 'Not available'

    const parsed = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(parsed.getTime())) return 'Not available'

    return format(parsed, 'dd MMM yyyy')
}

function formatAmount(value?: number | null, currency?: string | null) {
    if (typeof value !== 'number') {
        return 'Not available'
    }

    if (!currency || currency === 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2,
        }).format(value)
    }

    if (currency === 'BDT') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
            maximumFractionDigits: 2,
        }).format(value)
    }

    return `${currency} ${value.toFixed(2)}`
}

interface InvoiceData {
    organizationName: string
    planName: string
    invoiceDate: string
    invoiceNumber: string
    billingCycleStart: string
    billingCycleEnd: string
    transactionStatus: string
    paymentMethod: string
    amountPaid: string
    creditsImpacted: string
    currentBalance: string
    description: string
}

function generateInvoicePdf(data: InvoiceData): Blob {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 15
    let yPosition = margin

    // Define colors
    const primaryColor = [59, 130, 246] // Blue
    const darkGray = [31, 41, 55] // Dark gray
    const lightGray = [243, 244, 246] // Light gray
    const textGray = [75, 85, 99] // Text gray

    // Header background
    doc.setFillColor(248, 250, 255) // Very light blue
    doc.rect(0, 0, pageWidth, 50, 'F')

    // Company branding section
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primaryColor as [number, number, number])
    doc.text('ALLOCATE', margin, yPosition + 12)

    // Invoice label on right
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...darkGray as [number, number, number])
    doc.text('INVOICE', pageWidth - margin - 40, yPosition + 12)

    // Subtitle
    doc.setFontSize(10)
    doc.setFont('helvetica', 'regular')
    doc.setTextColor(...textGray as [number, number, number])
    doc.text('Billing Invoice', margin, yPosition + 20)

    yPosition += 35

    // Horizontal line
    doc.setDrawColor(...primaryColor as [number, number, number])
    doc.setLineWidth(0.5)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)

    yPosition += 8

    // Invoice details - Two column layout
    const leftColumnX = margin
    const rightColumnX = pageWidth / 2 + 5

    // Left column headers
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...textGray as [number, number, number])

    doc.text('Invoice Number', leftColumnX, yPosition)
    doc.text('Invoice Date', leftColumnX, yPosition + 12)

    // Right column headers
    doc.text('Organization', rightColumnX, yPosition)
    doc.text('Plan', rightColumnX, yPosition + 12)

    // Left column values
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...darkGray as [number, number, number])

    doc.text(String(data.invoiceNumber), leftColumnX, yPosition + 6)
    doc.text(data.invoiceDate, leftColumnX, yPosition + 18)

    // Right column values
    doc.text(data.organizationName, rightColumnX, yPosition + 6)
    doc.text(data.planName, rightColumnX, yPosition + 18)

    yPosition += 30

    // Billing Period Section
    doc.setFillColor(...lightGray as [number, number, number])
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 16, 'F')

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...darkGray as [number, number, number])
    doc.text('Billing Period', margin + 3, yPosition + 5)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'regular')
    doc.setTextColor(...textGray as [number, number, number])
    doc.text(`${data.billingCycleStart} - ${data.billingCycleEnd}`, margin + 3, yPosition + 11)

    yPosition += 22

    // Transaction Details Header
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...darkGray as [number, number, number])
    doc.text('Transaction Details', margin, yPosition)

    yPosition += 8

    // Divider line
    doc.setDrawColor(...primaryColor as [number, number, number])
    doc.setLineWidth(0.3)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)

    yPosition += 6

    // Transaction details table
    const detailsRowHeight = 6
    const labelWidth = 45
    const valueX = margin + labelWidth + 5

    const details = [
        { label: 'Status', value: data.transactionStatus },
        { label: 'Payment Method', value: data.paymentMethod },
        { label: 'Amount Paid', value: data.amountPaid },
        { label: 'Credits Impacted', value: data.creditsImpacted },
        { label: 'Current Balance', value: data.currentBalance },
    ]

    details.forEach((detail, index) => {
        // Alternate row background
        if (index % 2 === 0) {
            doc.setFillColor(249, 250, 251)
            doc.rect(margin, yPosition - 2, pageWidth - 2 * margin, detailsRowHeight + 2, 'F')
        }

        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...textGray as [number, number, number])
        doc.text(detail.label, margin + 2, yPosition + 2)

        doc.setFontSize(10)
        doc.setFont('helvetica', 'regular')
        doc.setTextColor(...darkGray as [number, number, number])
        doc.text(detail.value, valueX, yPosition + 2)

        yPosition += detailsRowHeight + 2
    })

    yPosition += 4

    // Notes Section
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...darkGray as [number, number, number])
    doc.text('Notes', margin, yPosition)

    yPosition += 6

    // Notes divider
    doc.setDrawColor(...primaryColor as [number, number, number])
    doc.setLineWidth(0.3)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)

    yPosition += 4

    // Notes content
    doc.setFontSize(9)
    doc.setFont('helvetica', 'regular')
    doc.setTextColor(...textGray as [number, number, number])

    const descriptionMaxWidth = pageWidth - 2 * margin - 4
    const wrappedDescription = doc.splitTextToSize(data.description, descriptionMaxWidth)
    doc.text(wrappedDescription, margin + 2, yPosition + 2)

    // Footer
    const footerY = pageHeight - 20
    doc.setFontSize(8)
    doc.setFont('helvetica', 'regular')
    doc.setTextColor(180, 180, 180)

    doc.text('Thank you for your business with Allocate', pageWidth / 2, footerY, { align: 'center' })

    const generatedDate = format(new Date(), 'dd MMM yyyy HH:mm')
    doc.text(`Generated on ${generatedDate}`, pageWidth / 2, footerY + 5, { align: 'center' })

    // Page border
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    doc.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin, 'S')

    // Return PDF as blob
    return doc.output('blob')
}

function resolveLatestTransaction(subscription: Subscription | null, transactions?: CreditTransaction[]) {
    if (!transactions || transactions.length === 0) {
        return null
    }

    const sortedTransactions = [...transactions].sort((left, right) => {
        const leftTime = new Date(left.createdAt).getTime()
        const rightTime = new Date(right.createdAt).getTime()

        return rightTime - leftTime
    })

    const matchedTransaction = subscription?.last_transaction_id
        ? sortedTransactions.find((transaction) => transaction.transaction_id === subscription.last_transaction_id || transaction.id === subscription.last_transaction_id)
        : null

    return matchedTransaction ?? sortedTransactions[0] ?? null
}

export function InvoiceDownloadCard({ organizationName, subscription, creditTransactions }: InvoiceDownloadCardProps) {
    const [isDownloading, setIsDownloading] = useState(false)
    const latestTransaction = resolveLatestTransaction(subscription, creditTransactions)

    const handleDownload = () => {
        if (!latestTransaction) {
            toast.error('No invoice is available for this billing cycle yet.')
            return
        }

        setIsDownloading(true)

        try {
            const invoiceNumber = latestTransaction.transaction_id ?? latestTransaction.id
            const invoiceData: InvoiceData = {
                organizationName: organizationName ?? 'Not available',
                planName: formatPlanLabel(subscription?.plan_name ?? null),
                invoiceDate: formatDate(latestTransaction.createdAt),
                invoiceNumber: String(invoiceNumber),
                billingCycleStart: formatDate(subscription?.start_date ?? null),
                billingCycleEnd: formatDate(subscription?.end_date ?? null),
                transactionStatus: latestTransaction.status ?? 'Not available',
                paymentMethod: latestTransaction.payment_gateway ?? subscription?.provider ?? 'Not available',
                amountPaid: formatAmount(latestTransaction.price_paid, latestTransaction.currency),
                creditsImpacted: `${latestTransaction.amount.toLocaleString()} credits`,
                currentBalance: `${latestTransaction.currentBalance.toLocaleString()} credits`,
                description: latestTransaction.description ?? 'No description provided',
            }

            const pdfBlob = generateInvoicePdf(invoiceData)
            const downloadUrl = URL.createObjectURL(pdfBlob)
            const anchor = document.createElement('a')
            anchor.href = downloadUrl
            anchor.download = `allocate-invoice-${invoiceNumber}.pdf`
            anchor.click()
            URL.revokeObjectURL(downloadUrl)
        } catch {
            toast.error('We could not generate the invoice PDF right now.')
        } finally {
            setIsDownloading(false)
        }
    }

    const hasInvoice = Boolean(latestTransaction)

    return (
        <div className={cn('rounded-2xl border border-slate-200 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-900/60', !hasInvoice && 'opacity-85')}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Invoice</p>
                    <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                        Download a PDF receipt for the latest successful transaction.
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {hasInvoice ? 'The most recent payment metadata is already attached to this billing record.' : 'No completed transaction is available yet.'}
                    </p>
                </div>

                <button
                    type="button"
                    disabled={!hasInvoice || isDownloading}
                    onClick={handleDownload}
                    className={cn(
                        'cursor-pointer inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all',
                        hasInvoice && !isDownloading
                            ? 'border border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-900'
                            : 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-500'
                    )}
                >
                    {isDownloading ? <Loader2 className="size-3.5 animate-spin" /> : <FileDown className="size-3.5" />}
                    <span>{isDownloading ? 'Preparing PDF' : 'Download invoice PDF'}</span>
                </button>
            </div>
        </div>
    )
}
