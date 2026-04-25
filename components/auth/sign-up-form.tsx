"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "@/features/auth";
import { ROUTES } from "@/lib/constants/routes";
import { getApiErrorMessage } from "@/lib/services";
import type { RegisterPayload } from "@/types";
import PasswordField from "../ui/passwordField";

type RegisterFormValues = RegisterPayload;

export function SignUpForm() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();

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
    router.push(ROUTES.dashboard);
  });

  const errorMessage =
    registerMutation.error &&
    getApiErrorMessage(registerMutation.error, "Unable to create your account right now.");

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Create account</h1>
        <p className="text-sm text-slate-600">Use your email, name, and password to register.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Enter your name"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name should be at least 2 characters",
            },
          })}
        />
        {errors.name ? <p className="text-xs text-red-600">{errors.name.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/,
              message: "Enter a valid email",
            },
          })}
        />
        {errors.email ? <p className="text-xs text-red-600">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <PasswordField
          id="password"
          label="Password"
          placeholder="Enter your password"
          error={errors?.password?.message}
          showPasswordToggle
          showPasswordStrength
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
      </div>



      {/* checkbox to accept terms */}
      <div className="flex items-center space-x-2">
        <input
          id="terms"
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
          {...register("terms", {
            required: "You must accept the terms and conditions",
          })}
        />
        <label htmlFor="terms" className="text-sm text-slate-600">
          I agree to the{" "}
          <a href="#" className="text-slate-900 underline">
            terms and conditions
          </a>
          .
        </label>
      </div>
      {errors.terms ? <p className="text-xs text-red-600">{errors.terms.message}</p> : null}

      <Button type="submit" className="w-full cursor-pointer py-5!" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href={ROUTES.signIn} className="font-medium text-slate-900 underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
