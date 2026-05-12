"use client"

import React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar" // Shadcn/ui calendar
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils/cn";

type DatePickerFieldProps = {
    label?: string
    value: Date | undefined
    onChange: (date: Date | undefined) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    inputClassName?: string
    labelClassName?: string
}

export const DatePickerField = ({
    label,
    value,
    onChange,
    placeholder = "Pick a date",
    className,
    inputClassName,
    labelClassName,
    disabled = false,
}: DatePickerFieldProps) => {
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange(undefined)
    }

    return (
        <div className={cn("flex flex-col gap-2 w-full", className)}>
            {label && (
                <label className={cn("text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1", labelClassName)}>
                    {label}
                </label>
            )}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            "h-11 w-full justify-between rounded-xl border-slate-200 px-4 text-left font-medium shadow-none transition-all hover:bg-slate-50 hover:border-slate-300",
                            !value && "text-slate-400",
                            "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600",
                            disabled && "cursor-not-allowed opacity-50",
                            inputClassName
                        )}
                    >
                        <div className="flex items-center gap-2 overflow-hidden">
                            <CalendarIcon className="h-4 w-4 shrink-0 text-slate-400" />
                            <span className="truncate text-sm">
                                {value ? format(value, "dd/MM/yyyy") : placeholder}
                            </span>
                        </div>

                        {value && !disabled && (
                            <div
                                role="button"
                                onClick={handleClear}
                                className="rounded-full p-1 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X className="h-3 w-3 text-slate-400 hover:text-slate-600" />
                            </div>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl border-slate-100 shadow-xl" align="start">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={onChange}
                         
                        disabled={disabled}
                        className="rounded-2xl"
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}