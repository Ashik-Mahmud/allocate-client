import { BookingStatus, BOOKING_STATUS_CONFIG } from '@/types/booking'

export function formatCredits(value: number) {
    return `${value?.toLocaleString()} CR`
}

export function formatTransactionType(type: 'SPEND' | 'DEPOSIT') {
    return type === 'SPEND' ? 'Credits deducted' : 'Credits added'
}

export function formatDateTime(value: string) {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value))
}

export function formatLastTransaction(date: string) {
    return `Last activity ${formatRelativeTime(date)}`
}

export function formatRelativeTime(value: string) {
    const diffMs = Date.now() - new Date(value).getTime()
    const minutes = Math.max(1, Math.floor(diffMs / 60000))


    if (minutes < 60) {
        return `${minutes}m ago`
    }

    const hours = Math.floor(minutes / 60)
    if (hours < 24) {
        return `${hours}h ago`
    }

    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

export function normalizeDescription(description: string, resourceName: string) {
    const sanitized = description.replace(/\bundefined\b\s*/gi, '').trim()

    if (sanitized?.length > 0) {
        return sanitized
    }

    return `Activity recorded for ${resourceName}.`
}

export function getBookingStatusMeta(status: BookingStatus) {
    const config = BOOKING_STATUS_CONFIG[status] ?? BOOKING_STATUS_CONFIG[BookingStatus.CANCELLED]

    return {
        label: config.label,
        pillClass: config.color,
        dotClass: status === BookingStatus.COMPLETED || status === BookingStatus.CONFIRMED || status === BookingStatus.CHECKED_IN
            ? 'border-emerald-200/70 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
            : status === BookingStatus.PENDING
                ? 'border-amber-200/70 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300'
                : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400',
        icon: config.icon,
    }
}
