"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getStaffDailyPlan,
  getStaffWorkQueue,
  updateStaffWorkQueueStatus,
} from "@/lib/services/staff";
import type { StaffWorkQueueFilters, UpdateStaffWorkQueueStatusPayload } from "@/types";

export const staffKeys = {
  all: ["staff"] as const,
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
