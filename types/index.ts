import type { AppRole } from "@/lib/constants/roles";
import type { Organizations } from "./organization";

export interface ApiErrorBody {
	message?: string;
	error?: string;
	details?: unknown;
}

export interface User {
	id?: string;
	email: string;
	name?: string | null;
	role?: AppRole | null;
	photo?: string | null;
	personal_credits?: number | null;
	last_login?: Date | string | null;
	is_verified?: boolean | null;
	verification_token?: string | null;
	token_expiry?: Date | string | null;
	deletedAt?: Date | string | null;
	createdAt?: Date | string | null;
	updatedAt?: Date | string | null;
	org_id?: string | null;
	organization?: Organizations | null;
	bookings?: unknown[];
	createdBookings?: unknown[];
	creditTransactions?: unknown[];
}

export type AuthUser = User;

export interface NotificationItem {
	id: string;
	title: string;
	message?: string;
	createdAt?: string;
	read?: boolean;
}

export interface RegisterPayload {
	email: string;
	name: string;
	password: string;
	terms?: boolean;
}

export interface LoginPayload {
	email: string;
	password: string;
}

export interface AuthResponse {
	user?: User;
	token?: string;
	accessToken?: string;
	refreshToken?: string;
	data?: {
		user?: User;
		token?: string;
		accessToken?: string;
		refreshToken?: string;
	};
	message?: string;
}

export interface AuthSession {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
}

export interface StaffWorkQueueFilters {
	status?: "pending" | "in_progress" | "completed";
	priority?: "low" | "medium" | "high";
	page?: number;
	limit?: number;
}

export interface StaffWorkQueueItem {
	id: string;
	title: string;
	description?: string;
	priority?: "low" | "medium" | "high";
	status?: "pending" | "in_progress" | "completed";
	dueAt?: string;
	bookingId?: string;
}

export interface StaffWorkQueueResponse {
	items: StaffWorkQueueItem[];
	total?: number;
	message?: string;
}

export interface StaffDailyPlanItem {
	id: string;
	title: string;
	startAt?: string;
	endAt?: string;
	status?: "pending" | "in_progress" | "completed";
	location?: string;
	bookingId?: string;
}

export interface StaffDailyPlanResponse {
	date?: string;
	items: StaffDailyPlanItem[];
	message?: string;
}

export interface UpdateStaffWorkQueueStatusPayload {
	status: "pending" | "in_progress" | "completed";
}

// Define what a "Paginated Response" looks like

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export interface ApiResponse<T> {
	success: true;
	data: T;
	timestamp: string;
}

// profile user
export enum Role {
	SUPER_ADMIN = 'SUPER_ADMIN',
	ORG_ADMIN = 'ORG_ADMIN',
	USER = 'USER',
	// Add other roles as defined in your prisma enum
}

