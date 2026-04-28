import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const DialogPopup = ({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    className,
    size = 'md'
}: Props) => {

    const sizeClasses = {
        sm: 'sm:max-w-[425px]',
        md: 'sm:max-w-[600px]',
        lg: 'sm:max-w-[800px]',
        xl: 'sm:max-w-[1000px]',
        full: 'sm:max-w-[95vw] h-[90vh]'
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn(
                "flex flex-col gap-0 p-0 overflow-hidden", // Clean container
                sizeClasses[size],
                className
            )}>
                {/* Header Section */}
                <DialogHeader className="p-4 pb-3 border-b bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-zinc-800">
                    <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                        {title}
                    </DialogTitle>
                    {description && (
                        <DialogDescription className="text-sm text-slate-500">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                {/* Content Section - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 max-h-[70vh]">
                    {children}
                </div>

                {/* Optional Footer Section */}
                {footer && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
                        {footer}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default DialogPopup