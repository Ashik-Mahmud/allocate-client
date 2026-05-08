import { createPaymentCheckoutService } from "@/lib/services/billings";
import { CreatePaymentCheckoutPayload } from "@/types/billings";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { currentUserQueryKey } from "../auth";

export const BillingKeys = {
    checkout: ["billing", "checkout"],

};

// Hook to create a new payment checkout
export const useCreatePaymentCheckout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payment: CreatePaymentCheckoutPayload) => createPaymentCheckoutService(payment),
        onSuccess: async () => {
            return await Promise.all([
                queryClient.invalidateQueries({ queryKey: currentUserQueryKey }),
            ]);
        }
    });
};
