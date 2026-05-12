"use client"

import * as React from "react"
import { Check, ChevronsUpDown, DatabaseSearch, Loader2, X } from "lucide-react"



import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils/cn";

export type Option = {
    label: string
    value: string
}

interface SearchableSelectProps {
    options: Option[]
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    label?: string
    loading?: boolean
    // Selection Logic
    value?: string | string[] // Supports single string or array of strings
    onChange: (value: any) => void
    isMulti?: boolean
    className?: string
    onSearchChange?: (search: string) => void
    inputClassName?: string
    labelClassName?: string,
    icon?: React.ReactNode
}

export function SearchableSelect({
    options,
    placeholder = "Select option...",
    searchPlaceholder = "Search...",
    emptyMessage = "No results found.",
    label,
    loading = false,
    value,
    onChange,
    isMulti = false,
    className,
    onSearchChange,
    inputClassName,
    labelClassName,
    icon,
}: SearchableSelectProps) {
    const [open, setOpen] = React.useState(false)

    // Helper to handle selection
    const handleSelect = (optionValue: string) => {
        if (isMulti) {
            const currentValues = Array.isArray(value) ? value : []
            const newValue = currentValues.includes(optionValue)
                ? currentValues.filter((v) => v !== optionValue)
                : [...currentValues, optionValue]
            onChange(newValue)
        } else {
            onChange(optionValue)
            setOpen(false)
        }
    }

    // Helper to remove a chip
    const handleRemove = (e: React.MouseEvent, optionValue: string) => {
        e.stopPropagation()
        if (isMulti && Array.isArray(value)) {
            onChange(value.filter((v) => v !== optionValue))
        }
    }

    // Display logic for the button trigger
    const renderDisplay = () => {
        if (isMulti && Array.isArray(value) && value.length > 0) {
            return (
                <div className="flex flex-wrap gap-1">
                    {value.map((v) => {
                        const opt = options.find((o) => o.value === v)
                        return (
                            <div
                                key={v}
                                className="rounded-md px-1.5 font-medium bg-slate-200 py-0.5 text-slate-700 hover:bg-slate-200 border-none flex items-center gap-1"
                            >
                                {opt?.label || v}
                                <span
                                    className="ml-1 rounded-full outline-none hover:bg-slate-300 cursor-pointer"
                                    onClick={(e) => handleRemove(e, v)}
                                >
                                    <X className="h-3 w-3" />
                                </span>
                            </div>
                        )
                    })}
                </div>
            )
        }

        if (!isMulti && typeof value === "string") {
            return options.find((opt) => opt.value === value)?.label || placeholder
        }

        return <span className="text-slate-400">{placeholder}</span>
    }

    return (
        <div className={cn("flex flex-col gap-2 w-full", className)}>
            {label && (
                <label className={cn("text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1", labelClassName)}>
                    {label}
                </label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "h-auto min-h-11 w-full justify-between rounded-xl border-slate-200 px-4 py-2 text-left font-medium shadow-none hover:bg-slate-50 transition-all",
                            open && "border-slate-300 ring-2 ring-slate-100",
                            inputClassName
                        )}
                    >
                        {icon && <div className="mr-2 h-4 w-4">{icon}</div>}
                        <div className="flex flex-wrap gap-1 items-center overflow-hidden  w-full">
                            {renderDisplay()}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 " />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-2xl shadow-xl border-slate-100" align="start">
                    <Command shouldFilter={!onSearchChange}>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            onValueChange={onSearchChange}
                            className="h-11"
                        />
                        <CommandList>
                            {loading && (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                </div>
                            )}
                            <CommandEmpty className="text-slate-600 dark:text-slate-300 flex flex-col items-center justify-center gap-2">
                                <DatabaseSearch className="mr-2 size-7" />
                                <p> {emptyMessage}</p>
                            </CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto p-1">
                                {options.map((option) => {
                                    const isSelected = isMulti
                                        ? Array.isArray(value) && value.includes(option.value)
                                        : value === option.value

                                    return (
                                        <CommandItem
                                            key={option.value}
                                            value={option.label}
                                            onSelect={() => handleSelect(option.value)}
                                            className="rounded-lg m-1 py-2 cursor-pointer"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4 text-blue-600",
                                                    isSelected ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <span className="font-medium text-slate-700">{option.label}</span>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}