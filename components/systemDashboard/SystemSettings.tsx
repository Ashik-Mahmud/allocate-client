"use client"
import React, { useState, ChangeEvent } from 'react';
import { 
  Settings2, ShieldAlert, BellRing, Mail, Moon, 
  FileJson, Save, AlertTriangle, Power, CheckCircle2,
  Globe, Info, AlertOctagon, Check,
  PersonStanding,
  Loader
} from 'lucide-react';

// --- TypeScript Interfaces ---
export type AlertType = 'info' | 'warning' | 'error' | 'success';

export interface GlobalAlert {
  title: string;
  body: string;
  type: AlertType;
  show: boolean;
  buttonText: string;
  buttonLink: string;
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

const SystemSettings = () => {
  // 1. State Management for the entire application settings
  const [settings, setSettings] = useState<SystemSettingsData>({
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
  });

  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSaving(false);
      alert("System configurations updated successfully!");
    }, 1000);
  };

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
            disabled={isSaving}
            className={`cursor-pointer flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all shadow-xl active:scale-95 ${
              isSaving ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
            }`}
          >
            {isSaving ? <span className="animate-spin text-xl">
                <Loader size={18} />
            </span> : <Save size={18} />}
            {isSaving ? "Syncing..." : "Publish Changes"}
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* LEFT: Main App Logic */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* 1. Maintenance Mode Engine */}
            <section className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden ${
              settings.maintenance_mode 
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

              {/* Alert Preview */}
              <div className="pt-4">
                <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest text-center">Live Preview</p>
                <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-colors ${
                  settings.global_alert_message.type === 'error' ? 'bg-red-50 border-red-200 text-red-900' :
                  settings.global_alert_message.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                  settings.global_alert_message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                  'bg-blue-50 border-blue-200 text-blue-900'
                }`}>
                  {settings.global_alert_message.type === 'error' ? <AlertOctagon size={20}/> : 
                   settings.global_alert_message.type === 'success' ? <CheckCircle2 size={20}/> : <Info size={20}/>}
                  <div className="flex-1">
                    <p className="font-bold text-sm">{settings.global_alert_message.title || "No Title Provided"}</p>
                    <p className="text-xs opacity-80">{settings.global_alert_message.body || "No message content."}</p>
                  </div>
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
                  { id: 'can_export_logs', label: 'Export System Logs', icon: <FileJson size={16}/> },
                  { id: 'ui_dark_mode', label: 'Enable App-wide Dark Mode', icon: <Moon size={16}/> }
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
                      {settings.features_flags[flag.id as keyof typeof settings.features_flags] && <Check size={14}/>}
                    </div>
                  </div>
                ))}
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
    </div>
  );
};

export default SystemSettings;