"use client";

import React, { useEffect } from 'react';
import { useSearchParams, useRouter, redirect } from 'next/navigation';
import { CheckCircle2, XCircle, AlertCircle, ArrowLeft, ReceiptText } from 'lucide-react';
import { Button } from "@/components/ui/button"; // Standard shadcn button or replace with <button>
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from '@/lib/constants/routes';

const SSLPaymentStatusPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const status = searchParams.get('payment'); // success, fail, or cancel
    const transactionId = searchParams.get('tran_id'); // Optional transaction ID for success case

    // Configuration based on status
    const statusConfig = {
        success: {
            icon: <CheckCircle2 className="w-16 h-16 text-green-500" />,
            title: "Payment Successful!",
            description: "Your transaction has been completed successfully. You can find your invoice in the billing section.",
            borderColor: "border-green-500"
        },
        fail: {
            icon: <XCircle className="w-16 h-16 text-red-500" />,
            title: "Payment Failed",
            description: "Unfortunately, your payment could not be processed. Please try again or contact support.",
            borderColor: "border-red-500"
        },
        cancel: {
            icon: <AlertCircle className="w-16 h-16 text-amber-500" />,
            title: "Payment Cancelled",
            description: "You have cancelled the payment process. No charges were applied to your account.",
            borderColor: "border-amber-500"
        }
    };

    const currentStatus = statusConfig[status as keyof typeof statusConfig] || statusConfig.fail;

    if (!status) {
        // If no status is provided, redirect to billing page
        redirect(ROUTES.home);
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/20 p-4">
            <Card className={`w-full max-w-md border-t-8 ${currentStatus.borderColor} shadow-xl bg-white`}>
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        {currentStatus.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800">
                        {currentStatus.title}
                    </CardTitle>
                </CardHeader>

                <CardContent className="text-center space-y-4">
                    <p className="text-slate-600 leading-relaxed">
                        {currentStatus.description}
                    </p>

                    {status === 'success' && (
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-500">
                            TRANSACTION ID: {transactionId || "NOT AVAILABLE"}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col gap-3 pt-6">
                    <Button
                        onClick={() => router.push(ROUTES.dashboardOrgAdmin.billing)}
                        className="cursor-pointer w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary text-white py-6"
                    >
                        <ReceiptText className="w-4 h-4" />
                        Go to Billing
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={() => router.push('/')}
                        className="cursor-pointer w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default SSLPaymentStatusPage;