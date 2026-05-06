import React from 'react'

export const Skeleton = ({
    className = '',
    variant = 'default',
}: {
    className?: string
    variant?: 'default' | 'circle' | 'text'
}) => {
    const baseClass = 'animate-pulse'
    const variantClass = {
        default: 'bg-slate-200 dark:bg-slate-800',
        circle: 'rounded-full bg-slate-200 dark:bg-slate-800',
        text: 'bg-slate-200 dark:bg-slate-800 rounded',
    }[variant]

    return <div className={`${baseClass} ${variantClass} ${className}`} />
}
