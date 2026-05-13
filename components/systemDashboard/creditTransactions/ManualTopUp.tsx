
"use client"

import React, { useState, useEffect } from 'react'
import {
    CreditCard,
    Building2,
    ChevronRight,
    ArrowLeft,
    CheckCircle2,
    DollarSign,
    Wallet,
    Loader2,
    RefreshCcw,
    Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { SearchableSelect } from '@/components/shared/searchable-select'
import { fetchOrganizations } from '@/lib/services/system'
import { useTopUpCreditsMutation } from '@/features/system/hooks'
import { DatePickerField } from '@/components/shared/datePickerField';
import { Organizations } from '@/types/organization';
import { format } from 'date-fns';

type Props = {
    orgId?: string;
    onSuccess?: () => void;
}

const ManualTopUp = ({ orgId, onSuccess }: Props) => {

    const [step, setStep] = useState<'form' | 'summary' | 'success'>('form');
    const [loading, setLoading] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<{ value: string; label: string; metadata?: Record<string, any> } | null>(null);
    const [formData, setFormData] = useState({ credits: 0, price: 0, extendDate: undefined as Date | undefined });
    const [searchedOrgs, setSearchedOrgs] = useState<{ value: string; label: string; metadata?: Record<string, any> }[]>([]);

    const topUpMutation = useTopUpCreditsMutation();


    const handleSearch = async (search: string) => {
        try {
            const result = await fetchOrganizations({
                name: search,
                limit: 10,
                showDeletedOrg: false,
                ...(orgId ? { organizationId: orgId } : {})
            });
            const processed = result?.data?.map((org: Organizations) => ({
                value: org.id,
                label: org.name,
                metadata: {
                    ...org?.subscription
                }
            }));
            setSearchedOrgs(processed || []);

        } catch (error) {
            console.error('Error fetching organizations:', error);
        }
    };

    // Initial search to populate dropdown
    useEffect(() => {
        handleSearch("");

    }, []);

    useEffect(() => {
        if (orgId && searchedOrgs.length > 0) {
            const preselected = searchedOrgs.find(org => org.value === orgId);
            if (preselected) {
                setSelectedOrg(preselected);
                setFormData(p => ({
                    ...p,
                    extendDate: preselected.metadata?.end_date ? new Date(preselected.metadata.end_date) : undefined
                }));
            }
        }
    }, [orgId, searchedOrgs]);

    const handleFinalSubmit = async () => {
        if (!selectedOrg && !orgId) return;
        setLoading(true);
        try {
            const result = await topUpMutation.mutateAsync({
                orgId: orgId || selectedOrg?.value || "",
                data: {
                    credits: formData.credits,
                    price: formData.price,
                    extendDate: formData.extendDate ? formData.extendDate.toISOString() : undefined
                }
            });
            if (result?.success) {
                setStep('success');
            }
        } catch (error) {
            console.error("Top-up failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const isNextDisabled = (!orgId && !selectedOrg) || formData.credits <= 0;

    return (
        <div className="w-full max-w-xl mx-auto flex flex-col min-h-120 py-4">
            {/* Header / Stepper Area */}
            <div className="px-6 text-center mb-8">
                <div className={cn(
                    "inline-flex items-center justify-center h-14 w-14 rounded-2xl mb-4 transition-all duration-500",
                    step === 'success' ? "bg-green-50 dark:bg-green-500/10" : "bg-blue-50 dark:bg-blue-500/10"
                )}>
                    {step === 'success' ? (
                        <CheckCircle2 className="text-green-500 animate-in zoom-in duration-300" size={28} />
                    ) : (
                        <Wallet className="text-blue-600 dark:text-blue-400" size={26} />
                    )}
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {step === 'form' && "Configure Top-Up"}
                    {step === 'summary' && "Confirm Transfer"}
                    {step === 'success' && "Credits Delivered"}
                </h2>

                {/* Visual Step Dots */}
                <div className="flex items-center justify-center gap-2 mt-4">
                    <StepDot active={step === 'form'} done={step !== 'form'} />
                    <div className="w-6 h-px bg-slate-100 dark:bg-slate-800" />
                    <StepDot active={step === 'summary'} done={step === 'success'} />
                    <div className="w-6 h-px bg-slate-100 dark:bg-slate-800" />
                    <StepDot active={step === 'success'} done={step === 'success'} />
                </div>
            </div>

            {/* View Switching */}
            <div className="flex-1 px-6 pb-6">
                {step === 'form' && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 ml-1">Recipient Organization</label>
                            <SearchableSelect
                                options={searchedOrgs}
                                value={orgId || selectedOrg?.value}
                                placeholder="Select an organization..."
                                onSearchChange={handleSearch}
                                onChangeWithOption={(opt: any) => {
                                    setSelectedOrg(opt as any);
                                    setFormData(p => ({ ...p, extendDate: opt?.metadata?.end_date ? new Date(opt?.metadata?.end_date) : undefined })) // reset price when org changes
                                }}
                                onChange={(value) => { }}
                                emptyMessage="Search to select an orgnaization"
                                inputClassName="h-13 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40"
                                icon={<Building2 className="h-4 w-4 text-slate-400" />}
                            />
                        </div>

                        <div>
                            <DatePickerField
                                label="Extend Expiry Date (Optional)"
                                value={formData.extendDate}
                                onChange={(date) => setFormData(p => ({ ...p, extendDate: date }))}
                                placeholder="Pick a date"
                                inputClassName="text-left justify-start h-13 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40"
                                disableDays={(date) => date < new Date(selectedOrg?.metadata?.end_date)}

                            />
                            {
                                selectedOrg?.metadata?.end_date && (
                                    <p className="mt-1 text-xs text-rose-800 dark:text-slate-400">
                                        Current Subscription Expiry: {format(new Date(selectedOrg.metadata.end_date), "MMMM dd, yyyy")}
                                    </p>
                                )
                            }
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputBlock
                                label="Credit Count"
                                icon={RefreshCcw}
                                placeholder="1000"
                                value={formData.credits}
                                onChange={(v: any) => setFormData(p => ({ ...p, credits: Number(v) }))}
                            />
                            <InputBlock
                                label="Charge Amount"
                                icon={DollarSign}
                                placeholder="10.00"
                                value={formData.price}
                                onChange={(v: any) => setFormData(p => ({ ...p, price: Number(v) }))}
                            />
                        </div>

                        <button
                            onClick={() => setStep('summary')}
                            disabled={isNextDisabled}
                            className="w-full mt-6 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-bold transition-all hover:bg-slate-800 dark:hover:bg-blue-500 active:scale-[0.98] disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-2 group"
                        >
                            Review Summary
                            <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                )}

                {step === 'summary' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-3 duration-300">
                        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/30 overflow-hidden shadow-sm">
                            <div className="p-6 space-y-1">
                                <SummaryRow label="Entity" value={selectedOrg?.label || "Selected Organization"} icon={Building2} />
                                <SummaryRow label="Credit Package" value={`${formData.credits.toLocaleString()} CR`} icon={CreditCard} />
                                {
                                    formData.extendDate && <SummaryRow label="Expiry Date" value={`${formData.extendDate ? format(formData.extendDate, "MMMM dd, yyyy") : 'N/A'}`} icon={Calendar} />
                                }

                                <SummaryRow label="Total Value" value={`$${formData.price.toFixed(2)}`} icon={DollarSign} isLast />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                onClick={handleFinalSubmit}
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:shadow-xl hover:shadow-blue-500/20 disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                                {loading ? "Processing..." : "Confirm & Deliver"}
                            </button>

                            <button
                                onClick={() => {
                                    setStep('form');

                                }}
                                disabled={loading}
                                className="w-full py-2 text-slate-400 text-xs font-bold hover:text-slate-900 dark:hover:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                            >
                                <ArrowLeft size={14} /> Back to details
                            </button>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95 duration-500">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-65 leading-relaxed">
                            The transfer was successful. <span className="font-bold text-slate-900 dark:text-white">{formData.credits} credits</span> have been added to the balance exchange of ${formData.price.toFixed(2)}.
                        </p>
                        <button
                            onClick={() => {
                                setStep('form')
                                setFormData({ credits: 0, price: 0, extendDate: undefined })
                                setSelectedOrg(null)
                                handleSearch("");

                            }}
                            className="mt-10 px-10 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-[0.95]"
                        >
                            Top up another account
                        </button>
                        <button
                            onClick={() => onSuccess?.()}
                            className="mt-4 px-10 py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-xs hover:bg-blue-500 transition-all active:scale-[0.95]"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

// --- Sub-components ---

const StepDot = ({ active, done }: { active: boolean; done: boolean }) => (
    <div className={cn(
        "h-2 rounded-full transition-all duration-500",
        active ? "bg-blue-600 w-6" : done ? "bg-blue-400 w-2" : "bg-slate-200 dark:bg-slate-800 w-2"
    )} />
)

const InputBlock = ({ label, icon: Icon, placeholder, onChange, value }: any) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 ml-1">{label}</label>
        <div className="relative group">
            <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input
                type="number"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-10 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-sm font-black outline-none focus:ring-4 ring-blue-500/5 focus:border-blue-500/20 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                min={0}
            />
        </div>
    </div>
)

const SummaryRow = ({ label, value, icon: Icon, isLast }: any) => (
    <div className={cn("flex items-center justify-between py-4", !isLast && "border-b border-slate-50 dark:border-slate-800/40")}>
        <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 border border-slate-100/50 dark:border-slate-800">
                <Icon size={18} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</span>
        </div>
        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{value}</span>
    </div>
)

export default ManualTopUp;