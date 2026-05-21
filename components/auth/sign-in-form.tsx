"use client";

import { useSignInMutation } from '@/features/auth';
import { ROUTES } from '@/lib/constants/routes';
import { getApiErrorMessage } from '@/lib/services';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { AuthShell } from './auth-shell';

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
        <AuthShell
            badge="Returning team"
            title="Sign in to keep operations moving."
            description="Resume bookings, credits, notifications, and staff workflows from the same workspace."
            highlights={[
                "Fast access to bookings, dashboards, and alerts.",
                "Role-based visibility for admin and staff accounts.",
                "Secure session handling with a clean handoff back to the product.",
            ]}
            image={{
                src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
                alt: "Allocate dashboard preview for returning users",
            }}
        >
            <div className="mx-auto w-full max-w-md space-y-6">
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Workspace access</p>
                    <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50">Sign in</h1>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        Use your business email and password to continue.
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4" noValidate>
                    {errorMessage && (
                        <div className="rounded-2xl border border-rose-200/70 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 shadow-sm dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
                            {errorMessage}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                            Business email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="name@company.com"
                            className="w-full rounded-2xl border border-slate-200/90 bg-white/80 px-4 py-3 text-sm text-slate-950 shadow-sm outline-hidden transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-50"
                            disabled={loginMutation.isPending}
                            {...register("email", {
                                required: "Required",
                                pattern: {
                                    value: /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/,
                                    message: "Invalid email",
                                },
                            })}
                        />
                        {errors.email && <p className="pl-0.5 text-xs font-medium text-rose-500">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                            Password
                        </label>
                        <div className="relative flex items-center">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                disabled={loginMutation.isPending}
                                className="w-full rounded-2xl border border-slate-200/90 bg-white/80 px-4 py-3 pr-11 text-sm text-slate-950 shadow-sm outline-hidden transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-50"
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
                                className="absolute right-3 inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-hidden dark:hover:bg-slate-900 dark:hover:text-slate-200"
                            >
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="pl-0.5 text-xs font-medium text-rose-500">{errors.password.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        className="mt-1 h-11 w-full rounded-full bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200"
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </Button>

                    <p className="pt-1 text-center text-xs text-slate-500 dark:text-slate-400">
                        Need an account?{" "}
                        <Link href={ROUTES.signUp} className="font-semibold text-slate-900 underline underline-offset-4 dark:text-slate-100">
                            Request access
                        </Link>
                    </p>
                </form>
            </div>
        </AuthShell>
    );
};

export default SignInForm;