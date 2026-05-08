"use client";

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreditCard, Landmark, ArrowRight, Check, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { PlanType } from '@/types/organization';
import { cn } from '@/lib/utils/cn';
import { useDetectCountry } from '@/hooks/use-detect-country';

export const CreateCheckoutSchema = z.object({
    months: z.coerce.number().int().positive("Please enter a valid month"),
    planType: z.enum([PlanType.PRO, PlanType.ENTERPRISE]),
    currency: z.enum(['BDT', 'USD']),
    paymentGateway: z.enum(['stripe', 'sslcommerz']),
});

type PaymentFormValues = z.infer<typeof CreateCheckoutSchema>;

const MONTH_OPTIONS = [
    { label: "1 Month", value: 1 },
    { label: "3 Months", value: 3 },
    { label: "6 Months", value: 6 },
    { label: "12 Months", value: 12 },
    { label: "Other", value: "custom" },
];

const PaymentForm = ({ currentPlan, onSuccess }: { currentPlan: PlanType; onSuccess: () => void }) => {

    const { currency } = useDetectCountry();
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<number | "custom">(1);

    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(CreateCheckoutSchema as any),
        defaultValues: {
            months: 1,
            planType: currentPlan === PlanType.PRO ? PlanType.PRO : PlanType.ENTERPRISE,
            currency: 'USD',
            paymentGateway: 'stripe',
        },
    });

    async function onSubmit(values: PaymentFormValues) {
        setLoading(true);
        console.log(values);
        // Integrate your payment trigger here
        setTimeout(() => {
            setLoading(false);
            onSuccess();
        }, 2000);
    }

    const gateway = form.watch("paymentGateway");

    return (
        <div className="w-full  mx-auto py-6 px-4  h-full">
            <CardContent className="p-0 h-full ">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col h-full">

                    <div className="space-y-6 flex-1">
                        {/* Month Selector Chips */}
                        <div className="space-y-3">
                            <label className=" text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Duration</label>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {MONTH_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.label}
                                        type="button"
                                        onClick={() => {
                                            setSelectedMonth(opt.value as any);
                                            if (opt.value !== "custom") {
                                                form.setValue("months", opt.value as number);
                                            }
                                        }}
                                        className={cn(
                                            "flex-1 cursor-pointer min-w-20 py-2 px-3 rounded-lg text-sm font-medium border transition-all duration-200",
                                            selectedMonth === opt.value
                                                ? "bg-primary text-primary-foreground border-primary shadow-sm dark:bg-indigo-900/30 dark:border-indigo-900"
                                                : "bg-background dark:bg-slate-800 dark:border-slate-900 border-input hover:border-primary/50"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Month Input - Conditional */}
                            {selectedMonth === "custom" && (
                                <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-4.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            placeholder="Enter number of months"
                                            className="pl-9 rounded-xl py-6! "
                                            {...form.register("months")}
                                            min={1}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Payment Method - Minimalist Cards */}
                        <div className="space-y-3 ">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment Method</label>
                            <RadioGroup
                                onValueChange={(val) => {
                                    form.setValue("paymentGateway", val as any);
                                    form.setValue("currency", val === "stripe" ? "USD" : "BDT");
                                }}
                                defaultValue={form.getValues("paymentGateway")}
                                className="grid grid-cols-2 gap-3"
                            >
                                {[
                                    { id: "stripe", label: "Stripe", icon: CreditCard, sub: "Cards, Apple Pay" },
                                    { id: "sslcommerz", label: "Local", icon: Landmark, sub: "Bkash, Nagad, Bank" }
                                ].map((method) => (
                                    <label
                                        key={method.id}
                                        className={cn(
                                            "relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all",
                                            gateway === method.id
                                                ? "border-primary bg-primary/10 dark:bg-indigo-900/30 dark:border-indigo-900"
                                                : "border-muted bg-transparent hover:bg-accent dark:bg-slate-800 dark:border-slate-700",
                                            currency === "USD" && method.id === "sslcommerz" ? "cursor-not-allowed opacity-50" : ""
                                        )}
                                    >
                                        <RadioGroupItem value={method.id} className="sr-only" />
                                        <method.icon className={cn("h-5 w-5 mb-2", gateway === method.id ? "text-primary dark:text-indigo-400" : "text-muted-foreground")} />
                                        <span className="font-bold text-sm">{method.label}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase">{method.sub}</span>
                                        {gateway === method.id && (
                                            <div className="absolute top-2 right-2">
                                                <div className="bg-primary dark:bg-indigo-800 rounded-full p-0.5">
                                                    <Check className="h-3 w-3 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </label>
                                ))}
                            </RadioGroup>
                        </div>
                    </div>

                    <Button type="submit" className="cursor-pointer w-full mt-auto rounded-xl py-6 text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] dark:bg-indigo-900" disabled={loading}>
                        {loading ? "Initializing..." : `Pay in ${form.watch("currency")}`}
                        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                </form>
            </CardContent>


        </div>
    );
};

export default PaymentForm;