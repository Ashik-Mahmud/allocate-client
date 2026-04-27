"use client";

import { CheckCircle2, Loader2, MailCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { useCurrentUser, useSendVerificationEmailMutation } from "@/features/auth/hooks";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type Props = {
    className?: string;
    pageName?: string;
    hideVerificationHeader?: boolean;
    type?: "inline" | "page";
};

const VerifyLoggedInUser = ({ className, pageName, hideVerificationHeader, type }: Props) => {
    const { user } = useCurrentUser();
    const sendVerificationEmailMutation = useSendVerificationEmailMutation();

    const isVerified = Boolean(user?.is_verified);
    const email = user?.email?.trim() || "your email";
    const isSending = sendVerificationEmailMutation.isPending;

    const handleSendVerificationEmail = async () => {
        try {
            const response = await sendVerificationEmailMutation.mutateAsync();
            toast.success(response.message || `Verification email sent to ${email}`, {
                position: "top-center",
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to send verification email";
            toast.error(message, { position: "top-center" });
        }
    };

    if (isVerified) {
        return (
            <div
                className={cn(
                    "inline-flex items-center gap-2 rounded-xl border border-emerald-300/70 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
                    className
                )}
            >
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Account verified
            </div>
        );
    }

    return (
        <div>
            {!hideVerificationHeader && type === "page" && (<div className="space-y-1 text-center mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    Verify your account to access {pageName}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    This section is restricted until your account is verified.
                </p>
            </div>)}
            <div
                className={cn(
                    "w-full rounded-xl border border-amber-300/80 bg-amber-50/90  text-left shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10",
                    type === "inline" ? "max-w-full flex  justify-between items-center px-2 py-1" : "max-w-lg mx-auto p-5",
                    className
                )}
            >
                <div className={cn(
                    "flex t gap-3",
                    type === "inline" ? "flex-col sm:flex-row items-center" : "flex-col justify-center items-center "

                )}>
                    <div className="rounded-xl bg-amber-100 p-2 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                        <ShieldAlert className={
                            cn(
                                "size-5",
                                type === "inline" ? "mx-auto" : "size-10"
                            )
                        } aria-hidden="true" />
                    </div>

                    <div className={
                        cn(
                            "text-center space-y-1.5",
                            type === "inline" ? "sm:text-left" : ""
                        )
                    }>
                        <p className={
                            cn(
                                "text-sm font-semibold text-amber-900 dark:text-amber-100",
                                type === "inline" ? "text-left" : "text-center text-3xl"
                            )
                        }>Verify your account</p>
                        <p className={
                            cn(
                                "text-xs leading-5 text-amber-800/90 dark:text-amber-200/90",
                                type === "inline" ? "text-left" : "text-center text-sm"
                            )
                        }>
                            We will send a verification link to <span className="font-semibold">{email}</span>.
                            Verify once to unlock protected actions.
                        </p>
                    </div>
                </div>

                <div className={cn(
                    "mt-4 flex gap-2",
                    type === "inline" ? "justify-end items-end flex-col" : "flex-col justify-center items-center"
                )}>
                    <Button
                        type="button"
                        onClick={handleSendVerificationEmail}
                        disabled={isSending}
                        className="h-8 rounded-lg bg-amber-600 px-3 text-xs font-semibold text-white hover:bg-amber-700 disabled:bg-amber-600/70"
                    >
                        {isSending ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : <MailCheck className="size-3.5" aria-hidden="true" />}
                        {isSending ? "Sending..." : "Send verification email"}
                    </Button>

                    <p className="text-[11px] text-amber-700/90 dark:text-amber-300/90">You can request a new email if the previous one expired.</p>
                </div>
            </div>
        </div>
    );
};

export default VerifyLoggedInUser