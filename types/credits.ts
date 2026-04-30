import { User } from "next-auth";

export enum TransactionType {
    FREE_ALLOCATION = "FREE_ALLOCATION",
    ALLOCATE = "ALLOCATE",
    REVOKE = "REVOKE",
    SPEND = "SPEND",
    REFUND = "REFUND",
    TOP_UP = "TOP_UP",
    DEDUCT = "DEDUCT",
    ADJUSTMENT = "ADJUSTMENT"
}

export interface CreditTransaction {
    id: string;
    org_id: string;
    user_id: string;
    amount: number;
    price_paid: number | null;
    type: TransactionType;
    previousBalance: number;
    currentBalance: number;
    referenceId: string | null;
    description: string | null;
    performedBy: string;
    payment_gateway: string | null;
    transaction_id: string | null;
    currency: string | null;
    status: string | null;
    createdAt: Date;
    user?: Partial<User>;
}

/**
 * Useful for creation logic where the DB generates 
 * the ID and the timestamp automatically.
 */
export type CreateCreditTransactionInput = Omit<CreditTransaction, 'id' | 'createdAt'>;