// Shared JSON type for metadata and availableDays
export type JsonValue = string | number | boolean | { [key: string]: JsonValue } | JsonValue[] | null;


export type ResourceType =
	| "MEETING_ROOM"
	| "WORKSTATION"
	| "PARKING"
	| "EQUIPMENT"
	| "OTHER";

export type Weekday =
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday"
	| "Sunday";

export type ResourceMetadata = Record<string, string | number | boolean | null>;

export interface Resource {
	id: string;
	org_id: string;
	name: string;
	type: ResourceType | string;
	hourly_rate: number | string;
	metadata: ResourceMetadata | null;
	is_available: boolean;
	is_active: boolean;
	is_maintenance: boolean;
	deletedAt?: string | null;
	createdAt: string;
	updatedAt: string;
	resourcesRules?: ResourceRule[];
}

export interface ResourceRule {
	id?: string;
	resource_id?: string;
	max_booking_hours: number | null;
	min_lead_time: number | null;
	buffer_time: number | null;
	opening_hours: number;
	closing_hours: number;
	slot_duration_min: number;
	is_weekend_allowed: boolean;
	availableDays: Weekday[];
	deletedAt?: string | null;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateResourcePayload {
	name: string;
	type: ResourceType | string;
	hourly_rate: number;
	metadata?: ResourceMetadata;
	is_available?: boolean;
	is_active?: boolean;
	is_maintenance?: boolean;
}

export type UpdateResourcePayload = Partial<CreateResourcePayload>;

export interface UpdateResourceRulesPayload {
	max_booking_hours?: number | null;
	min_lead_time?: number | null;
	buffer_time?: number | null;
	opening_hours?: number;
	closing_hours?: number;
	slot_duration_min?: number;
	is_weekend_allowed?: boolean;
	availableDays?: Weekday[];
}

export interface ResourceListFilters {
	page?: number;
	limit?: number;
	search?: string;
	type?: ResourceType | string;
	is_available?: boolean;
	is_active?: boolean;
	is_maintenance?: boolean;
	sortBy?: "name" | "hourly_rate" | "createdAt";
	sortOrder?: "asc" | "desc";
}

export interface Resources {
    id: string;
    org_id: string;
    name: string;
    type: string;
    // Decimal is usually handled as a string or number in frontend 
    // depending on how your API serializes it
    hourly_rate: number | string;
    metadata: JsonValue;
    is_available: boolean;
    is_active: boolean;
    is_maintenance: boolean;
    deletedAt: Date | string | null;
    createdAt: Date | string;
    updatedAt: Date | string;

    // Relations (Optional based on your API response)
    resourcesRules?: ResourcesRule[];
    bookings?: any[]; // Replace 'any' with your Bookings interface
}

export interface ResourcesRule {
    id: string;
    org_id: string;
    resource_id: string;
    max_booking_hours: number | null;
    min_lead_time: number | null;
    buffer_time: number | null;
    opening_hours: number;
    closing_hours: number;
    slot_duration_min: number;
    is_weekend_allowed: boolean;
    /** * Represented as a JSON array in Prisma, 
     * typed as string[] for frontend convenience 
     */
    availableDays: string[] | JsonValue;
    deletedAt: Date | string | null;
    createdAt: Date | string;
    updatedAt: Date | string;

    // Relations
    resource?: Resources;
}

