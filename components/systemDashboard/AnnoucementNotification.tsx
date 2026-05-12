"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Bell,
  Users,
  ShieldAlert,
  Hammer,
  Info,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useBroadcastAnnouncement, useFetchOrganizations } from '@/features/system/hooks';
import { fetchOrganizations } from '@/lib/services/system';
import MultiSelector, { SelectableItem } from '@/components/shared/multi-selector';
import { BroadcastAnnouncementPayload } from '@/types/systemGlobal';
import { toast } from 'sonner';

// 1. Your Schema
export const BroadcastAnnouncementSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  orgIds: z.array(z.string()).optional(),
  type: z.enum(['SYSTEM_ALERT', 'MAINTENANCE_NOTICE']).default('SYSTEM_ALERT'),
  metadata: z.record(z.string(), z.any()).optional(),
  receiverType: z.enum(['ALL', 'ORG', 'STAFF', 'INDIVIDUAL']).default('ALL'),
});

type AnnouncementFormValues = z.infer<typeof BroadcastAnnouncementSchema>;

interface SelectedOrganization extends SelectableItem {
  id: string;
  name: string;
}

type props = {
  onCancel: () => void;
}

const AnnoucementNotification = ({ onCancel }: props) => {
  const [selectedOrganizations, setSelectedOrganizations] = useState<SelectedOrganization[]>([]);
  // 2. Setup Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(BroadcastAnnouncementSchema as any),
    defaultValues: {
      type: 'SYSTEM_ALERT',
      receiverType: 'ALL',
      orgIds: []
    }
  });

  const selectedReceiver = watch('receiverType');
  const selectedType = watch('type');
  const announcementMutation = useBroadcastAnnouncement();


  // Handler for searching organizations - callback from MultiSelector
  const handleOrganizationSearch = async (searchValue: string): Promise<SelectedOrganization[]> => {
    try {
      if (!searchValue.trim()) {
        return [];
      }

      // Call the service directly to search users
      const response = await fetchOrganizations({ name: searchValue, limit: 10, showDeletedOrg: false });

      // Transform API response to match SelectableItem interface
      if (response?.data && Array.isArray(response.data)) {
        return response.data.map((org: any) => ({
          id: org.id,
          name: `${org?.name} (${org?._count?.users || 0} users)`,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  const handleOrganizationSelectionChange = (selected: SelectableItem[]) => {
    setSelectedOrganizations(selected);
    // Update form with selected organization IDs
    setValue('orgIds', selected.map(org => org.id));
  };

  const onSubmit = async (data: AnnouncementFormValues) => {
    try {
      const result = await announcementMutation.mutateAsync(data as BroadcastAnnouncementPayload);
      if (result?.success) {
        toast.success("Announcement broadcasted successfully!");
        // Optionally, reset form or selected organizations here
        setSelectedOrganizations([]);
        onCancel(); // Close the form/modal after successful submission
      }
      // Optionally, show a success message or reset the form here

    } catch (error) {
      console.error('Error broadcasting announcement:', error);
      // Optionally, show an error message to the user here
    }
  };

  return (
    <div className="max-w-2xl mx-auto  rounded-2xl ">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 dark:border-slate-700 p-6 ">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <Bell size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Broadcast Announcement</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Send a notification to specific user groups or the entire system.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
        <div className="space-y-6 px-6">
          {/* Type Selection (System Alert vs Maintenance) */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setValue('type', 'SYSTEM_ALERT')}
              className={cn(
                "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all text-sm font-medium",
                selectedType === 'SYSTEM_ALERT'
                  ? "bg-amber-50 border-amber-200 text-amber-700 ring-2 ring-amber-100"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              <ShieldAlert size={18} />
              System Alert
            </button>
            <button
              type="button"
              onClick={() => setValue('type', 'MAINTENANCE_NOTICE')}
              className={cn(
                "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all text-sm font-medium",
                selectedType === 'MAINTENANCE_NOTICE'
                  ? "bg-blue-50 border-blue-200 text-blue-700 ring-2 ring-blue-100"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              <Hammer size={18} />
              Maintenance
            </button>
          </div>

          {/* Receiver Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Users size={16} /> Target Audience
            </label>
            <select
              {...register('receiverType')}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
            >
              <option value="ALL">Everyone (Global)</option>
              <option value="ORG">Organization Admins Only</option>
              <option value="STAFF">All Staff Members</option>
              <option value="INDIVIDUAL">Specific Individuals</option>
            </select>
          </div>

          {/* Conditional Field: Organization Selection (only if INDIVIDUAL is selected) */}
          {selectedReceiver === 'INDIVIDUAL' && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <MultiSelector
                label="Select Recipients"
                placeholder="Search by name or email..."
                onSearch={handleOrganizationSearch}
                selectedItems={selectedOrganizations}
                onSelectionChange={handleOrganizationSelectionChange}
                error={errors.orgIds?.message}
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                Select one or more organizations to send the announcement to.
              </p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Headline</label>
            <input
              {...register('title')}
              placeholder="E.g. Scheduled Downtime on Friday"
              className={cn(
                "w-full p-3 rounded-xl border transition-all text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300",
                errors.title ? "border-red-300 bg-red-50" : "border-slate-200 focus:ring-2 focus:ring-blue-500"
              )}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Message Details</label>
            <textarea
              {...register('message')}
              rows={4}
              placeholder="Describe the notice in detail..."
              className={cn(
                "w-full p-3 rounded-xl border transition-all text-sm resize-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300",
                errors.message ? "border-red-300 bg-red-50" : "border-slate-200 focus:ring-2 focus:ring-blue-500"
              )}
            />
            {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
          </div>

          {/* Info Note */}
          <div className="flex gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 dark:bg-slate-700 dark:border-slate-600">
            <Info size={18} className="text-slate-400 shrink-0" />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Publishing this will trigger push notifications and in-app alerts for all selected users based on their preference settings.
            </p>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex items-center gap-3 p-4 sticky bottom-0 bg-white dark:bg-slate-800">
          <button
            type="button"
            className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-200 hover:bg-slate-100 transition-all"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={isSubmitting || selectedReceiver === 'INDIVIDUAL' && selectedOrganizations.length === 0}
            className="flex-2 flex items-center justify-center gap-2 cursor-pointer bg-slate-900 dark:bg-primary text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 dark:shadow-slate-800 disabled:opacity-50"
          >
            <Send size={16} />
            {isSubmitting || announcementMutation?.isPending ? "Sending..." : "Broadcast Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnnoucementNotification;