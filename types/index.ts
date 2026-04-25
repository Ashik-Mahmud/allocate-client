export interface ApiErrorBody {
	message?: string;
	error?: string;
	details?: unknown;
}

export interface AuthUser {
	id?: string;
	email: string;
	name?: string;
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
