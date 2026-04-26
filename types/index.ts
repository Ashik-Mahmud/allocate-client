import type { AppRole } from "@/lib/constants/roles";

export interface ApiErrorBody {
	message?: string;
	error?: string;
	details?: unknown;
}

export interface AuthUser {
	id?: string;
	email: string;
	name?: string;
	role?: AppRole | null;
	credits?: number | null;
	unreadNotifications?: number | null;
	notifications?: NotificationItem[];
}

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
	user?: AuthUser;
	token?: string;
	accessToken?: string;
	refreshToken?: string;
	data?: {
		user?: AuthUser;
		token?: string;
		accessToken?: string;
		refreshToken?: string;
	};
	message?: string;
}

export interface AuthSession {
	user: AuthUser | null;
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
	meta: {
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