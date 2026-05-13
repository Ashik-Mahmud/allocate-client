"use client"
import React, { useState } from 'react'
import { 
  ShieldCheck, 
  Clock, 
  Coins, 
  RefreshCcw, 
  Scale, 
  Mail,
  CalendarDays,
  ChevronRight,
  Zap,
  Lock
} from 'lucide-react';
import { ThemeToggle } from '../shared/theme-toggle';
import useGlobalSettings from '@/hooks/use-global-settings';

const GLOBAL_CONFIG = {
    FREE_PLAN_DURATION_DAYS: 30,
    FREE_PLAN_CREDITS: 100,
    VERIFICATION_TOKEN_EXPIRY_MINUTES: 60,
    MINMUM_HOURLY_RATE: 5,
    REFUND_POLICY: {
        FULL_REFUND_IF_CANCELLED_WITHIN: 1,
        PARTIAL_REFUND_IF_CANCELLED_WITHIN: 0.5,
    },
    WEEKEND_DAYS: ['Saturday', 'Sunday'],
}

type Props = {}

const TermsAndServiceComponent = (props: Props) => {
    const {supportEmail} = useGlobalSettings();
    const companyName = "Allocate";
    const contactEmail = supportEmail || "ashikmahmud187@gmail.com";
    const [activeSection, setActiveSection] = useState('agreement');

    // Smooth scroll handler
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveSection(id);
        }
    };

    const navItems = [
        { id: 'agreement', label: 'User Agreement' },
        { id: 'credits', label: 'Credits & Refills' },
        { id: 'bookings', label: 'Booking Rules' },
        { id: 'refunds', label: 'Refund Policy' },
        { id: 'privacy', label: 'Security & Privacy' }
    ];
    return (
        <div>
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-200 selection:bg-blue-100 dark:selection:bg-blue-900/30">
                {/* Fixed Header */}
                <header className="border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <div className="bg-blue-600 rounded-lg p-1 transition-transform group-hover:rotate-12">
                                <Zap className="w-5 h-5 text-white fill-current" />
                            </div>
                            <span className="font-bold text-xl tracking-tighter">{companyName}</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href={`mailto:${contactEmail}`} className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-blue-600 transition-colors">
                                <Mail className="w-4 h-4" />
                                {contactEmail}
                            </a>
                            <button className="bg-slate-900 dark:bg-white dark:text-black text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all">
                                Get Support
                            </button>
                            <ThemeToggle floating={false} />
                        </div>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto px-6 pt-12 pb-24 flex flex-col lg:flex-row gap-16">
                    {/* Sticky Sidebar Navigation */}
                    <aside className="lg:w-64 shrink-0">
                        <div className="sticky top-28 space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-6 px-4">Documentation</p>
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${activeSection === item.id
                                            ? 'bg-blue-50 dark:bg-blue-600/10 text-blue-600 border border-blue-100 dark:border-blue-600/20 shadow-sm'
                                            : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500'
                                        }`}
                                >
                                    {item.label}
                                    {activeSection === item.id && <ChevronRight className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Content Section */}
                    <div className="flex-1 max-w-3xl space-y-24">
                        {/* Section: Agreement */}
                        <section id="agreement" className="scroll-mt-32">
                            <h1 className="text-5xl font-black tracking-tight mb-6">Terms of Service</h1>
                            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                                This agreement governs your use of <span className="text-black dark:text-white font-semibold">{companyName}</span>.
                                Our platform is designed to provide smart, automated resource management tools for organizations.
                                By creating an account, you agree to abide by these operating standards.
                            </p>
                        </section>

                        {/* Section: Credits & Refills */}
                        <section id="credits" className="scroll-mt-32 p-8 rounded-3xl border-2 border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Coins className="w-24 h-24" />
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <Coins className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold italic">The Free Forever Guarantee</h2>
                            </div>
                            <div className="space-y-4 relative z-10">
                                <p className="text-3xl font-black tracking-tight">
                                    {GLOBAL_CONFIG.FREE_PLAN_CREDITS} Credits Allocated Monthly
                                </p>
                                <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                                    At <span className="font-semibold">{companyName}</span>, we believe in supporting growing teams.
                                    Your account will be automatically credited with <strong>100 tokens</strong> on the <span className="text-blue-600 font-bold underline decoration-2 underline-offset-4">1st day of every month</span>.
                                </p>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <span className="bg-white dark:bg-white/10 px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-slate-200 dark:border-white/10">Refills Every 30 Days</span>
                                    <span className="bg-white dark:bg-white/10 px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-slate-200 dark:border-white/10">No Credit Card Required</span>
                                    <span className="bg-white dark:bg-white/10 px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-slate-200 dark:border-white/10">Non-expiring Tier</span>
                                </div>
                            </div>
                        </section>

                        {/* Section: Booking Rules */}
                        <section id="bookings" className="scroll-mt-32 space-y-6">
                            <h2 className="text-3xl font-bold flex items-center gap-3">
                                <CalendarDays className="w-8 h-8 text-slate-400" />
                                Smart Scheduling Rules
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                    <h4 className="font-bold mb-2">Hourly Rates</h4>
                                    <p className="text-sm text-slate-500">The minimum booking rate is set at <span className="font-bold text-slate-900 dark:text-white">CR{GLOBAL_CONFIG.MINMUM_HOURLY_RATE}/hr</span> to ensure sustainable resource usage.</p>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                    <h4 className="font-bold mb-2">Weekend Policy</h4>
                                    <p className="text-sm text-slate-500">Active weekends: <span className="font-bold text-slate-900 dark:text-white">{GLOBAL_CONFIG.WEEKEND_DAYS.join(' & ')}</span>. Premium resource support you could update your working hours and weekends.</p>
                                </div>
                            </div>
                        </section>

                        {/* Section: Refunds */}
                        <section id="refunds" className="scroll-mt-32 space-y-6">
                            <h2 className="text-3xl font-bold flex items-center gap-3">
                                <RefreshCcw className="w-8 h-8 text-slate-400" />
                                Fair Refund Policy
                            </h2>
                            <p className="text-slate-500 text-sm">Cancellations are managed dynamically based on the booking start time.</p>
                            <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl shadow-black/5">
                                <div className="grid grid-cols-2 bg-slate-50 dark:bg-white/5 p-4 border-b border-slate-200 dark:border-white/10 text-xs font-black uppercase tracking-widest">
                                    <div>Cancellation Window</div>
                                    <div className="text-right">Eligibility</div>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-white/5">
                                    <div className="grid grid-cols-2 p-5 text-sm">
                                        <div className="font-medium">{GLOBAL_CONFIG.REFUND_POLICY.FULL_REFUND_IF_CANCELLED_WITHIN} Hour before start</div>
                                        <div className="text-right font-bold text-green-500">100% Refund</div>
                                    </div>
                                    <div className="grid grid-cols-2 p-5 text-sm">
                                        <div className="font-medium">{GLOBAL_CONFIG.REFUND_POLICY.PARTIAL_REFUND_IF_CANCELLED_WITHIN * 60} Minutes before start</div>
                                        <div className="text-right font-bold text-amber-500">50% Refund</div>
                                    </div>
                                    <div className="grid grid-cols-2 p-5 text-sm bg-red-50/50 dark:bg-red-500/5">
                                        <div className="text-slate-400 italic">Less than 30 minutes</div>
                                        <div className="text-right font-bold text-red-500">No Refund</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section: Privacy */}
                        <section id="privacy" className="scroll-mt-32 space-y-6">
                            <h2 className="text-3xl font-bold flex items-center gap-3">
                                <Lock className="w-8 h-8 text-slate-400" />
                                Data & Security
                            </h2>
                            <div className="bg-slate-900 text-white p-8 rounded-[2rem] space-y-4">
                                <ShieldCheck className="w-10 h-10 text-blue-400" />
                                <h3 className="text-xl font-bold">Encrypted Session Tokens</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    To protect your organization's sensitive resource data, {companyName} enforces strict token rotation.
                                    All verification and session links automatically expire after <strong>{GLOBAL_CONFIG.VERIFICATION_TOKEN_EXPIRY_MINUTES} minutes</strong>.
                                    We utilize AES-256 encryption for all stored resource configurations.
                                </p>
                                <div className="pt-4 border-t border-white/10 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="text-xs text-slate-500 italic">For security inquiries: {contactEmail}</p>
                                    <button className="text-xs font-bold underline hover:text-blue-400 transition-colors">Download Security Whitepaper</button>
                                </div>
                            </div>
                        </section>

                        <footer className="pt-20 border-t border-slate-100 dark:border-white/5">
                            <p className="text-xs text-slate-400 text-center">
                                &copy; {new Date().getFullYear()} {companyName} - Smart Resource Management Platform.
                                <br />
                                Optimized for professional organization workflows.
                            </p>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default TermsAndServiceComponent