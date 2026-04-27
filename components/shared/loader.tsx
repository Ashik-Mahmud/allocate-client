import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

type Props = {
    type: "page" | "component";
    pageName?: string;
    className?: string;
}

const Loader = ({ type, pageName, className }: Props) => {
    // Full Page Layout vs Inline Component Layout
    const isPage = type === "page";

    return (
        <div className={cn(
            "flex flex-col items-center justify-center gap-4 transition-all duration-500",
            isPage ? "fixed inset-0 z-50 bg-white/80 backdrop-blur-md dark:bg-zinc-950/80" : "w-full h-full min-h-[200px]",
            className
        )}>
            <div className="relative flex items-center justify-center">
                {/* Outer Decorative Ring - Pulsing */}
                <div className="absolute h-16 w-16 animate-pulse rounded-full border-2 border-primary/20" />
                
                {/* Inner Spinning Ring - Faster */}
                <div className="absolute h-12 w-12 animate-[spin_0.8s_linear_infinite] rounded-full border-t-2 border-primary border-r-2 border-transparent" />
                
                {/* Core Icon - Counter-rotating */}
                <Loader2 className="h-6 w-6 animate-[spin_2s_linear_infinite_reverse] text-primary dark:text-primary/80" />
            </div>

            {/* Optional Loading Text */}
            {isPage && (
                <div className="flex flex-col items-center gap-1 animate-in fade-in slide-in-from-bottom-2 duration-700 mt-3">
                    <span className="text-sm font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                        {pageName ? `Loading ${pageName}...` : 'Preparing your workspace'}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                        Please wait
                    </span>
                </div>
            )}
        </div>
    )
}

export default Loader