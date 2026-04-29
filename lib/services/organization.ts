import { Organizations } from "@/types/organization";
import { apiRequest } from "./http";
import { ApiResponse } from "@/types";

export const updateOrganizationService = async (payload: Partial<Organizations>) => {
    return apiRequest<ApiResponse<Organizations>>(`/organization/profile/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}