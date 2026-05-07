"use client"

import React, { useEffect, useState } from 'react'
import { Clock3 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
  isWarning: boolean
}

function calculateCountdown(endDate?: string | Date | null): CountdownTime {
  if (!endDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, isWarning: false }
  }

  const parsed = endDate instanceof Date ? endDate : new Date(endDate)
  if (Number.isNaN(parsed.getTime())) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, isWarning: false }
  }

  const now = new Date()
  const diff = parsed.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, isWarning: false }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    isWarning: days <= 7,
  }
}

interface RenewalCountdownProps {
  endDate?: string | Date | null
  variant?: 'inline' | 'badge' | 'card'
  animation?: boolean;
  showSecondsInCard?: boolean;
}

export const RenewalCountdown: React.FC<RenewalCountdownProps> = ({ endDate, animation = false, variant = 'inline', showSecondsInCard = false }) => {
  const [countdown, setCountdown] = useState<CountdownTime>(() => calculateCountdown(endDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(endDate))
    }, animation ? 1000 : 60000) // Update every minute

    return () => clearInterval(timer)
  }, [endDate])

  const { days, hours, minutes,seconds, isExpired, isWarning } = countdown

  if (isExpired) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
          'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300'
        )}
      >
        <Clock3 className="size-3" />
        Subscription expired
      </span>
    )
  }

  if (variant === 'badge') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
          isWarning
            ? 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300'
            : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
        )}
      >
        <Clock3 className="size-3" />
        {days}d {hours}h remaining
      </span>
    )
  }

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'rounded-2xl border p-4',
          isWarning
            ? 'border-amber-500/20 bg-amber-500/5 dark:border-amber-500/20 dark:bg-amber-500/5'
            : 'border-emerald-500/20 bg-emerald-500/5 dark:border-emerald-500/20 dark:bg-emerald-500/5'
        )}
      >
        <div className="flex items-center gap-2">
          <Clock3 className={cn('size-5', isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400')} />
          <div>
            <p className={cn('text-xs font-semibold uppercase tracking-[0.22em]', isWarning ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-300')}>
              Renewal countdown
            </p>
            <p className={cn('mt-1 text-sm font-semibold', isWarning ? 'text-amber-900 dark:text-amber-100' : 'text-emerald-900 dark:text-emerald-100')}>
              {days}d {hours}h {minutes}m {showSecondsInCard && seconds > 0 && `${seconds}s`}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Default inline variant
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium',
        isWarning ? 'text-amber-700 dark:text-amber-300' : 'text-slate-200 dark:text-slate-400'
      )}
    >
      <Clock3 className="size-3" />
      Renews in {days}d {hours}h
    </span>
  )
}
