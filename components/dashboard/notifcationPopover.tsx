import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Bell } from 'lucide-react';

type Props = {
    unreadCount: number;
}

const NotificationPopover = ({ unreadCount }: Props) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                >
                    <Bell className="size-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="leading-none font-medium">Dimensions</h4>
                        <p className="text-sm text-muted-foreground">
                            Set the dimensions for the layer.
                        </p>
                    </div>

                </div>
            </PopoverContent>
        </Popover>
    )
}

export default NotificationPopover