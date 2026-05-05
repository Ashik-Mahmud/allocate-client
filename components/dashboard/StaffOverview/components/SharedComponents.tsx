import React from 'react'

interface Panel {
    title: string
    description?: string
    children: React.ReactNode
}

export function Panel({ title, description, children }: Panel) {
    return (
       <section className="group rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/60 sm:p-8">
            <header className="flex flex-col gap-2 border-b border-slate-100 pb-5 dark:border-slate-800/50 sm:flex-row sm:items-start sm:justify-between sm:pb-6">
                <div className="space-y-1.5">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                        {title}
                    </h2>
                    {description && (
                        <p className="max-w-prose text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            {description}
                        </p>
                    )}
                </div>
                
                {/* 
                   This is a 'hidden' slot for future-proofing. 
                   If you ever add an 'Action' or 'Icon' to the header, 
                   it will stay top-right on desktop and stack on mobile.
                */}
            </header>
            
            <div className="relative mt-5 sm:mt-8">
                {children}
            </div>
        </section>
    )
}

interface StatusPillProps {
    label: string
    className: string
}

export function StatusPill({ label, className }: StatusPillProps) {
    const { cn } = require('@/lib/utils/cn')
    return (
        <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]', className)}>
            {label}
        </span>
    )
}

interface ChipProps {
    label: string
}

export function Chip({ label }: ChipProps) {
    return (
        <span className="inline-flex max-w-full items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <span className="truncate">{label}</span>
        </span>
    )
}

interface EmptyInlineProps {
    text: string
}

export function EmptyInline({ text }: EmptyInlineProps) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
            {text}
        </div>
    )
}
