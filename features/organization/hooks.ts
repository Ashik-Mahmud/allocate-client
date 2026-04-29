import { updateResource } from "@/lib/services";
import { updateOrganizationService } from "@/lib/services/organization";
import { Organizations } from "@/types/organization";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const organizationKeys = {
    all: ["organizations"] as const,
    list: ["organizations", "list"] as const,
    detail: (orgId: string) => ["organizations", "detail", orgId] as const,
};

// Update organization
export function useUpdateOrganization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ payload, }: { payload: Partial<Organizations> }) => updateOrganizationService(payload),
        onSuccess: async () => {
            void Promise.all([
                await queryClient.invalidateQueries({ queryKey: organizationKeys.list }),
                await queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] }),
            ]);
        },
    });
}