import { User } from ".";

export interface StaffListFilters {
    page?: number;
    limit?: number;
    search?: string;
    email?: string;
}

export type StaffDetails = Partial<User>;

export interface StaffCreditLogEntry {
    credits: number;
}

export interface AssignMultipleStaffCreditsPayload {
    staffCredits: {
        staffId: string;
        credits: number;
    }[];
}

export interface GetStaffCreditLogFilter {
    page?: number;
    limit?: number;
    staffId?: string;
    search?: string;
}