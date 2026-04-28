import React from 'react'
import {
    Mail,
    ShieldCheck,
    Calendar,
    Coins,
    MoreVertical,
    UserCheck,
    UserMinus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, formatDistanceToNow } from 'date-fns' // Assuming you use date-fns for formatting
import AllocateDropdown from '@/components/shared/dropdown'
import { StaffDetails } from '@/types/staff'
import { useDeleteStaffMutation } from '@/features/staff'
import AllocateConfirmationAlert from '@/components/shared/TriggerConfirmation'
import { on } from 'events'
// This would typically come from your Prisma types
interface UserProps {
    user: StaffDetails
    onEdit?: (user: StaffDetails) => void;
    onDelete?: (userId?: string) => void;
    onViewDetails?: (user: StaffDetails) => void;
    onAssignCredits?: (user: StaffDetails) => void;
    onRevokeCredits?: (user: StaffDetails) => void;
}



const StaffUserCard = ({ user, onEdit, onDelete, onViewDetails, onAssignCredits, onRevokeCredits }: UserProps) => {

    // delete and edit handlers would go here, for now we will just log the actions
    const deleteStaff =useDeleteStaffMutation()

    // 1. Check if the last login was within the last 1 hour (3600000 ms)
    const isActive = user.last_login
        ? (new Date().getTime() - new Date(user.last_login).getTime()) < 60 * 60 * 1000
        : false;

    // 2. Generate the "time ago" string or "Never logged in"
    const lastLoginText = user.last_login
        ? `${formatDistanceToNow(new Date(user.last_login), { addSuffix: true })}`
        : 'Never logged in';

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

            {/* Top Section: Avatar & Role */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-600 dark:bg-slate-700 dark:text-zinc-400">
                            {user.photo ? (
                                <img src={user.photo} alt={user?.name ?? ''} className="h-full w-full rounded-xl object-cover" />
                            ) : (
                                user?.name?.substring(0, 2).toUpperCase()
                            )}
                        </div>
                        {user?.is_verified && (
                            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white p-0.5 dark:bg-slate-700">
                                <ShieldCheck className="h-full w-full text-emerald-500" />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</h3>
                        <span className={cn(
                            "w-fit rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            user.role === 'ORG_ADMIN'
                                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                                : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
                        )}>
                            {user?.role?.replace('_', ' ')}
                        </span>
                    </div>
                </div>


                <AllocateDropdown dropdownOptions={[
                    {
                        label:'View Details',
                        onClick: () => {
                            // Handle activate/deactivate logic here
                            onViewDetails && onViewDetails(user);
                        }
                    },
                    {
                        label: "Assign credits",
                        onClick: () => {
                            // Handle activate/deactivate logic here
                            onAssignCredits && onAssignCredits(user);
                        },
                     
                    },
                    {
                        label: "Revoke credits",
                        onClick: () => {
                            // Handle activate/deactivate logic here
                            onRevokeCredits && onRevokeCredits(user);
                        }
                    },
                    {
                        label: 'Edit User',
                        onClick: () => {
                            // Handle edit user logic here
                            onEdit && onEdit(user);
                        }
                    },
                    {
                        label: 'Delete User',
                        onClick: () => {
                            // Handle delete user logic here
                            onDelete && onDelete(user.id);
                        },
                        destructive: true
                    }

                ]} >
                    <button className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800">
                        <MoreVertical className="size-5" />
                    </button>
                </AllocateDropdown>
            </div>

            {/* Middle Section: Credits & Contact */}
            <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
                    <Mail className="size-4" />
                    <span className="truncate">{user.email}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-700/50">
                    <div className="flex items-center gap-2">
                        <Coins className="size-4 text-amber-500" />
                        <span className="text-xs font-medium text-slate-500">Personal Balance</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                        {user.personal_credits?.toLocaleString() ?? 0} <span className="text-[10px] opacity-50">CR</span>
                    </span>
                </div>
            </div>

            {/* Footer Section: Meta Info */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Calendar className="size-3" />
                    <span>Joined {user.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'N/A'}</span>
                </div>

                <div className="flex items-center gap-2">
                    {user.last_login ? (
                        <span className={cn(
                            "flex items-center gap-1.5 text-[11px] font-medium",
                            isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"
                        )}>
                            {isActive && (
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                </span>
                            )}
                            {isActive ? 'Active now' : `Last seen ${lastLoginText}`}
                        </span>
                    ) : (
                        <span className="text-[11px] font-medium text-slate-400 italic">
                            Never logged in
                        </span>
                    )}
                </div>
            </div>
          
        </div>
    )
}

export default StaffUserCard