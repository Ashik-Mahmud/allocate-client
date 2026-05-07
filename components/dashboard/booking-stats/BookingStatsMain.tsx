"use client"
import { useFetchBookingStats } from '@/features/bookings';
import React from 'react'
import OrganizationBookingStats, { BookingData } from './OrganizationBookingStats';
import PremiumInsights from './PremiumInsights';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useTimezone from '@/hooks/use-timezone';
import { parseDateTimeLocalInTimeZone } from '@/lib/utils/timezone-date';
import CreditForecast from './CreditForecasting';
import useSubscription from '@/hooks/use-subscription';

type Props = {

}
export interface PremiumInsight {
    peakDemand: {
        date?: string;
        count: number;
        credits: number;
    };


    forecast: {
        avgDailyBurn: number;
        daysRemaining: number;
        isCritical: boolean;
    };

    summary: {
        totalPeriodBookings: number;
        totalPeriodCredits: number;
        bookingPerDay: number;
    };
}

/**
 * The standard response structure for the Booking Statistics API.
 */
export interface BookingStatsResponse {
    data: Array<{
        period: string;
        bookingsCount: number;
        totalCredits: number;
        averageCredits: string | number;
    }>;
    premiumInsight: PremiumInsight | null;
}

const BookingStatsMain = (props: Props) => {
    const { timeZone } = useTimezone();
    const { isPaid } = useSubscription()
    // sensible defaults (last 30 days)
    const today = new Date();
    const defaultEnd = today.toISOString().slice(0, 10);
    const defaultStart = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10); // 30 days ago

    const [startDate, setStartDate] = React.useState<string>(defaultStart);
    const [endDate, setEndDate] = React.useState<string>(defaultEnd);
    const [groupBy, setGroupBy] = React.useState<"day" | "week" | "month">("day");

    // Build timezone-aware ISO strings for the API
    const filters = React.useMemo(() => {
        try {
            const startIso = parseDateTimeLocalInTimeZone(`${startDate}T00:00`, timeZone).toISOString();
            const endIso = parseDateTimeLocalInTimeZone(`${endDate}T23:59`, timeZone).toISOString();
            return {
                startDate: startIso,
                endDate: endIso,
                groupBy,
            };
        } catch (e) {
            return {
                startDate: startDate,
                endDate: endDate,
                groupBy,
            };
        }
    }, [startDate, endDate, groupBy, timeZone]);

    const { data: stats, isLoading } = useFetchBookingStats(filters);

    const handleReset = () => {
        setStartDate(defaultStart);
        setEndDate(defaultEnd);
        setGroupBy('day');
    }

    const data = stats?.data as BookingStatsResponse
    console.log(stats)

    return (
        <div>
            {/* Header & Filters */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    {/* <div className="text-emerald-600 font-bold text-sm uppercase tracking-widest">Booking Analytics</div> */}
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Booking Statistics</h1>
                    <p className="text-sm text-slate-500">Overview of bookings for your organization. Timezone: {timeZone}</p>
                </div>

                <div className="flex items-center gap-3 mt-3 md:mt-0">
                    <div className="flex items-center gap-2">
                        <label className="text-xs text-zinc-500">Start</label>
                        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-9 rounded-xl" />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-xs text-zinc-500">End</label>
                        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-9 rounded-xl" />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-xs text-zinc-500">Group</label>
                        <select value={groupBy} onChange={(e) => setGroupBy(e.target.value as any)} className="h-9 rounded-xl border border-slate-200 bg-white dark:text-slate-400 dark:bg-indigo-900/10 dark:border-indigo-800/10 px-3 text-sm font-medium">
                            <option value="day">Day</option>
                            <option value="week" disabled={!isPaid}>Week 
                                {!isPaid && <span className="text-xs text-amber-500 font-bold ml-1"> (Pro)</span>}
                                </option>
                            <option value="month" disabled={!isPaid}>Month 
                                {!isPaid && <span className="text-xs text-amber-500 font-bold ml-1"> (Pro)</span>}

                            </option>
                        </select>
                    </div>

                    <Button size="sm" variant="outline" className="dark:border-slate-600" onClick={handleReset}>Reset</Button>
                </div>
            </div>

            <div className="mb-6">
                <PremiumInsights premiumInsight={data?.premiumInsight as PremiumInsight} />
            </div>
            <OrganizationBookingStats data={data?.data as BookingData[]} />

        </div>
    )
}

export default BookingStatsMain