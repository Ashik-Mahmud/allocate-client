"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from '@/features/auth';
import useCountries from '@/hooks/use-countries';
import { useCreateSalesInquiry } from '@/features/sales/hooks';
import { getApiErrorMessage } from '@/lib/services/http';
import { CreateSalesInquiryDto } from '@/types/sales';

// Comprehensive country list (Shortened for brevity, but you can expand this array)
const backupCountries = [
    "Bangladesh", "United States", "United Kingdom", "Canada", "Australia",
    "Germany", "France", "United Arab Emirates", "India", "Singapore", "Japan"
].sort();

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    business_email: z.string().email("Invalid business email"),
    phone: z.string().optional(),
    team_size: z.string().min(1, "Select team size"),
    country: z.string().min(1, "Select a country"),
    message: z.string().min(10, "Message too short"),
});

type FormValues = z.infer<typeof formSchema>;

const ContactSalesForm = () => {
    const { user } = useCurrentUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const { countries, countryStatus, isLoading } = useCountries();

    // Default values (Pre-filled for user convenience)
    const countryName = (user?.organization?.address as any)?.country || "United States";
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema as any),
        defaultValues: {
            name: user?.name || "",
            business_email: user?.organization?.business_email || "ashik@example.com",
            country: countryName,
            team_size: "1-10",
        }
    });
    const saleMutation = useCreateSalesInquiry();

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const sendingData = {
                name: data.name,
                business_email: data.business_email,
                phone: data.phone,
                country: data.country,
                team_size: (data.team_size),
                message: data.message,
                org_id: user?.org_id || "",
            }
            const result = await saleMutation.mutateAsync(sendingData as CreateSalesInquiryDto);
            if (result?.success) {
                toast.success("Inquiry sent successfully!", {
                    description: "Our sales team will get back to you soon.",
                    action: (<Button variant="outline" size="sm" onClick={() => setIsSuccess(false)}>
                        Send Another
                    </Button>
                    )
                });
                setIsSuccess(true);
                reset();
            }

        } catch (error) {
            // console.log(error);
            const message = getApiErrorMessage(error, "Failed to send. Please try again.");
            setSubmitError(message);
            toast.error("Failed to send.", {
                description: message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500">
                <CheckCircle2 className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-semibold text-foreground">Talk soon!</h2>
                <p className="text-muted-foreground mt-2">Your request is in our inbox.</p>
                <Button variant="ghost" className="mt-6" onClick={() => setIsSuccess(false)}>
                    Send another inquiry
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground dark:text-white">
                        Full Name
                        <small className="text-destructive">*</small>
                    </Label>
                    <Input
                        {...register('name')}
                        placeholder="Your Name"
                        className="w-full h-11 bg-background border-input ring-offset-background focus-visible:ring-2 focus-visible:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    />
                    {errors.name && <span className="text-[11px] text-destructive">{errors.name.message}</span>}
                </div>

                {/* Email */}
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground dark:text-white">
                        Business Email
                        <small className="text-destructive">*</small>
                    </Label>
                    <Input
                        {...register('business_email')}
                        type="email"
                        placeholder="name@company.com"
                        className="w-full h-11 bg-background border-input focus-visible:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white "
                    />
                    {errors.business_email && <span className="text-[11px] text-destructive">{errors.business_email.message}</span>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="grid w-full items-center gap-1.5">
                    <Label className="text-sm font-medium text-foreground dark:text-white">Phone Number</Label>
                    <Input
                        {...register('phone')}
                        placeholder="+880..."
                        className="w-full h-11 bg-background border-input focus-visible:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    />
                    {errors.phone && <span className="text-[11px] text-destructive">{errors.phone.message}</span>}
                </div>

                {/* Country */}
                <div className="grid w-full items-center gap-1.5">
                    <Label className="text-sm font-medium text-foreground dark:text-white">
                        Country
                        <small className="text-destructive">*</small>
                    </Label>
                    <Select onValueChange={(v) => setValue('country', v)} defaultValue={countryName}>
                        <SelectTrigger className="w-full p-5! bg-background border-input focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white">
                            <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent className="max-h-75" >
                            {
                                isLoading ? <Loader2 className="animate-spin" /> : (countries || backupCountries).map(c => (
                                    <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>
                                ))
                            }

                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Team Size */}
            <div className="grid w-full items-center gap-1.5">
                <Label className="text-sm font-medium text-foreground dark:text-white">
                    Team Size
                    <small className="text-destructive">*</small>
                </Label>
                <Select onValueChange={(v) => setValue('team_size', v)} defaultValue="1-10" >
                    <SelectTrigger className="w-full p-5! bg-background border-input  dark:bg-slate-800 dark:border-slate-600 dark:text-white">
                        <SelectValue placeholder="Company Size" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-100">51-100 employees</SelectItem>
                        <SelectItem value="100+">100+ employees</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Message */}
            <div className="grid w-full gap-1.5">
                <Label className="text-sm font-medium text-foreground dark:text-white">
                    How can we help?
                    <small className="text-destructive">*</small>
                </Label>
                <Textarea
                    {...register('message')}
                    placeholder="Tell us about your needs..."
                    className="w-full min-h-30 bg-background border-input dark:bg-slate-800 dark:border-slate-600 dark:text-white focus-visible:ring-primary resize-none"
                />
                {errors.message && <span className="text-[11px] text-destructive">{errors.message.message}</span>}
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer h-12 text-md font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm"
            >
                {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" /> Get in Touch
                    </span>
                )}
            </Button>

            {submitError ? (
                <p className="text-center text-sm text-destructive whitespace-pre-line">
                    {submitError}
                </p>
            ) : null}

            <p className="text-center text-[11px] text-muted-foreground">
                Secure 256-bit SSL encrypted connection.
            </p>
        </form>
    );
};

export default ContactSalesForm;