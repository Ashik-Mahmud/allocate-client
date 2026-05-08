import { PlanType } from "./organization";

export enum PaymentProvider {
    STRIPE = 'STRIPE',
    SSLCOMMERZ = 'SSLCOMMERZ',
}
export interface CreatePaymentCheckoutPayload {
    months: number;
    planType: PlanType;
    currency: 'BDT' | 'USD';
    payment_gateway: PaymentProvider;
}

export interface PaymentCheckoutResponse {
    url: string;
}