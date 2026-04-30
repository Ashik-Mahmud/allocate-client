"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  assignCreditsToMultipleStaff,
  assignCreditsToStaff,
  createStaffByOrgAdmin,
  deleteStaff,
  getStaffCreditsLogs,
  getStaffDailyPlan,
  getStaffDetails,
  getStaffList,
  getStaffWorkQueue,
  revokeCreditsFromStaff,
  updateStaffDetails,
  updateStaffWorkQueueStatus,
} from "@/lib/services/staff";
import type { StaffWorkQueueFilters, UpdateStaffWorkQueueStatusPayload } from "@/types";
import { AssignMultipleStaffCreditsPayload, GetStaffCreditLogFilter, StaffCreditLogEntry, StaffListFilters, StaffManagementFormValues } from "@/types/staff";

export const staffKeys = {
  all: (filters?: StaffListFilters) => ["staffs", filters ?? {}] as const,
  byId: (staffId: string) => ["staff", staffId] as const,
  creditLogs: (filters?: GetStaffCreditLogFilter) => ["staff", "credits-log", filters ?? {}] as const,
 
};


// Get Staff List
export const useGetStaffsQuery = (filters?: StaffListFilters) => {
  return useQuery({
    queryKey: staffKeys.all(filters),
    queryFn: () => getStaffList(filters),
  });
};
// Get Staff by ID
export const useGetStaffByIdQuery = (staffId?: string) => {
  return useQuery({
    queryKey: staffKeys.byId(staffId ?? ""),
    queryFn: () => getStaffDetails(staffId ?? ""),
    enabled: Boolean(staffId),
  });
};
// Create Staff by Org Admin
export const useCreateStaffByOrgAdminMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StaffManagementFormValues) => createStaffByOrgAdmin(payload),
    onSuccess: () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: staffKeys.all() }),
        queryClient.invalidateQueries({ queryKey: staffKeys.byId("") }), // Invalidate the staff by ID query to ensure fresh data when navigating to a staff member's details page
      ]);
    },
  });
};

// Update Staff by Org Admin
export const useUpdateStaffDetailsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ staffId, payload }: { staffId: string; payload: Partial<StaffManagementFormValues> }) => updateStaffDetails(staffId, payload),
    onSuccess: async () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: staffKeys.all() }),
        queryClient.invalidateQueries({ queryKey: staffKeys.byId("") }),
      ]);
    },
  });
};

// delete staff by org admin 
export const useDeleteStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (staffId: string) => deleteStaff(staffId),
    onSuccess: async () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: staffKeys.all() }),
        queryClient.invalidateQueries({ queryKey: staffKeys.byId("") }),
      ]);
    },
  });
};


// Assign credits to staff member
export const useAssignCreditsToStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ staffId, credits }: { staffId: string; credits: number }) => assignCreditsToStaff(staffId, credits),
    onSuccess: async () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] }),
        queryClient.invalidateQueries({ queryKey: staffKeys.creditLogs() }),
        queryClient.invalidateQueries({ queryKey: staffKeys.all() }),
        queryClient.invalidateQueries({ queryKey: staffKeys.byId("") }),
      ]);
    },
  });
}


// Assign credits to multiple staff members
export const useAssignCreditsToMultipleStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AssignMultipleStaffCreditsPayload) => assignCreditsToMultipleStaff(payload),
    onSuccess: async () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] }),
        queryClient.invalidateQueries({ queryKey: staffKeys.creditLogs() }),
        queryClient.invalidateQueries({ queryKey: staffKeys.all() }),
        queryClient.invalidateQueries({ queryKey: staffKeys.byId("") }),
      ]);
    },
  });
}


// Revoke credits from staff member
export const useRevokeCreditsFromStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ staffId, credits }: { staffId: string; credits: number }) => revokeCreditsFromStaff(staffId, credits),
    onSuccess: async (_data, variables) => {
      return await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] }),
        queryClient.invalidateQueries({ queryKey: staffKeys.creditLogs() }),
        queryClient.invalidateQueries({ queryKey: staffKeys.all() }),
        // 3. Target ONLY the specific staff member modified
        queryClient.invalidateQueries({ queryKey: staffKeys.byId(variables.staffId) }),
      ]);
    }
  });
}

// Get Staff Credits logs
export const useGetStaffCreditLogQuery = (filters?: GetStaffCreditLogFilter) => {
  return useQuery({
    queryKey: staffKeys.creditLogs(filters),
    queryFn: () => getStaffCreditsLogs(filters as GetStaffCreditLogFilter),
  });
};
