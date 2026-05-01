import { cn } from "@/lib/utils";
import { BOOKING_STATUS_CONFIG, BookingStatus } from "@/types/booking";

const StatusBadge = ({ status }: { status: BookingStatus }) => {
    const config = BOOKING_STATUS_CONFIG[status] || BOOKING_STATUS_CONFIG[BookingStatus.PENDING];
    const Icon = config.icon;

    return (
        <div className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-tight",
            config.color
        )}>
            <Icon className="w-3 h-3" />
            {config.label}
        </div>
    );
};