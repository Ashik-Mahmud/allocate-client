import { cn } from "@/lib/utils";

type ResourceStatusProps = {
    status: 'FREE' | 'BUSY' | 'HELD';
    nextAvailable?: string;
};
const ResourceStatus = ({ status, nextAvailable }: ResourceStatusProps) => {
    const config = {
        FREE: { color: "bg-emerald-500", text: "Available Now", bg: "bg-emerald-50 dark:bg-emerald-500/10", textColor: "text-emerald-600" },
        BUSY: { color: "bg-rose-500", text: `Busy until ${nextAvailable}`, bg: "bg-rose-50 dark:bg-rose-500/10", textColor: "text-rose-600" },
        HELD: { color: "bg-amber-500", text: "Reserved", bg: "bg-amber-50 dark:bg-amber-500/10", textColor: "text-amber-600" }
    };

    const current = config[status];

    return (
        <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full w-fit", current.bg)}>
            <span className={cn("size-2 rounded-full animate-pulse", current.color)} />
            <span className={cn("text-[11px] font-bold uppercase tracking-tight", current.textColor)}>
                {current.text}
            </span>
        </div>
    );
};

export default ResourceStatus;