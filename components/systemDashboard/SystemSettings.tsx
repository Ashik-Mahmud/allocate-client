"use client"
import React, { useState, ChangeEvent, useEffect } from 'react';
import {
  Settings2, ShieldAlert, BellRing, Mail, Moon,
  FileJson, Save, AlertTriangle, Power, CheckCircle2,
  Globe, Info, AlertOctagon, Check,
  PersonStanding,
  Loader,
  MessageCircle,
  ChevronDown,
  X,
  ArrowRight,
  Send
} from 'lucide-react';
import { useGetSystemSettings, useUpdateSystemSettings } from '@/features/system/hooks';
import { toast } from 'sonner';
import AnnoucementNotification from './AnnoucementNotification';
import { cn } from '@/lib/utils/cn';
import AllocateDrawer from '../shared/allocate-drawer';

// --- TypeScript Interfaces ---
export type AlertType = 'info' | 'warning' | 'error' | 'success';

export interface GlobalAlert {
  title: string;
  body: string;
  type: AlertType;
  show: boolean;
  buttonText?: string;
  buttonLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SystemSettingsData {
  id: string;
  support_email: string;
  maintenance_mode: boolean;
  global_alert_message: GlobalAlert;
  features_flags: {
    can_export_logs: boolean;
    ui_dark_mode: boolean;
  };
}

const defaultSettings: SystemSettingsData = {
  id: 'default',
  support_email: 'ashikmahmud934@gmail.com',
  maintenance_mode: false,
  global_alert_message: {
    title: 'Scheduled Maintenance',
    body: 'Allocate will be performing system updates soon.',
    type: 'info',
    show: false,
    buttonText: 'Learn More',
    buttonLink: '/updates',
  },
  features_flags: {
    can_export_logs: false,
    ui_dark_mode: true,
  },
};

const SystemSettings = () => {

  const { data, isLoading } = useGetSystemSettings();
  const systemSettings = data?.data;
  const systemSettingMutation = useUpdateSystemSettings();
  const { isPending } = systemSettingMutation;


  // 1. State Management for the entire application settings
  const [settings, setSettings] = useState<SystemSettingsData>(defaultSettings);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  // 2. Universal Change Handlers
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettings(prev => ({
        ...prev,
        [parent]: { ...(prev[parent as keyof SystemSettingsData] as object), [child]: value }
      }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleSwitch = (category: 'features_flags' | 'maintenance_mode', field?: string) => {
    if (category === 'maintenance_mode') {
      setSettings(prev => ({ ...prev, maintenance_mode: !prev.maintenance_mode }));
    } else if (field) {
      setSettings(prev => ({
        ...prev,
        features_flags: { ...prev.features_flags, [field]: !prev.features_flags[field as keyof typeof prev.features_flags] }
      }));
    }
  };

  const handleSave = async () => {
    try {
      const result = await systemSettingMutation.mutateAsync(settings as any);
      if (result?.success) {
        toast.success("System settings updated successfully!", {
          duration: 5000
        });
        return;
      }
    }
    catch (error) {
      console.error("Error updating system settings:", error);
      toast.error("Failed to update system settings. Please try again.");
    }
  };


  // load default settings from API when component mounts
  useEffect(() => {
    if (systemSettings) {
      setSettings({
        id: systemSettings.id || 'default',
        support_email: systemSettings.support_email || defaultSettings.support_email,
        maintenance_mode: systemSettings.maintenance_mode ?? defaultSettings.maintenance_mode,
        global_alert_message: {
          title: systemSettings.global_alert_message?.title || defaultSettings.global_alert_message.title,
          body: systemSettings.global_alert_message?.body || defaultSettings.global_alert_message.body,
          type: systemSettings.global_alert_message?.type || defaultSettings.global_alert_message.type,
          show: systemSettings.global_alert_message?.show ?? defaultSettings.global_alert_message.show,
          buttonText: systemSettings.global_alert_message?.buttonText || defaultSettings.global_alert_message.buttonText,
          buttonLink: systemSettings.global_alert_message?.buttonLink || defaultSettings.global_alert_message.buttonLink,
        },
        features_flags: {
          can_export_logs: systemSettings.features_flags?.can_export_logs ?? defaultSettings.features_flags.can_export_logs,
          ui_dark_mode: systemSettings.features_flags?.ui_dark_mode ?? defaultSettings.features_flags.ui_dark_mode,
        },
      });
    }
  }, [systemSettings]);

  // 3. Loading State

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <Loader size={32} className="animate-spin text-blue-600" />
          <p className="text-sm text-slate-500">Loading system settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-4 md:p-10 transition-colors duration-300">
      <div className=" mx-auto space-y-8">

        {/* Header with Save State */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 text-white">
                <Settings2 size={24} />
              </div>
              <h1 className="text-3xl font-black tracking-tight">Root Configurations</h1>
            </div>
            <p className="text-slate-500 text-sm">Managing App ID: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-blue-600 font-bold">{settings.id}</code></p>
          </div>

          <button
            onClick={handleSave}
            disabled={isPending}
            className={`cursor-pointer flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all shadow-xl active:scale-95 ${isPending ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
              }`}
          >
            {isPending ? <span className="animate-spin text-xl">
              <Loader size={18} />
            </span> : <Save size={18} />}
            {isPending ? "Syncing..." : "Publish Changes"}
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* LEFT: Main App Logic */}
          <div className="xl:col-span-2 space-y-8">

            {/* 1. Maintenance Mode Engine */}
            <section className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden ${settings.maintenance_mode
              ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50 shadow-2xl shadow-red-500/10'
              : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm'
              }`}>
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Power className={settings.maintenance_mode ? 'text-red-500 animate-pulse' : 'text-slate-400'} />
                    Application Availability
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md">
                    When active, all non-admin users will see a maintenance screen. Staff access to the Work Queue will be restricted.
                  </p>
                </div>
                <button
                  onClick={() => toggleSwitch('maintenance_mode')}
                  className={`relative w-16 h-8 rounded-full transition-colors ${settings.maintenance_mode ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${settings.maintenance_mode ? 'left-9' : 'left-1'}`} />
                </button>
              </div>

              {settings.maintenance_mode && (
                <div className="mt-6 p-4 bg-red-100/50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 flex items-center gap-3">
                  <AlertTriangle className="text-red-600 shrink-0" size={20} />
                  <p className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wide">Live Warning: Your application is currently offline for the public.</p>
                </div>
              )}
            </section>

            {/* 2. Global Alert System */}
            <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-3 italic">
                  <Globe className="text-blue-500" /> System-Wide Broadcast
                </h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-black text-slate-400 uppercase">Enable Broadcast</span>
                  <input
                    type="checkbox"
                    checked={settings.global_alert_message.show}
                    onChange={() => setSettings(prev => ({
                      ...prev,
                      global_alert_message: { ...prev.global_alert_message, show: !prev.global_alert_message.show }
                    }))}
                    className="w-5 h-5 accent-blue-600"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Alert Headline</label>
                  <input
                    name="global_alert_message.title"
                    value={settings.global_alert_message.title}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Banner Color (Context)</label>
                  <select
                    name="global_alert_message.type"
                    value={settings.global_alert_message.type}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-sm outline-none cursor-pointer"
                  >
                    <option value="info">Info (Standard Blue)</option>
                    <option value="warning">Warning (Amber Alert)</option>
                    <option value="error">Critical (Deep Red)</option>
                    <option value="success">Status (Emerald Green)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Detailed Body Message</label>
                <textarea
                  name="global_alert_message.body"
                  value={settings.global_alert_message.body}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Button Text</label>
                  <input
                    name="global_alert_message.buttonText"
                    value={settings.global_alert_message.buttonText}
                    onChange={handleInputChange}
                    placeholder="e.g., Learn More, Read Details"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Button Link</label>
                  <input
                    name="global_alert_message.buttonLink"
                    value={settings.global_alert_message.buttonLink}
                    onChange={handleInputChange}
                    placeholder="e.g., /updates, https://example.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {/* Alert Preview */}
              <div className="pt-4">
                <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest text-center">Live Preview</p>
                <div className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition-colors ${settings.global_alert_message.type === 'error' ? 'bg-red-50 border-red-200 text-red-900' :
                  settings.global_alert_message.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                    settings.global_alert_message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                      'bg-blue-50 border-blue-200 text-blue-900'
                  }`}>
                  <div className="flex items-start gap-4 flex-1">
                    {settings.global_alert_message.type === 'error' ? <AlertOctagon size={20} className="shrink-0 mt-0.5" /> :
                      settings.global_alert_message.type === 'success' ? <CheckCircle2 size={20} className="shrink-0 mt-0.5" /> : <Info size={20} className="shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      <p className="font-bold text-sm">{settings.global_alert_message.title || "No Title Provided"}</p>
                      <p className="text-xs opacity-80">{settings.global_alert_message.body || "No message content."}</p>
                    </div>
                  </div>
                  {settings.global_alert_message.buttonText && (
                    <a
                      href={settings.global_alert_message.buttonLink || '#'}
                      className={`px-4 py-2 rounded-lg font-semibold text-xs whitespace-nowrap shrink-0 transition-all ${settings.global_alert_message.type === 'error' ? 'bg-red-600 text-white hover:bg-red-700' :
                        settings.global_alert_message.type === 'warning' ? 'bg-amber-600 text-white hover:bg-amber-700' :
                          settings.global_alert_message.type === 'success' ? 'bg-emerald-600 text-white hover:bg-emerald-700' :
                            'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                      {settings.global_alert_message.buttonText}
                    </a>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT: Security & Feature Flags */}
          <div className="space-y-8">
            {/* Feature Flags */}
            <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
              <h3 className="text-lg font-bold flex items-center gap-3 mb-6">
                <ShieldAlert className="text-blue-400" /> Logic Switches
              </h3>
              <div className="space-y-4">
                {[
                  { id: 'can_export_logs', label: 'Export System Logs', icon: <FileJson size={16} /> },
                  { id: 'ui_dark_mode', label: 'Enable App-wide Dark Mode', icon: <Moon size={16} /> }
                ].map((flag) => (
                  <div
                    key={flag.id}
                    onClick={() => toggleSwitch('features_flags', flag.id)}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                        {flag.icon}
                      </div>
                      <span className="text-sm font-medium">{flag.label}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${settings.features_flags[flag.id as keyof typeof settings.features_flags] ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-700'}`}>
                      {settings.features_flags[flag.id as keyof typeof settings.features_flags] && <Check size={14} />}
                    </div>
                  </div>
                ))}
              </div>
            </section>




            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm transition-all duration-300">

              {/* Header & Toggle Button */}
              <div className="flex flex-col  gap-6 mb-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MessageCircle size={16} />
                    <h3 className="text-[10px] font-black uppercase tracking-widest">
                      Send System Alert
                    </h3>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      Broadcast Announcement
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                      Quickly deploy global notifications or maintenance notices to all users or specific organizations.
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => setShowAnnouncement(!showAnnouncement)}
                  className={cn(
                    "flex items-center justify-center cursor-pointer gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-md active:scale-95",
                    showAnnouncement
                      ? "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                      : "bg-primary text-white hover:bg-primary shadow-blue-200 dark:shadow-none"
                  )}
                >

                  Send Announcement
                  <Send size={16} />

                </button>
              </div>
            </section>

            {/* Support Config */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Mail size={16} />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Administrative Contact</h3>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Root Admin Email</label>
                <input
                  name="support_email"
                  value={settings.support_email}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                * This email will handle all escalated support requests from the Allocate staff Work Queue.
              </p>
            </section>
          </div>

        </div>
      </div>
      <AllocateDrawer
        open={showAnnouncement}
        onOpenChange={setShowAnnouncement}
        title="Broadcast Announcement"
        showHeader={false}
        position="left"
        footer={false}
      >
        <AnnoucementNotification onCancel={()=> setShowAnnouncement(false)}  />
      </AllocateDrawer>
   
    </div>
  );
};

export default SystemSettings;