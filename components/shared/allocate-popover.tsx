import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils/cn'

interface AllocatePopoverProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const AllocatePopover = ({
    trigger,
    children,
    className,
    side = "bottom",
    align = "center",
    open,
    onOpenChange
}: AllocatePopoverProps) => {
    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                {trigger}
            </PopoverTrigger>
            <PopoverContent
                side={side}
                align={align}
                className={cn(
                    "w-80 p-4 rounded-[24px] shadow-2xl border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl",
                    className
                )}
            >
                {children}
            </PopoverContent>
        </Popover>
    )
}

export default AllocatePopover