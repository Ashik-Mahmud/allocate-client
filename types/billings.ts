import { PlanType } from "./organization";

export interface CreatePaymentCheckoutPayload {
    months: number;
    planType: PlanType;
    currency: 'BDT' | 'USD';
}

export interface PaymentCheckoutResponse {
    checkoutUrl: string;
}