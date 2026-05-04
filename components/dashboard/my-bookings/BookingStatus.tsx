import { cn } from "@/lib/utils";
import { BOOKING_STATUS_CONFIG, BookingStatus } from "@/types/booking";

const BookingStatusBadge = ({ status }: { status: BookingStatus }) => {
    const config = BOOKING_STATUS_CONFIG[status] || BOOKING_STATUS_CONFIG[BookingStatus.PENDING];
    const Icon = config.icon;

    const isLive = status === BookingStatus.CHECKED_IN;
    return (isLive ? <span className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border animate-pulse",
        "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-100"
    )}>
        <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>

        {"Live Session"}
    </span> :
        <div className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-tight",
            config.color
        )}>
            <Icon className="w-3 h-3" />
            {config.label}
        </div>
    );
};

export default BookingStatusBadge