"use client";

import React, { useState } from 'react';
import { useDeleteOrganizationMutation } from '@/features/system/hooks';
import { toast } from 'sonner';
import { AlertTriangle, Trash2, Info, UserX, BellOff, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
    id: string;
    orgName: string; 
    onClose: () => void;
    onSuccess?: () => void;
}

const DeleteOrganizationDialog = ({ id, orgName, onClose, onSuccess }: Props) => {
    const [confirmText, setConfirmText] = useState("");
    const deleteOrgMutation = useDeleteOrganizationMutation();
    
   
    const REQUIRED_TEXT = `delete ${orgName}`;

    const handleDelete = async () => {
        if (confirmText !== REQUIRED_TEXT) return;
        try {
            const result = await deleteOrgMutation.mutateAsync(id);
            if (result?.success) {
                toast.success("Organization and associated data deleted");
                onSuccess?.();
            }
        } catch (error) {
            toast.error("Failed to delete organization");
        }
    }

    return (
        <div className="space-y-6 pt-2">
            {/* Warning Header */}
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl">
                <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-red-700 dark:text-red-400">Critical Action Required</h3>
                    <p className="text-[12px] text-red-600/80">This action cannot be undone. Please read the side effects carefully.</p>
                </div>
            </div>

            {/* Side Effects List */}
            <div className="space-y-3">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Side Effects</p>
                
                <div className="grid gap-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                        <UserX className="w-4 h-4 text-slate-500 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-slate-700">Staff Suspension</p>
                            <p className="text-[11px] text-slate-500">All associated staff accounts will be soft-deleted and access will be revoked immediately.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                        <BellOff className="w-4 h-4 text-slate-500 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-slate-700">Notification Erased</p>
                            <p className="text-[11px] text-slate-500">All system notifications and alerts related to this organization will be permanently erased.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                        <Info className="w-4 h-4 text-slate-500 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-slate-700">Audit Logs</p>
                            <p className="text-[11px] text-slate-500">Organization profile will be marked as deleted in audit logs for future reference.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Input */}
            <div className="space-y-3">
                <label className="text-[11px] text-slate-500 select-none">
                    To confirm, please type <span className="font-bold text-slate-900 dark:text-white italic">"{REQUIRED_TEXT}"</span> below:
                </label>
                <Input 
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type the confirmation text"
                    className="h-12 rounded-xl border-red-100 focus-visible:ring-red-500"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button 
                    variant="ghost" 
                    className="flex-1 rounded-xl h-12" 
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button 
                    variant="destructive" 
                    className="flex-1 rounded-xl h-12 gap-2 shadow-lg shadow-red-200 dark:shadow-none"
                    disabled={confirmText !== REQUIRED_TEXT || deleteOrgMutation.isPending}
                    onClick={handleDelete}
                >
                    {deleteOrgMutation.isPending ? "Deleting..." : (
                        <>
                            <Trash2 size={16} />
                            Delete Organization
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

export default DeleteOrganizationDialog;