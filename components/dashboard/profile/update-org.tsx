"use client"

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
    Building2, 
    Globe, 
    Mail, 
    Hash, 
    Save, 
    Loader2, 
    Image as ImageIcon,
    Info
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 1. Define the Schema based on your Prisma Model
const orgSchema = z.object({
    name: z.string().min(2, "Organization name is required"),
    tagline: z.string().max(100, "Tagline is too long").optional().or(z.literal('')),
    business_email: z.string().email("Invalid business email").optional().or(z.literal('')),
    timezone: z.string().min(1, "Timezone is required"),
    photo: z.string().url("Invalid photo URL").optional().or(z.literal('')),
    org_type: z.string().optional().or(z.literal('')),
})

export type OrgFormValues = z.infer<typeof orgSchema>

type Props = {
    data?: Partial<OrgFormValues>;
    onSubmit: (values: OrgFormValues) => void;
    isLoading?: boolean;
}

const UpdateOrganization = ({ data, onSubmit, isLoading }: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<OrgFormValues>({
        resolver: zodResolver(orgSchema as any),
        defaultValues: {
            name: '',
            tagline: '',
            business_email: '',
            timezone: 'UTC',
            photo: '',
            org_type: '',
            ...data
        }
    })

    // Sync form if data is fetched asynchronously
    useEffect(() => {
        if (data) reset(data);
    }, [data, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Top Grid: Name & Business Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Building2 className="size-3.5 text-slate-400" /> Organization Name
                    </label>
                    <input
                        {...register("name")}
                        className={cn(
                            "flex h-11 w-full rounded-xl border bg-white px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-950",
                            errors.name ? "border-destructive" : "border-slate-200 dark:border-zinc-800"
                        )}
                    />
                    {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Mail className="size-3.5 text-slate-400" /> Business Email
                    </label>
                    <input
                        {...register("business_email")}
                        type="email"
                        placeholder="admin@org.com"
                        className={cn(
                            "flex h-11 w-full rounded-xl border bg-white px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-950",
                            errors.business_email ? "border-destructive" : "border-slate-200 dark:border-zinc-800"
                        )}
                    />
                </div>
            </div>

            {/* Tagline / Description */}
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Info className="size-3.5 text-slate-400" /> Tagline
                </label>
                <input
                    {...register("tagline")}
                    placeholder="e.g. Best workspace management in Bangladesh"
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                />
            </div>

            {/* Photo & Timezone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <ImageIcon className="size-3.5 text-slate-400" /> Brand Logo URL
                    </label>
                    <input
                        {...register("photo")}
                        placeholder="https://..."
                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Globe className="size-3.5 text-slate-400" /> Timezone
                    </label>
                    <select
                        {...register("timezone")}
                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                    >
                        <option value="UTC">UTC (Universal)</option>
                        <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                        <option value="America/New_York">Eastern Time</option>
                    </select>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-zinc-800">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                    Save Organization Settings
                </button>
            </div>
        </form>
    )
}

export default UpdateOrganization