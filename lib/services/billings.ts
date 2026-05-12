import { ApiResponse } from "@/types";
import { apiRequest } from "./http";
import { CreatePaymentCheckoutPayload, PaymentCheckoutResponse } from "@/types/billings";


// service to create payment checkout session and get the checkout URL
export const createPaymentCheckoutService = async (payment: CreatePaymentCheckoutPayload) => {
    return apiRequest<ApiResponse<PaymentCheckoutResponse>>(`/payments/create-checkout`, {
        method: "POST",
        body: JSON.stringify(payment),
    });
}

// service to start free trial
export const startFreeTrialService = async () => {
    return apiRequest<ApiResponse<null>>(`/payments/activate-trial`, {
        method: "POST",
    });
}