import React from 'react';
import { TrendingDown, Users, Zap, AlertCircle } from "lucide-react";
import CreditForecast from './CreditForecasting';
import { PremiumInsight } from './BookingStatsMain';
import FeatureGuard from '@/components/shared/FeatureGuard';
import useSubscription from '@/hooks/use-subscription';

interface Props {
    premiumInsight?: PremiumInsight
}

const PremiumInsights = ({ premiumInsight }: Props) => {

    const [efficiency, setEfficiency] = React.useState<number>(50);
    const peakDay = premiumInsight?.peakDemand;
    const forecasting = premiumInsight?.forecast;
    const summary = premiumInsight?.summary;
    const { isPaid } = useSubscription()



    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Insight 1: Peak Demand - Dark Theme Look */}
            <FeatureGuard
                title="Peak Demand Insight"
                description="You will see the busiest period based on your selected date range. This helps you understand when your resource demand peaks and plan accordingly."
                showChildrenInBlur
            >
                <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 dark:bg-indigo-950/20 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <Zap className="h-5 w-5 text-amber-500" />
                        </div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Peak Demand Insight</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <p className="text-xs text-zinc-400 font-medium">Busiest Period Identified</p>
                            <span className="text-lg font-bold text-white tracking-tight">{peakDay?.date ?? 'N/A'}</span>
                        </div>
                        <div className="p-4 bg-zinc-800/50 dark:bg-zinc-800/20 rounded-xl border border-zinc-700/50">
                            <p className="text-xs text-zinc-300 leading-relaxed">
                                Activity peaked at <span className="text-amber-500 font-bold">{peakDay?.count ?? 0} bookings</span>.
                                Consider optimizing resource allocation for this period.
                            </p>
                        </div>
                    </div>
                </div>
            </FeatureGuard>
            {/* Insight 2: Resource Efficiency - Light/Dark Adaptive */}
            <FeatureGuard
                title="Efficiency Metric & Credit Forecast"
                description="This insight combines your current booking efficiency with a forecast of your credit usage. It helps you understand if you're on track with your credit consumption and when you might need to top up based on your current usage patterns."
                showChildrenInBlur
            >
                <div className="p-6 bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-300 uppercase tracking-widest">Efficiency Metric</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Total Bookings Row */}
                            <div className="flex items-center justify-between group">
                                <span className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">Total Activity</span>
                                <span className="text-sm font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                                    {summary?.totalPeriodBookings ?? 0} Bookings
                                </span>
                            </div>

                            {/* Target Efficiency Row */}
                            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50 pt-3">
                                <span className="text-sm text-zinc-500 dark:text-zinc-400">Target Efficiency</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{efficiency}</span>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Credits / Day</span>
                                </div>
                            </div>

                            {/* Progress Bar & Intensity Logic */}
                            <div className="space-y-2.5">
                                <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-zinc-400">Utilization Intensity</span>
                                    <span className={Number(forecasting?.avgDailyBurn) > efficiency ? 'text-orange-500 animate-pulse' : 'text-indigo-500'}>
                                        {Number(forecasting?.avgDailyBurn) > efficiency ? 'Above Target' : 'Optimal'}
                                        <span className="ml-1 opacity-70">({Number(forecasting?.avgDailyBurn).toFixed(1)} CR/Day)</span>
                                    </span>
                                </div>

                                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ease-out rounded-full ${Number(forecasting?.avgDailyBurn) > efficiency
                                            ? 'bg-orange-500'
                                            : 'bg-indigo-600 dark:bg-indigo-500'
                                            }`}
                                        style={{
                                            width: `${Math.min((Number(forecasting?.avgDailyBurn) / efficiency) * 100, 100)}%`
                                        }}
                                    />
                                </div>

                                {/* Subtle label for the percentage */}
                                <p className="text-[9px] text-zinc-400 font-medium text-right uppercase">
                                    {Math.round((Number(forecasting?.avgDailyBurn) / efficiency) * 100)}% Capacity Used
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Credit Forecast Component Integrated at bottom */}
                    <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <CreditForecast forcasting={forecasting as PremiumInsight['forecast']} />
                    </div>
                </div>
            </FeatureGuard>

            {/* Premium Tip - Wide Card */}
            <FeatureGuard
                title="Premium Tip"
                description="Unlock advanced features with our premium subscription."
                showChildrenInBlur
                view="table"
                className="w-full md:col-span-2"
            >
                <div className="md:col-span-2 p-4 bg-rose-50 border border-rose-100 dark:bg-rose-500/5 dark:border-rose-500/10 rounded-2xl flex items-start sm:items-center gap-4">
                    <div className="p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
                        <AlertCircle className="h-5 w-5 text-rose-500" />
                    </div>
                    <p className="text-sm text-rose-800 font-medium dark:text-rose-200">
                        <span className="font-bold underline text-rose-900 dark:text-rose-400">Premium Tip:</span> Your peak usage reached {peakDay?.credits ?? 0} credits. To prevent interruptions, we recommend maintaining a buffer of at least 20% of your peak demand.
                    </p>
                </div>
            </FeatureGuard>
        </div>
    );
};

export default PremiumInsights;