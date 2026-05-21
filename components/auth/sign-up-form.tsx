"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "@/features/auth";
import { ROUTES } from "@/lib/constants/routes";
import { getApiErrorMessage } from "@/lib/services";
import type { RegisterPayload } from "@/types";
import { Eye, EyeOff, Loader2, XCircle } from "lucide-react";
import { AuthShell } from "./auth-shell";

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
    <AuthShell
      badge="New workspace"
      title="Create a workspace your team can actually use."
      description="Set up Allocate for bookings, credits, notifications, and role-aware access in a few minutes."
      highlights={[
        "Start with a clean account flow designed for team onboarding.",
        "Assign credits, manage resources, and keep the org visible from day one.",
        "Move from signup to operational dashboards without extra setup noise.",
      ]}
      image={{
        src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80",
        alt: "Team workspace dashboard preview for new accounts",
      }}
    >
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Create account</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50">Sign up</h1>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Use your email, name, and password to register.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {errorMessage && (
            <div className="flex items-start gap-2 rounded-2xl border border-rose-200/70 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 shadow-sm dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
              <XCircle className="mt-0.5 size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="name" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your name"
              className="w-full rounded-2xl border border-slate-200/90 bg-white/80 px-4 py-3 text-sm text-slate-950 shadow-sm outline-hidden transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-50"
              disabled={registerMutation.isPending}
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name should be at least 2 characters",
                },
              })}
            />
            {errors.name && <p className="pl-0.5 text-xs font-medium text-rose-500">{errors.name.message}</p>}
          </div>

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
              disabled={registerMutation.isPending}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/,
                  message: "Enter a valid email",
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
                className="w-full rounded-2xl border border-slate-200/90 bg-white/80 px-4 py-3 pr-11 text-sm text-slate-950 shadow-sm outline-hidden transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-50"
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
                className="absolute right-3 inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-hidden dark:hover:bg-slate-900 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && <p className="pl-0.5 text-xs font-medium text-rose-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-2 pt-1">
            <label htmlFor="terms" className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
              <input
                id="terms"
                type="checkbox"
                className="mt-1 size-4 rounded border-slate-300 text-slate-950 focus:ring-0 focus:ring-offset-0 dark:border-slate-700 dark:accent-slate-100"
                disabled={registerMutation.isPending}
                {...register("terms", {
                  required: "You must accept the terms and conditions",
                })}
              />
              <span className="leading-6">
                I agree to the{" "}
                <Link href={ROUTES.termsAndConditions} className="font-semibold text-slate-900 underline underline-offset-4 dark:text-slate-100">
                  terms and conditions
                </Link>
                .
              </span>
            </label>
            {errors.terms && <p className="pl-0.5 text-xs font-medium text-rose-500">{errors.terms.message}</p>}
          </div>

          <Button
            type="submit"
            className="mt-1 h-11 w-full rounded-full bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              "Create account"
            )}
          </Button>

          <p className="pt-1 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link href={ROUTES.signIn} className="font-semibold text-slate-900 underline underline-offset-4 dark:text-slate-100">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </AuthShell>
  );
}