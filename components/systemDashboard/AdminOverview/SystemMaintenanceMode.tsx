import { useUpdateSystemSettings } from '@/features/system/hooks';
import useGlobalSettings from '@/hooks/use-global-settings';
import { Loader, Lock, Power, ShieldAlert, Timer } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

type Props = {}

const SystemMaintenanceMode = (props: Props) => {
    const { isMaintenanceMode, updatedAt, refetch } = useGlobalSettings();

    const formattedDate = new Date(updatedAt).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });

    const systemSettingMutation = useUpdateSystemSettings();
    const { isPending, } = systemSettingMutation;

    const handleSave = async () => {
        try {
            const confirm = window.confirm("Are you sure you want to disable maintenance mode? This will allow API write operations and public access for all tenants.");
            if (!confirm) return;
            const result = await systemSettingMutation.mutateAsync({ maintenance_mode: !isMaintenanceMode } as any);
            if (result?.success) {
                toast.success("System settings updated successfully!", {
                    duration: 5000
                });
                refetch();
                return;
            }
        }
        catch (error) {
            console.error("Error updating system settings:", error);
            toast.error("Failed to update system settings. Please try again.");
        }
    };

    if (!isMaintenanceMode) return null;
    return (
        <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/50 p-4 transition-all dark:border-amber-900/30 dark:bg-amber-900/10">
            {/* Background Decorative Element */}
            <div className="absolute -right-8 -top-8 text-amber-200/20 dark:text-amber-500/10 rotate-12">
                <ShieldAlert size={120} />
            </div>

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                        <Lock className="h-6 w-6" />
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-400 uppercase tracking-tight">
                                Platform Locked
                            </h3>
                            <span className="flex h-2 w-2">
                                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
                            </span>
                        </div>
                        <p className="mt-0.5 text-sm text-amber-800/80 dark:text-amber-500/80 leading-relaxed max-w-md">
                            Maintenance mode is active. API write operations are restricted and public access is disabled for all tenants.
                        </p>
                        {updatedAt && (
                            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-amber-700/60 dark:text-amber-500/40 uppercase">
                                <Timer size={12} />
                                Activated {formattedDate}
                            </div>
                        )}
                    </div>
                </div>

                <button
                    className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-all active:scale-95"
                    onClick={handleSave}
                    disabled={isPending}
                >
                    {isPending ? (<Loader className="h-4 w-4 animate-spin text-white" />) : (<Power className="h-4 w-4" />)}
                    {isPending ? "Processing..." : "Disable Maintenance Mode"}
                </button>
            </div>
        </div>
    )
}

export default SystemMaintenanceMode