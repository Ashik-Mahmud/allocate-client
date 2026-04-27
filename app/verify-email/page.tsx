"use client"
import { verifyEmail } from '@/lib/services'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const VerifyEmail = () => {

    const searchParams = useSearchParams()
    const token = searchParams.get('token')


    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            return
        }

        const verifyToken = async () => {
            try {
                // Replace with your actual endpoint (e.g., /api/auth/verify)
                const response = await verifyEmail(token)
                if (!response.success) {
                    throw new Error('Verification failed')
                }
                setStatus('success')
                toast.success("Email verified successfully!")
            } catch (err) {
                console.error(err)
                setStatus('error')
                toast.error("Invalid or expired token.")
            }
        }

        verifyToken()
    }, [token])
    return (
        <div className="grid place-items-center min-h-screen bg-slate-50 dark:bg-zinc-950 p-4">
            <div className={cn(
                "relative flex flex-col items-center max-w-md w-full gap-6 rounded-3xl border bg-white p-12 text-center shadow-xl dark:bg-zinc-900",
                "animate-in fade-in zoom-in-95 duration-500",
                status === 'success' ? "border-emerald-200/60 dark:border-emerald-500/20" : "border-slate-200 dark:border-zinc-800"
            )}>

                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="size-12 animate-spin text-slate-400" />
                        <p className="text-slate-500">Verifying your email...</p>
                    </div>
                )}

                {status === 'success' && (
                    <>
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
                        <div className="relative bg-emerald-100 dark:bg-emerald-500/20 p-4 rounded-full">
                            <CheckCircle2 className="size-12 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Account Verified</h1>
                            <p className="text-sm text-slate-500 dark:text-zinc-400">
                                Your email has been successfully verified. You can safely close this window.
                            </p>
                        </div>
                        <button onClick={() => window.close()} className="text-sm font-semibold text-emerald-600 hover:underline">
                            Close Window
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="bg-red-100 dark:bg-red-500/10 p-4 rounded-full">
                            <AlertCircle className="size-12 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Verification Failed</h1>
                            <p className="text-sm text-slate-500 dark:text-zinc-400">
                                The link is invalid or has expired. Please request a new verification email.
                            </p>
                        </div>
                        <a href="/login" className="text-sm font-semibold text-slate-900 dark:text-white underline">
                            Back to Login
                        </a>
                    </>
                )}
            </div>
        </div>
    )
}

export default VerifyEmail