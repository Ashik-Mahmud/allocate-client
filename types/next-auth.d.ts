import type { User as AppUser } from "./index";

declare module "next-auth" {
  interface Session {
    user: AppUser | null;
    accessToken?: string | null;
    refreshToken?: string | null;
    error?: string;
  }

  interface User extends AppUser {
    accessToken?: string | null;
    refreshToken?: string | null;
    accessTokenExpires?: number | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AppUser["role"] | null;
    accessToken?: string | null;
    refreshToken?: string | null;
    accessTokenExpires?: number | null;
    error?: string;
  }
}
