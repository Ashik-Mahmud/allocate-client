"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { useSignInMutation } from '@/features/auth';
import { ROUTES } from '@/lib/constants/routes';
import { getApiErrorMessage } from '@/lib/services';
import { Loader2, ShieldCheck, Activity, Layers, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

type Props = {};

const SignInForm = (props: Props) => {
    const router = useRouter();
    const loginMutation = useSignInMutation();
    const [showPassword, setShowPassword] = useState(false);
    
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = handleSubmit(async (data) => {
        await loginMutation.mutateAsync(data);
        router.push(ROUTES.dashboardCommon.overview);
    });

    const errorMessage =
        loginMutation.error &&
        getApiErrorMessage(loginMutation.error, "Unable to sign in right now.");

    return (
        <div className="grid md:grid-cols-12 rounded-2xl overflow-hidden shadow-xl shadow-slate-100/40 dark:shadow-none">
            
            {/* Left Column: Company Info & Platform Brand Identity */}
            <div className="md:col-span-5 bg-slate-50 dark:bg-slate-900/40 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-800/60">
                <div className="space-y-6">
                    {/* Brand Logo & Name */}
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                            A
                        </div>
                        <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 uppercase">
                            Allocate
                        </span>
                    </div>

                    {/* Value Proposition Description */}
                    <div className="space-y-2.5">
                        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                            Workforce Management & Smart Resource Optimization
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            A high-fidelity platform designed to orchestrate team operations, track real-time booking rules, and scale organizational productivity seamlessly.
                        </p>
                    </div>
                </div>

                {/* Micro Feature Highlights */}
                <div className="space-y-3 pt-6 border-t border-slate-200/60 dark:border-slate-800/40 hidden md:block">
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                        <Layers className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>Credit-Based Booking Architecture</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                        <Activity className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Granular Activity Audit Logs</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>Enterprise Role Visibility Isolation</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Interactive Minimalist Sign In UI */}
            <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white dark:bg-slate-950">
                <div className="w-full max-w-[320px] mx-auto space-y-6">
                    <div className="space-y-1">
                        <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                            Workspace Access
                        </h1>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            Identify yourself to resume operations.
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        {/* API Error Box */}
                        {errorMessage && (
                            <div className="text-[11px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/10 p-2.5 rounded-lg border border-rose-200/40 dark:border-rose-900/30 animate-fade-in">
                                {errorMessage}
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Business Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="name@company.com"
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-hidden focus:border-slate-400 dark:focus:border-slate-600 focus:ring-0 focus-visible:ring-0 focus-visible:outline-hidden transition-all disabled:opacity-50"
                                disabled={loginMutation.isPending}
                                {...register("email", {
                                    required: "Required",
                                    pattern: {
                                        value: /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/,
                                        message: "Invalid email",
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="text-[11px] font-medium text-rose-500 pl-0.5">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Completely Inlined Custom Minimal Password Field */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Password
                                </label>
                            </div>
                            <div className="relative flex items-center">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    disabled={loginMutation.isPending}
                                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950 pl-3 pr-10 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-hidden focus:border-slate-400 dark:focus:border-slate-600 focus:ring-0 focus-visible:ring-0 focus-visible:outline-hidden transition-all disabled:opacity-50"
                                    {...register("password", {
                                        required: "Required",
                                        minLength: {
                                            value: 6,
                                            message: "Min 6 characters",
                                        },
                                    })}
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors focus:outline-hidden"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4 stroke-[1.8]" />
                                    ) : (
                                        <Eye className="w-4 h-4 stroke-[1.8]" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-[11px] font-medium text-rose-500 pl-0.5">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit Action */}
                        <Button 
                            type="submit" 
                            className="w-full cursor-pointer h-10 text-xs font-semibold bg-primary text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 mt-2" 
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin stroke-[2.5]" />
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>

                        {/* Footer Route */}
                        <p className="text-xs text-center text-slate-400 dark:text-slate-500 pt-2">
                            Need a space?{" "}
                            <Link 
                                href="/sign-up" 
                                className="font-semibold text-slate-800 dark:text-slate-300 hover:underline underline-offset-4"
                            >
                                Request account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignInForm;