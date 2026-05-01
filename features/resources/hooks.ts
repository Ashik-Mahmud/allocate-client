"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	createResource,
	deleteResource,
	getBrowseResourcesList,
	getResourceById,
	getResourcesList,
	updateResource,
	updateResourceRules,
} from "@/lib/services/resources";
import type {
	CreateResourcePayload,
	ResourceListFilters,
	UpdateResourcePayload,
	UpdateResourceRulesPayload,
} from "@/types/resources";

export const resourceKeys = {
	all: (filters?: ResourceListFilters) => ["resources", filters ?? {}] as const,
	list: (filters?: ResourceListFilters) => ["resources", "list", filters ?? {}] as const,
	detail: (resourceId: string) => ["resources", "detail", resourceId] as const,
	rules: (resourceId: string) => ["resources", "rules", resourceId] as const,
};

export function useResourcesListQuery(filters?: ResourceListFilters) {
	return useQuery({
		queryKey: resourceKeys.list(filters),
		queryFn: () => getResourcesList(filters),
	});
}

export function useGetBrowseResourcesListQuery(filters?: ResourceListFilters) {
	return useQuery({
		queryKey: resourceKeys.all(filters),
		queryFn: () => getBrowseResourcesList(filters),
	});
}

export function useResourceByIdQuery(resourceId?: string) {
	return useQuery({
		queryKey: resourceKeys.detail(resourceId ?? ""),
		queryFn: () => getResourceById(resourceId as string),
		enabled: Boolean(resourceId),
	});
}

export function useCreateResourceMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateResourcePayload) => createResource(payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["resources", "list"] });
		},
	});
}

type UpdateResourceVariables = {
	resourceId: string;
	payload: UpdateResourcePayload;
};

export function useUpdateResourceMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ resourceId, payload }: UpdateResourceVariables) =>
			updateResource(resourceId, payload),
		onSuccess: async (_response, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["resources", "list"] }),
				queryClient.invalidateQueries({ queryKey: resourceKeys.detail(variables.resourceId) }),
			]);
		},
	});
}

export function useDeleteResourceMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (resourceId: string) => deleteResource(resourceId),
		onSuccess: async (_response, resourceId) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["resources", "list"] }),
				queryClient.invalidateQueries({ queryKey: resourceKeys.detail(resourceId) }),
				queryClient.invalidateQueries({ queryKey: resourceKeys.rules(resourceId) }),
			]);
		},
	});
}

type UpdateResourceRulesVariables = {
	resourceId: string;
	payload: UpdateResourceRulesPayload;
};

export function useUpdateResourceRulesMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ resourceId, payload }: UpdateResourceRulesVariables) =>
			updateResourceRules(resourceId, payload),
		onSuccess: async (_response, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: resourceKeys.rules(variables.resourceId) }),
				queryClient.invalidateQueries({ queryKey: resourceKeys.detail(variables.resourceId) }),
				queryClient.invalidateQueries({ queryKey: ["resources", "list"] }),
			]);
		},
	});
}
