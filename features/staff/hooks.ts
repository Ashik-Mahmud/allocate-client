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
  workQueue: (filters?: StaffWorkQueueFilters) =>
    ["staff", "work-queue", filters ?? {}] as const,
  dailyPlan: (date?: string) => ["staff", "daily-plan", date ?? "today"] as const,
};

export function useStaffWorkQueueQuery(filters?: StaffWorkQueueFilters) {
  return useQuery({
    queryKey: staffKeys.workQueue(filters),
    queryFn: () => getStaffWorkQueue(filters),
  });
}

export function useStaffDailyPlanQuery(date?: string) {
  return useQuery({
    queryKey: staffKeys.dailyPlan(date),
    queryFn: () => getStaffDailyPlan(date),
  });
}

type UpdateStaffWorkQueueStatusVariables = {
  workItemId: string;
  payload: UpdateStaffWorkQueueStatusPayload;
};

export function useUpdateStaffWorkQueueStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workItemId, payload }: UpdateStaffWorkQueueStatusVariables) =>
      updateStaffWorkQueueStatus(workItemId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["staff", "work-queue"] }),
        queryClient.invalidateQueries({ queryKey: ["staff", "daily-plan"] }),
      ]);
    },
  });
}

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
        queryClient.invalidateQueries({ queryKey: ["staffs"] }),
        queryClient.invalidateQueries({ queryKey: ["staff"] }),
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
        queryClient.invalidateQueries({ queryKey: ["staffs"] }),
        queryClient.invalidateQueries({ queryKey: ["staff"] }),
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
        queryClient.invalidateQueries({ queryKey: ["staffs"] }),
        queryClient.invalidateQueries({ queryKey: ["staff"] }),
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
        queryClient.invalidateQueries({ queryKey: ["staffs"] }),
        queryClient.invalidateQueries({ queryKey: ["staff"] }),
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
        queryClient.invalidateQueries({ queryKey: ["staffs"] }),
        queryClient.invalidateQueries({ queryKey: ["staff"] }),
      ]);
    },
  });
}


// Revoke credits from staff member
export const useRevokeCreditsFromStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ staffId, credits }: { staffId: string; credits: number }) => revokeCreditsFromStaff(staffId, credits),
    onSuccess: async () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] }),
        queryClient.invalidateQueries({ queryKey: ["staffs"] }),
        queryClient.invalidateQueries({ queryKey: ["staff"] }),
      ]);
    }
  });
}

// Get Staff Credits logs
export const useGetStaffCreditLogQuery = (filters?: GetStaffCreditLogFilter) => {
  return useQuery({
    queryKey: ["staff", "credits-log", filters ?? {}],
    queryFn: () => getStaffCreditsLogs(filters as GetStaffCreditLogFilter),
  });
};
