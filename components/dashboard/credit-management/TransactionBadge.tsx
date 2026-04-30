import { cn } from "@/lib/utils";
import { TRANSACTION_CONFIG } from "@/lib/utils/global";
import { TransactionType } from "@/types/credits";

export const TransactionBadge = ({ type }: { type: TransactionType }) => {
    const config = TRANSACTION_CONFIG[type] || TRANSACTION_CONFIG[TransactionType.ADJUSTMENT];
    const Icon = config.icon;

    return (
        <span className={cn(
            "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors",
            config.color
        )}>
            <Icon className="size-3" />
            {config.label}
        </span>
    );
};