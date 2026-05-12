"use client"
import React from 'react'
import { 
  Mail, Building2, MapPin, ShieldCheck, 
  Clock, Snowflake, Bell, Zap, Globe, Info,
  User as UserIcon
} from 'lucide-react'
import { format } from 'date-fns'
import { User } from '@/types';

type Props = {
    user: User | any;
}

const ViewUserDetail = ({ user }: Props) => {
    const org = user?.organization as any;

    return (
        <div className="w-full space-y-4 text-slate-900 bg-transparent">
            {/* Top Section: Identity & Quick Stats */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Main Identity Card */}
                <div className="flex-2 bg-slate-50 p-6 rounded-3xl flex items-center gap-5">
                    {user?.photo ? (
                        <img 
                            src={user.photo} 
                            alt={user.name}
                            className="w-24 h-24 rounded-2xl object-cover shadow-sm ring-4 ring-white"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-2xl bg-slate-200 flex items-center justify-center">
                            <UserIcon className="w-12 h-12 text-slate-400" />
                        </div>
                    )}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-black tracking-tight">{user?.name}</h2>
                            {user?.is_verified && <ShieldCheck size={20} className="text-blue-500 fill-blue-50" />}
                        </div>
                        <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5">
                            <Mail size={14} /> {user?.email}
                        </p>
                        <div className="flex gap-2 pt-1">
                            <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-1 rounded-lg uppercase">
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Credits / Pulse Card */}
                <div className="flex-1 bg-blue-600 p-6 rounded-3xl text-white flex flex-col justify-between relative overflow-hidden">
                    <Zap className="absolute -right-4 -top-4 w-24 h-24 text-blue-500 opacity-50 rotate-12" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Credit Pool</p>
                    <div className="relative z-10">
                        <h4 className="text-4xl font-black">{org?.credit_pool}</h4>
                        <p className="text-[10px] font-medium opacity-80 mt-1">Total org resources</p>
                    </div>
                </div>
            </div>

            {/* Bento Grid Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Stats 1: Last Login */}
                <div className="bg-white border border-slate-100 p-5 rounded-3xl flex items-center gap-4">
                    <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Last Active</p>
                        <p className="text-sm font-bold text-slate-700">
                            {user?.last_login ? format(new Date(user.last_login), 'MMM dd, p') : 'Never'}
                        </p>
                    </div>
                </div>

                {/* Stats 2: Notifications */}
                <div className="bg-white border border-slate-100 p-5 rounded-3xl flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                        <Bell size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Unread</p>
                        <p className="text-sm font-bold text-slate-700">{user?._count?.notifications || 0} Alerts</p>
                    </div>
                </div>

                {/* Stats 3: Frozen Credits */}
                <div className="bg-white border border-slate-100 p-5 rounded-3xl flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                        <Snowflake size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Frozen</p>
                        <p className="text-sm font-bold text-slate-700">{org?.frozen_credits || 0} Credits</p>
                    </div>
                </div>

                {/* Organization Details (Spans 2 columns) */}
                <div className="md:col-span-2 bg-slate-900 rounded-[2rem] p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                            <Building2 size={24} className="text-blue-400" />
                        </div>
                        <div>
                            <h5 className="font-bold text-lg">{org?.name}</h5>
                            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase">{org?.plan_type} Plan</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Globe size={12}/> {org?.timezone}</span>
                            </div>
                        </div>
                    </div>
                    {org?.hasUsedTrial && (
                         <div className="hidden sm:block text-right border-l border-slate-700 pl-6">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Trial End Date</p>
                            <p className="text-sm font-bold text-orange-400">{org?.trialEndsAt ? format(new Date(org.trialEndsAt), 'MMM dd, yyyy') : 'N/A'}</p>
                         </div>
                    )}
                </div>

                {/* Personal Credits Small Card */}
                <div className="bg-slate-100 rounded-[2rem] p-6 flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Personal Credits</p>
                    <p className="text-2xl font-black text-slate-900">{user?.personal_credits || 0}</p>
                </div>
            </div>

            {/* Bottom Address Section */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-start gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 shrink-0">
                    <MapPin size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Corporate Address</p>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                        {org?.address?.street}, {org?.address?.city}, {org?.address?.country}
                    </p>
                </div>
                <div className="ml-auto p-2 bg-slate-50 rounded-full text-slate-300">
                    <Info size={16} />
                </div>
            </div>
        </div>
    )
}

export default ViewUserDetail;