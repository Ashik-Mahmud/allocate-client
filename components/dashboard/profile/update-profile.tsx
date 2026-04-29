"use client"

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { User, Camera, Globe, Save, Loader2, Mail } from 'lucide-react'
import AllocateDrawer from '@/components/shared/allocate-drawer'
import { cn } from '@/lib/utils'
import { TIMEZONE_GROUPS } from './update-org'
import { useUpdateProfile } from '@/features/auth'
import { toast } from 'sonner'

// 1. Validation Schema
export const UpdateProfileSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    photo: z.string().optional(),
    timezone: z.string().optional(),
})

type UpdateProfileValues = z.infer<typeof UpdateProfileSchema>

type Props = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    user: any; // Using your User model type
    onSubmit?: (data: UpdateProfileValues) => void;
    isLoading?: boolean;
}

const UpdateProfile = ({ isOpen, setIsOpen, user, onSubmit, isLoading }: Props) => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UpdateProfileValues>({
        resolver: zodResolver(UpdateProfileSchema as any), // Type assertion to bypass the issue
        defaultValues: {
            name: user?.name || '',
            photo: user?.photo || '',
            timezone: user?.timezone || 'UTC',
        }
    })

    // Reset form when user data or open state changes
    useEffect(() => {
        if (user && isOpen) {
            reset({
                name: user.name,
                photo: user.photo || '',
            })
        }

    }, [user, isOpen, reset])

    // update in api
    const updateProfile = useUpdateProfile();

    const handleFormSubmit = async (data: UpdateProfileValues) => {
        onSubmit?.(data)
        const result = await updateProfile.mutateAsync(data);
        if (result.success) {
            setIsOpen(false);
            toast.success("Profile updated successfully");
        }
    }

    return (
        <AllocateDrawer
            open={isOpen}
            onOpenChange={setIsOpen}
            title="Update Profile"
            description="Manage your personal identity and preferences"
            showHeader={false}
            footer={<div />}
            className='dark:bg-slate-900'
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 p-6">

                {/* Avatar Preview Section */}
                <div className="flex flex-col items-center justify-center gap-4 pb-4">
                    <div className="relative group">
                        <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden">
                            {user?.photo ? (
                                <img src={user.photo} alt="Avatar" className="size-full object-cover" />
                            ) : (
                                <User className="size-10 text-slate-400" />
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <Camera className="text-white size-6" />
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Profile Picture</p>
                </div>

                {/* Name Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <User className="size-4 text-slate-400" /> Full Name
                    </label>
                    <input
                        {...register('name')}
                        className={cn(
                            "w-full h-11 px-4 rounded-xl border bg-white dark:bg-slate-950 transition-all focus:ring-2 focus:ring-indigo-500",
                            errors.name ? "border-destructive" : "border-slate-200 dark:border-zinc-800"
                        )}
                        placeholder="Your full name"
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Mail className="size-4 text-slate-400" /> Email
                    </label>
                    <input
                        value={user?.email || ''}
                        readOnly
                        className={cn(
                            "w-full h-11 px-4 rounded-xl border dark:border-none bg-white dark:bg-slate-950 transition-all focus:ring-2 focus:ring-indigo-500 read-only:cursor-not-allowed read-only:opacity-70 read-only:bg-slate-100 dark:read-only:bg-slate-800",

                        )}

                    />

                </div>
                {/* Photo URL Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Camera className="size-4 text-slate-400" /> Photo URL
                    </label>
                    <input
                        {...register('photo')}
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all focus:ring-2 focus:ring-indigo-500"
                        placeholder="https://example.com/photo.jpg"
                    />
                </div>

                {
                    updateProfile?.isError && (
                        <div className="rounded-lg bg-red-50 p-4">
                            <p className="text-sm text-red-700">{(updateProfile?.error as Error)?.message || "Something went wrong"}</p>
                        </div>
                    )
                }

                {/* Save Button */}
                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={isLoading || updateProfile.isPending}
                        className="w-full h-12 cursor-pointer bg-slate-900 dark:bg-slate-50 dark:text-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isLoading || updateProfile.isPending ? <Loader2 className="animate-spin size-5" /> : <Save className="size-5" />}
                        Save Changes
                    </button>
                </div>
            </form>
        </AllocateDrawer>
    )
}

export default UpdateProfile