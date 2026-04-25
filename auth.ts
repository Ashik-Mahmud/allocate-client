import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const DEFAULT_API_BASE_URL = "http://localhost:4000";
const ACCESS_TOKEN_REFRESH_BUFFER_SECONDS = 30;

type AuthApiPayload = {
  user?: { id?: string; email?: string; name?: string };
  token?: string;
  accessToken?: string;
  refreshToken?: string;
};

type AuthApiResponse = AuthApiPayload & {
  data?: AuthApiPayload;
};

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
        const user = payload.user;
        const resolvedEmail = user?.email ?? email;

        if (!resolvedEmail) {
          return null;
        }

        return {
          id: user?.id ?? resolvedEmail,
          email: resolvedEmail,
          name: user?.name ?? "",
          accessToken: payload.accessToken ?? payload.token ?? null,
          refreshToken: payload.refreshToken ?? null,
          accessTokenExpires: parseJwtExp(payload.accessToken ?? payload.token ?? null),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as { accessToken?: string | null }).accessToken ?? null;
        token.refreshToken = (user as { refreshToken?: string | null }).refreshToken ?? null;
        token.accessTokenExpires =
          (user as { accessTokenExpires?: number | null }).accessTokenExpires ??
          parseJwtExp((user as { accessToken?: string | null }).accessToken ?? null);

        return token;
      }

      if (isAccessTokenValid(token.accessTokenExpires as number | null | undefined)) {
        return token;
      }

      const currentRefreshToken = token.refreshToken as string | null | undefined;

      if (!currentRefreshToken) {
        token.error = "RefreshAccessTokenError";
        return token;
      }

      const refreshed = await refreshAccessToken(currentRefreshToken);

      if (!refreshed?.accessToken) {
        token.error = "RefreshAccessTokenError";
        return token;
      }

      token.accessToken = refreshed.accessToken;
      token.refreshToken = refreshed.refreshToken;
      token.accessTokenExpires = refreshed.accessTokenExpires;
      token.error = undefined;

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub ?? undefined;
      }

      (session as { accessToken?: string | null }).accessToken =
        (token.accessToken as string | null | undefined) ?? null;
      (session as { refreshToken?: string | null }).refreshToken =
        (token.refreshToken as string | null | undefined) ?? null;
      (session as { error?: string }).error =
        (token.error as string | undefined) ?? undefined;

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
