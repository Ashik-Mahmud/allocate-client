import { Calendar, Clock, Info, ShieldAlert, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Resource } from "@/types/resources";

type ResourceCardProps = {
    resource: Resource;
    onBook: (id: string) => void;
    onShowSlots: (id: string) => void;
    view: 'grid' | 'list';
};

const ResourceCard = ({ resource, onBook, onShowSlots, view }: ResourceCardProps) => {
    const isListView = view === 'list';

    const rules = resource.resourcesRules ? resource.resourcesRules[0] : null; // Assuming one set of rules per resource for simplicity

    return (
        <div className={cn(
            "group relative rounded-3xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950 transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1",
            isListView ? "flex flex-col md:flex-row gap-2" : "flex flex-col"
        )}>

            {
                resource?.is_maintenance && (
                    <div className="absolute z-10 top-3 right-3 px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-lg flex items-center gap-1">
                        <ShieldAlert className="size-3" />
                        <span>Maintenance</span>
                    </div>
                )
            }

            {/* Image Section */}
            <div className={cn(
                "relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900 shrink-0",
                isListView ? "h-40 md:h-auto md:w-64" : "h-48 w-full"
            )}>
                {
                    resource?.photo ? <img
                        src={resource.photo}
                        alt={resource.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                        : <div className="h-full w-full flex items-center justify-center text-slate-400">
                            No Image
                        </div>
                }
                <div className="absolute top-3 left-3">
                    {/* <ResourceStatus status={resource.status} nextAvailable={resource.nextAvailable} /> */}
                </div>
                {/* Resource Type Tag */}
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-widest">
                    {resource.type}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                                {resource.name}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                {
                                    resource?.is_available ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Slot Available</span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">Slot Unavailable</span>
                                    )
                                }
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1 justify-end text-blue-600">
                                <Zap className="size-3 fill-current" />
                                <span className="text-lg font-black">{resource.hourly_rate}</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Credits / Hr</p>
                        </div>
                    </div>

                    {/* Rule Highlights (The "Important Data") */}
                    <div className=" flex flex-wrap gap-2">
                        <RuleBadge
                            icon={<Clock className="size-3" />}
                            label={`${rules?.opening_hours}:00 - ${rules?.closing_hours}:00`}
                        />
                        <RuleBadge
                            icon={<ShieldAlert className="size-3" />}
                            label={rules?.max_booking_hours ? `${rules.max_booking_hours}h max` : 'No limit'}
                        />
                        <RuleBadge
                            icon={<Clock className="size-3" />}
                            label={rules?.min_lead_time ? `${rules.min_lead_time}h lead time` : "No lead time specified"}
                        />
                        <RuleBadge
                            icon={<Clock className="size-3" />}
                            label={rules?.buffer_time ? `${rules.buffer_time}h buffer time` : "No buffer time specified"}
                        />
                        <RuleBadge
                            icon={<Calendar className="size-3" />}
                            label={rules?.is_weekend_allowed ? "Weekends OK" : rules?.availableDays ? `Available on ${rules.availableDays.join(', ')}` : "Weekdays Only"}
                        />

                        {
                            resource?.metadata && Object.keys(resource.metadata).length > 0 && (
                                <RuleBadge
                                    icon={<Info className="size-3" />}
                                    label={
                                        Object.entries(resource.metadata).map(([key, value]) => `${key}: ${value}`).join(' | ')
                                    }
                                />
                            )
                        }

                    </div>
                </div>

                <div className={cn("flex gap-2", isListView ? "w-full md:w-auto" : "w-full")}>
                    <button
                        onClick={() => onShowSlots(resource.id)}
                        className={cn(
                            "cursor-pointer py-3 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2",
                            "border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900",
                            isListView ? "w-full md:w-auto px-5" : "flex-1"
                        )}
                        type="button"
                    >
                        Show Slots
                    </button>

                    <button
                        onClick={() => onBook(resource.id)}
                        className={cn(
                            "cursor-pointer py-3 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2",
                            "bg-slate-900 dark:bg-white text-white dark:text-slate-900 group-hover:bg-primary group-hover:text-white",
                            !resource.is_available || resource.is_maintenance ? "cursor-not-allowed opacity-50" : "hover:bg-primary hover:text-white",
                            isListView ? "w-full md:w-auto px-6" : "flex-1"
                        )}
                        type="button"
                        disabled={!resource.is_available || resource.is_maintenance}
                    >
                        Quick Book
                    </button>
                </div>
            </div>
        </div>
    );
};

// Internal sub-component for Rule Badges
const RuleBadge = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <span className="text-slate-400">{icon}</span>
        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate capitalize" title={label}>{label}</span>
    </div>
);

export default ResourceCard;