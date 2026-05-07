import React from 'react';
import { AlertTriangle, TrendingUp } from "lucide-react"; // Assume CrystalBall or any icon
import { PremiumInsight } from './BookingStatsMain';

type Props = {
    forcasting: PremiumInsight['forecast'];
    
}
const CreditForecast = ({ forcasting }: Props) => {


    return (
        <div className="p-6 bg-linear-to-br from-indigo-600 to-violet-700 rounded-2xl text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-80">Credit Forecast</h3>
                <TrendingUp className="h-5 w-5 opacity-80" />
            </div>

            <div className="space-y-1">
                <p className="text-3xl font-black">~{forcasting?.daysRemaining ?? 0} Days</p>
                <p className="text-xs opacity-70 font-medium">Remaining at current usage rate</p>
            </div>

            {/* Warning if credits are low */}
            {forcasting?.isCritical && (
                <div className="mt-4 flex items-center gap-2 bg-white/10 p-2 rounded-lg border border-white/20">
                    <AlertTriangle className="h-4 w-4 text-amber-300" />
                    <p className="text-[10px] font-bold text-amber-50 text-pretty">
                        Low credits! Consider refilling to avoid booking interruptions.
                    </p>
                </div>
            )}
        </div>
    );
};

export default CreditForecast;