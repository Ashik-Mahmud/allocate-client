import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { normalizeRole } from "@/lib/constants/roles";
import { getProfileWithToken } from "@/lib/services/auth";
import type { User } from "@/types";

const DEFAULT_API_BASE_URL = "http://localhost:4000";
const ACCESS_TOKEN_REFRESH_BUFFER_SECONDS = 30;

type AuthApiPayload = {
  user?: {
    id?: string;
    email?: string;
    name?: string;
    role?: string | null;
  };
  token?: string;
  accessToken?: string;
  refreshToken?: string;
};

type AuthApiResponse = AuthApiPayload & {
  data?: AuthApiPayload;
};

type SessionTokenUser = Pick<
  User,
  |
    "id"
    | "email"
    | "name"
    | "role"
    | "photo"
    | "personal_credits"
    | "last_login"
    | "is_verified"
    | "verification_token"
    | "token_expiry"
    | "deletedAt"
    | "createdAt"
    | "updatedAt"
    | "org_id"
    | "organization"
    | "bookings"
    | "createdBookings"
    | "creditTransactions"
> & {
  accessToken?: string | null;
  refreshToken?: string | null;
  accessTokenExpires?: number | null;
};

type SessionToken = SessionTokenUser & {
  id?: string;
  sub?: string;
  error?: string;
};


function buildSessionUser(user: User): SessionTokenUser | null {
  if (!user) {
    return null;
  }

  const resolvedEmail = user.email?.trim();

  if (!resolvedEmail) {
    return null;
  }

  return {
    id: user.id ?? resolvedEmail,
    email: resolvedEmail,
    name: user.name ?? null,
    role: normalizeRole(user.role),
    photo: user.photo ?? null,
    personal_credits: user.personal_credits ?? null,
    last_login: user.last_login ?? null,
    is_verified: user.is_verified ?? null,
    verification_token: user.verification_token ?? null,
    token_expiry: user.token_expiry ?? null,
    deletedAt: user.deletedAt ?? null,
    createdAt: user.createdAt ?? null,
    updatedAt: user.updatedAt ?? null,
    org_id: user.org_id ?? null,
    organization: user.organization ?? null,
    bookings: user.bookings ?? [],
    createdBookings: user.createdBookings ?? [],
    creditTransactions: user.creditTransactions ?? [],
  };
}

function parseJwtExp(token: string | null | undefined): number | null {
  if (!token) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as {
      exp?: number;
    };

    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

function isAccessTokenValid(exp: number | null | undefined) {
  if (!exp) {
    return false;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return exp - nowInSeconds > ACCESS_TOKEN_REFRESH_BUFFER_SECONDS;
}

async function refreshAccessToken(refreshToken: string) {
  const response = await fetch(`${getApiBaseUrl()}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    return null;
  }

  const body = (await response.json()) as AuthApiResponse;
  const payload = body.data ?? body;

  const nextAccessToken = payload.accessToken ?? payload.token ?? null;
  const nextRefreshToken = payload.refreshToken ?? refreshToken;

  return {
    accessToken: nextAccessToken,
    refreshToken: nextRefreshToken,
    accessTokenExpires: parseJwtExp(nextAccessToken),
  };
}

function getApiBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!fromEnv) {
    return DEFAULT_API_BASE_URL;
  }

  return fromEnv.replace(/\/$/, "");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) {
          return null;
        }

        const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          return null;
        }

        const body = (await response.json()) as AuthApiResponse;

        const payload = body.data ?? body;
        const accessToken = payload.accessToken ?? null;

        if (!accessToken) {
          return null;
        }

        const profileResponse = await getProfileWithToken(accessToken);
        const profileUser = profileResponse.data;
        const sessionUser = buildSessionUser(profileUser);

        if (!sessionUser) {
          return null;
        }

        return {
          ...sessionUser,
          accessToken,
          refreshToken: payload.refreshToken ?? null,
          accessTokenExpires: parseJwtExp(accessToken),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const sessionUser = user as SessionTokenUser;
        const nextToken = token as SessionToken;
        nextToken.id = sessionUser.id ?? nextToken.id;
        nextToken.sub = sessionUser.id ?? nextToken.sub;
        nextToken.accessToken = sessionUser.accessToken ?? null;
        nextToken.refreshToken = sessionUser.refreshToken ?? null;
        nextToken.role = sessionUser.role ?? null;
        nextToken.photo = sessionUser.photo ?? null;
        nextToken.personal_credits = sessionUser.personal_credits ?? null;
        nextToken.last_login = sessionUser.last_login ?? null;
        nextToken.is_verified = sessionUser.is_verified ?? null;
        nextToken.verification_token = sessionUser.verification_token ?? null;
        nextToken.token_expiry = sessionUser.token_expiry ?? null;
        nextToken.deletedAt = sessionUser.deletedAt ?? null;
        nextToken.createdAt = sessionUser.createdAt ?? null;
        nextToken.updatedAt = sessionUser.updatedAt ?? null;
        nextToken.org_id = sessionUser.org_id ?? null;
        nextToken.organization = sessionUser.organization ?? null;
        nextToken.bookings = sessionUser.bookings ?? [];
        nextToken.createdBookings = sessionUser.createdBookings ?? [];
        nextToken.creditTransactions = sessionUser.creditTransactions ?? [];
        nextToken.accessTokenExpires =
          sessionUser.accessTokenExpires ?? parseJwtExp(sessionUser.accessToken ?? null);

        return nextToken;
      }

      const nextToken = token as SessionToken;

      if (isAccessTokenValid(nextToken.accessTokenExpires ?? null)) {
        return nextToken;
      }

      const currentRefreshToken = nextToken.refreshToken ?? null;

      if (!currentRefreshToken) {
        nextToken.error = "RefreshAccessTokenError";
        return nextToken;
      }

      const refreshed = await refreshAccessToken(currentRefreshToken);

      if (!refreshed?.accessToken) {
        nextToken.error = "RefreshAccessTokenError";
        return nextToken;
      }

      nextToken.accessToken = refreshed.accessToken;
      nextToken.refreshToken = refreshed.refreshToken;
      nextToken.accessTokenExpires = refreshed.accessTokenExpires;
      nextToken.error = undefined;

      return nextToken;
    },
    async session({ session, token }) {
      const nextToken = token as SessionToken;

      session.user = {
        id: nextToken.id ?? nextToken.sub ?? "",
        email: nextToken.email ?? session.user?.email ?? "",
        name: nextToken.name ?? session.user?.name ?? null,
        image: null,
        emailVerified: null,
        role: nextToken.role ?? null,
        photo: nextToken.photo ?? null,
        personal_credits: nextToken.personal_credits ?? null,
        last_login: nextToken.last_login ?? null,
        is_verified: nextToken.is_verified ?? null,
        verification_token: nextToken.verification_token ?? null,
        token_expiry: nextToken.token_expiry ?? null,
        deletedAt: nextToken.deletedAt ?? null,
        createdAt: nextToken.createdAt ?? null,
        updatedAt: nextToken.updatedAt ?? null,
        org_id: nextToken.org_id ?? null,
        organization: nextToken.organization ?? null,
        bookings: nextToken.bookings ?? [],
        createdBookings: nextToken.createdBookings ?? [],
        creditTransactions: nextToken.creditTransactions ?? [],
      } as typeof session.user;

      session.accessToken = nextToken.accessToken ?? null;
      session.refreshToken = nextToken.refreshToken ?? null;
      session.error = nextToken.error;

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  trustHost: true,
});
