import type {
    CreateResourcePayload,
    Resource,
    ResourceListFilters,
    ResourcesRule,
    UpdateResourcePayload,
    UpdateResourceRulesPayload,
} from "@/types/resources";

import { apiRequest } from "./http";
import { ApiResponse } from "@/types";

function buildResourceListQueryString(filters?: ResourceListFilters) {
    if (!filters) {
        return "";
    }

    const params = new URLSearchParams();

    if (typeof filters.page === "number") {
        params.set("page", String(filters.page));
    }

    if (typeof filters.limit === "number") {
        const safeLimit = Math.min(Math.max(filters.limit, 1), 100);
        params.set("limit", String(safeLimit));
    }

    if (filters.search) {
        params.set("search", filters.search);
    }

    if (filters.type) {
        params.set("type", filters.type);
    }

    if (typeof filters.is_available === "boolean") {
        params.set("is_available", String(filters.is_available));
    }

    if (typeof filters.is_active === "boolean") {
        params.set("is_active", String(filters.is_active));
    }

    if (typeof filters.is_maintenance === "boolean") {
        params.set("is_maintenance", String(filters.is_maintenance));
    }

    if (filters.sortBy) {
        params.set("sortBy", filters.sortBy);
    }

    if (filters.sortOrder) {
        params.set("sortOrder", filters.sortOrder);
    }

    const query = params.toString();

    return query ? `?${query}` : "";
}

export function createResource(payload: CreateResourcePayload) {
    return apiRequest<ApiResponse<Resource>>("/resources/create", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateResource(resourceId: string, payload: UpdateResourcePayload) {
    return apiRequest<ApiResponse<Resource>>(`/resources/update/${resourceId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export function deleteResource(resourceId: string) {
    return apiRequest<ApiResponse<Resource>>(`/resources/delete/${resourceId}`, {
        method: "DELETE",
    });
}

export function getResourcesList(filters?: ResourceListFilters) {
    return apiRequest<ApiResponse<Resource[]>>(`/resources/list${buildResourceListQueryString(filters)}`);
}

export function getResourceById(resourceId: string) {
    return apiRequest<ApiResponse<Resource>>(`/resources/${resourceId}`);
}

export function updateResourceRules(resourceId: string, payload: UpdateResourceRulesPayload) {
    return apiRequest<ApiResponse<ResourcesRule>>(`/resources/${resourceId}/rules`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}
