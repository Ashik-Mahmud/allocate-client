"use client";

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock } from "lucide-react"; // Icons for UI
import { useChangePassword } from '@/features/auth';
import { toast } from 'sonner';

type ChangePasswordFormValues = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};

type Props = {
    onSubmit?: (data: ChangePasswordFormValues) => void;
    isLoading?: boolean;
    onCancel?: () => void;

};
const ChangePasswordForm = ({ onSubmit, isLoading, onCancel }: Props) => {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const changeMutation = useChangePassword();

    const { register, handleSubmit, formState: { errors } } = useForm<ChangePasswordFormValues>();

    // on handle submit 
    const onHandleSubmit = handleSubmit(async (data) => {
        try {
            if (data.newPassword !== data.confirmNewPassword) {
                // Handle password mismatch error
                toast.error("Password mismatch", {
                    description: "Please make sure both passwords match before submitting.",
                    position: "top-right",
                });
                return;
            }
            const payload = {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            }
            const result = await changeMutation.mutateAsync(payload);
            if (result.success) {
                toast.success("Password changed successfully", {
                    description: "Your password has been updated.",
                    position: "top-right",
                });
                onSubmit?.(data);

            }
        } catch (error) {
            toast.error("Failed to change password", {
                description: error instanceof Error ? error.message : "An unexpected error occurred.",
                position: "top-right",
                className: "bg-red-500 text-white",
            });
        }
    });



    return (
        <div className="mx-auto ">

            <form className="space-y-4"

                onSubmit={onHandleSubmit}
            >
                {/* Current Password */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Current Password</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-slate-400">
                            <Lock size={18} />
                        </span>
                        <input
                            type={showCurrent ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            {...register('currentPassword', { required: { value: true, message: 'Current Password is required' } })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                            {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {
                        errors?.currentPassword && <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>
                    }
                </div>

                {/* New Password */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">New Password</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-slate-400">
                            <Lock size={18} />
                        </span>
                        <input
                            type={showNew ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            {...register('newPassword', { required: { value: true, message: 'New Password is required' } })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"

                        >
                            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {
                        errors?.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
                    }
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-slate-400">
                            <Lock size={18} />
                        </span>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full pl-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            {...register('confirmNewPassword', { required: { value: true, message: 'Confirm New Password is required' } })}
                        />
                        {
                            errors?.confirmNewPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmNewPassword.message}</p>
                        }
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-col gap-3">
                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-primary hover:bg-primary/80 text-white font-semibold py-2 rounded-lg transition shadow-lg shadow-primary/50 disabled:cursor-not-allowed disabled:bg-primary/50 disabled:hover:bg-primary/50 disabled:opacity-50"
                        disabled={changeMutation.isPending}
                    >

                        {changeMutation.isPending ? "Changing..." : "Change Password"}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-full bg-transparent hover:bg-slate-50 text-slate-600 font-medium py-2 rounded-lg transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordForm;