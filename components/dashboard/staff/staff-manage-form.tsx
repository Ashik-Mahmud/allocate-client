"use client"

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, UserPlus, Save, Mail, User, Lock, ImageIcon } from "lucide-react"
import { cn } from '@/lib/utils'

// 1. Validation Schema
const staffSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    name: z.string().min(2, "Name is too short"),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
    photo: z.string().url("Invalid URL").optional().or(z.literal('')),
})

export type StaffFormValues = z.infer<typeof staffSchema>

type Props = {
    initialData?: Partial<StaffFormValues> ;
    onSubmit: (values: StaffFormValues) => void;
    isLoading?: boolean;
    isEdit?: boolean;
    errorMessage?: string;
}

const StaffManagementForm = ({ initialData, onSubmit, isLoading, isEdit, errorMessage }: Props) => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<StaffFormValues>({
        resolver: zodResolver(staffSchema as any),
        defaultValues: {
            email: '',
            name: '',
            password: '',
            photo: '',
            ...initialData
        },
    })

    useEffect(() => {
        if (initialData) reset(initialData);
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
            {errorMessage && (
                <p className="text-sm font-medium text-destructive">{errorMessage}</p>
            )}
            {/* Full Name */}
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <User className="size-3.5" /> Full Name <span className="text-red-500 ">*</span>
                </label>
                <input
                    {...register("name")}
                    placeholder="e.g. Ashik Mamud"
                    className={cn(
                        "flex h-10 w-full rounded-xl border bg-white px-3 py-2 text-sm ring-offset-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:bg-slate-900 dark:ring-offset-zinc-950 dark:focus:ring-zinc-300 dark:text-white",
                        errors.name ? "border-destructive" : "border-slate-200 dark:border-zinc-800"
                    )}
                />
                {errors.name && <p className="text-[11px] font-medium text-destructive">{errors.name.message}</p>}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Mail className="size-3.5" /> Email Address 
                    <span className="text-red-500 ">*</span>
                </label>
                <input
                    {...register("email")}
                    type="email"
                    placeholder="staff@example.com"
                    className={cn(
                        "flex h-10 w-full rounded-xl border bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-950 dark:bg-slate-900 dark:focus:ring-zinc-300 dark:text-white ",
                        errors.email ? "border-destructive" : "border-slate-200 dark:border-zinc-800"
                    )}
                />
                {errors.email && <p className="text-[11px] font-medium text-destructive">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Lock className="size-3.5" /> Password
                    {isEdit && <span className="text-[10px] font-normal opacity-60">(Optional on edit)</span>}
                </label>
                <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className={cn(
                        "flex h-10 w-full rounded-xl border bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-950 dark:bg-slate-900 dark:text-white dark:focus:ring-zinc-300",
                        errors.password ? "border-destructive" : "border-slate-200 dark:border-zinc-800"
                    )}
                />
                {errors.password && <p className="text-[11px] font-medium text-destructive">{errors.password.message}</p>}
            </div>

            {/* Photo URL */}
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <ImageIcon className="size-3.5" /> Photo URL
                </label>
                <input
                    {...register("photo")}
                    placeholder="https://image-link.com"
                    className={cn(
                        "flex h-10 w-full rounded-xl border bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-950 dark:bg-slate-900 dark:text-white dark:focus:ring-zinc-300",
                        errors.photo ? "border-destructive" : "border-slate-200 dark:border-zinc-800"
                    )}
                />
                {errors.photo && <p className="text-[11px] font-medium text-destructive">{errors.photo.message}</p>}
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-slate-50 transition-colors hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90"
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : isEdit ? (
                        <Save className="mr-2 h-4 w-4" />
                    ) : (
                        <UserPlus className="mr-2 h-4 w-4" />
                    )}
                    {isEdit ? "Update Staff" : "Add Staff Member"}
                </button>
            </div>
        </form>
    )
}

export default StaffManagementForm