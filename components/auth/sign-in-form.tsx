"use client";
import React from 'react'
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form'
import PasswordField from '../ui/passwordField';
import { Button } from '../ui/button';
import { useSignInMutation } from '@/features/auth';
import { ROUTES } from '@/lib/constants/routes';
import { getApiErrorMessage } from '@/lib/services';

type Props = {}

const SignInForm = (props: Props) => {
    const router = useRouter();
    const loginMutation = useSignInMutation();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = handleSubmit(async (data) => {
        await loginMutation.mutateAsync(data);
        router.push(ROUTES.dashboardCommon.overview);
    })

    const errorMessage =
        loginMutation.error &&
        getApiErrorMessage(loginMutation.error, "Unable to sign in right now.");

    return (
        <div>
            <form className='space-y-5'
                onSubmit={onSubmit}
            >
                <div className="title">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Sign in</h1>
                    <p className="text-sm text-slate-600 dark:text-slate-500">
                        Use your email and password to sign in.
                    </p>

                </div>
                {errorMessage && (
                    <p className="text-sm text-red-500">
                        {errorMessage}
                    </p>
                )}
                <div className="input-group">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Enter your email"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:placeholder:text-slate-500 dark:text-slate-400"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/,
                                message: "Enter a valid email",
                            },
                        })}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <PasswordField
                    id="password"
                    label="Password"
                    placeholder="Enter your password"
                    error={errors?.password?.message}
                    showPasswordToggle={true}
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                        },
                    })}
                />

                <Button type="submit" className="w-full cursor-pointer py-5!" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? "Signing in..." : "Sign in"}
                </Button>



                <p className="text-sm text-center text-slate-600">
                    Don't have an account? <a href="/sign-up" className="text-slate-900 dark:text-slate-400 hover:underline">Sign up</a>
                </p>
            </form>
        </div>
    )
}

export default SignInForm