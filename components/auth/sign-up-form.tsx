"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "@/features/auth";
import { ROUTES } from "@/lib/constants/routes";
import { getApiErrorMessage } from "@/lib/services";
import type { RegisterPayload } from "@/types";
import { Loader2, ShieldCheck, Activity, Layers, Eye, EyeOff, XCircle } from "lucide-react";

type RegisterFormValues = RegisterPayload;

export function SignUpForm() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      terms: false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const { terms, ...payload } = values;
    await registerMutation.mutateAsync(payload);
    router.push(ROUTES.dashboardCommon.overview);
  });

  const errorMessage =
    registerMutation.error &&
    getApiErrorMessage(registerMutation.error, "Unable to create your account right now.");

  return (
    <div className="grid md:grid-cols-12 rounded-2xl overflow-hidden shadow-xl shadow-slate-100/40 dark:shadow-none w-full">
      
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

      {/* Right Column: Interactive Minimalist Sign Up UI */}
      <div className="md:col-span-7 p-6 py-12 flex flex-col justify-center bg-white dark:bg-slate-950">
        <div className="w-full max-w-90 mx-auto space-y-6">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Create account
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Use your email, name, and password to register.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {/* API Error Box */}
            {errorMessage && (
              <div className="text-[11px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/10 p-2.5 rounded-lg border border-rose-200/40 dark:border-rose-900/30 animate-fade-in flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your name"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-hidden focus:border-slate-400 dark:focus:border-slate-600 focus:ring-0 focus-visible:ring-0 focus-visible:outline-hidden transition-all disabled:opacity-50"
                disabled={registerMutation.isPending}
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name should be at least 2 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="text-[11px] font-medium text-rose-500 pl-0.5">{errors.name.message}</p>
              )}
            </div>

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
                disabled={registerMutation.isPending}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-[11px] font-medium text-rose-500 pl-0.5">{errors.email.message}</p>
              )}
            </div>

            {/* Completely Inlined Custom Minimal Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950 pl-3 pr-10 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-hidden focus:border-slate-400 dark:focus:border-slate-600 focus:ring-0 focus-visible:ring-0 focus-visible:outline-hidden transition-all disabled:opacity-50"
                  disabled={registerMutation.isPending}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
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

            {/* Checkbox to Accept Terms */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-start space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-200 dark:border-slate-800 text-slate-900 bg-slate-50/30 dark:bg-slate-950 focus:ring-0 focus:ring-offset-0 focus-visible:outline-hidden accent-slate-900 dark:accent-slate-100 cursor-pointer mt-0.5"
                  disabled={registerMutation.isPending}
                  {...register("terms", {
                    required: "You must accept the terms and conditions",
                  })}
                />
                <label htmlFor="terms" className="text-xs text-slate-500 dark:text-slate-400 leading-normal select-none">
                  I agree to the{" "}
                  <Link href={ROUTES.termsAndConditions} className="font-medium text-slate-800 dark:text-slate-300 hover:underline underline-offset-4">
                    terms and conditions
                  </Link>
                  .
                </label>
              </div>
              {errors.terms && (
                <p className="text-[11px] font-medium text-rose-500 pl-0.5">{errors.terms.message}</p>
              )}
            </div>

            {/* Submit Action */}
            <Button
              type="submit"
              className="w-full cursor-pointer h-10 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin stroke-[2.5]" />
                  <span>Creating account...</span>
                </>
              ) : (
                "Create account"
              )}
            </Button>

            {/* Footer Route */}
            <p className="text-xs text-center text-slate-400 dark:text-slate-500 pt-2">
              Already have an account?{" "}
              <Link href={ROUTES.signIn} className="font-semibold text-slate-800 dark:text-slate-300 hover:underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}