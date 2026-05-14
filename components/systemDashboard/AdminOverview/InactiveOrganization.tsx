import React from 'react';
import { UserX, Users, ArrowUpRight, Inbox } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';

interface InactiveOrg {
    id: string;
    name: string;
    planType: 'FREE' | 'PRO' | 'ENTERPRISE';
    staffCount: number;
}

type Props = {
    organizations: InactiveOrg[];
};

const InactiveOrganization = ({ organizations }: Props) => {
    const router = useRouter();
    if (organizations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <Inbox className="text-slate-300 dark:text-slate-700 mb-2" size={32} />
                <p className="text-sm font-medium text-slate-500">All organizations are active!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
            {organizations.map((org) => (
                <div
                    key={org.id}
                    className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        {/* Warning Avatar */}
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                <UserX size={18} />
                            </div>
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                {org.name}
                                <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-black ${org.planType === 'ENTERPRISE' ? 'bg-purple-500 text-white' :
                                    org.planType === 'PRO' ? 'bg-blue-500 text-white' : 'bg-slate-500 text-white'
                                    }`}>
                                    {org.planType}
                                </span>
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-1 text-xs">
                                    <Users size={12} />
                                    <span>{org.staffCount} staff members</span>
                                </div>
                                <span className="text-xs font-mono opacity-50 uppercase tracking-tighter">
                                    ID: {org.id.split('_')[1] || org.id.slice(0, 5)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            router.push(ROUTES.dashboardAdmin.organizations + `?is_active=false`);
                        }}

                        className="cursor-pointer p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all">
                        <ArrowUpRight size={18} />
                    </button>
                </div>
            ))}


        </div>
    );
};

export default InactiveOrganization;