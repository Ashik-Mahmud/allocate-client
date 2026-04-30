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
        staff_id: string;
        credits: number;
    }[];
}

export interface GetStaffCreditLogFilter {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
}

export interface StaffManagementFormValues {
    name: string;
    email: string;
    password?: string;
    photo?: string;
}