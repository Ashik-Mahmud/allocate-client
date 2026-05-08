export enum SaleInquiryStatus {
    PENDING = 'PENDING',
    CONTACTED = 'CONTACTED',
    CONVERTED = 'CONVERTED',
    CLOSED = 'CLOSED',
}

export interface SalesInquiry {
    id: string;
    org_id?: string | null;
    name: string;
    business_email: string;
    phone?: string | null;
    message: string;
    team_size?: number | null;
    country?: string | null;
    status: SaleInquiryStatus;
    createdAt: Date;
    updatedAt: Date;
    // Included relation
    organization?: {
        id: string;
        name: string;
        business_email?: string;
    } | null;
}

export interface CreateSalesInquiryDto {
    name: string;
    business_email: string;
    phone?: string;
    message: string;
    team_size: string;
    country: string;
    org_id: string;
}

export interface UpdateSalesInquiryDto {
    name?: string;
    message?: string;
    phone?: string;
    team_size?: string;
    country?: string;
    status?: SaleInquiryStatus;
}

export interface SalesInquiryFiltersDto {
    status?: SaleInquiryStatus;
    org_id?: string;
    country?: string;
    search?: string;
    sortBy?: keyof SalesInquiry;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface SalesStatsResponse {
    success: boolean;
    data: {
        totalLeads: number;
        pendingToday: number;
        conversionRate: string; // e.g., "15.50%"
        byStatus: Record<SaleInquiryStatus, number>;
        byCountry: Record<string, number>;
        byTeamSize: {
            '1-10': number;
            '11-50': number;
            '51-100': number;
            '100+': number;
            'Unknown': number;
        };
    };
}

export interface SalesStatsFiltersDto {
    org_id?: string;
    startDate?: string; // ISO date string
    endDate?: string;   // ISO date string
}