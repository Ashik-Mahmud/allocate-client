import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const DEFAULT_API_BASE_URL = "http://localhost:4000";

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

        const body = (await response.json()) as {
          user?: { id?: string; email?: string; name?: string };
          token?: string;
          accessToken?: string;
          refreshToken?: string;
          data?: {
            user?: { id?: string; email?: string; name?: string };
            token?: string;
            accessToken?: string;
            refreshToken?: string;
          };
        };

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
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as { accessToken?: string | null }).accessToken ?? null;
        token.refreshToken = (user as { refreshToken?: string | null }).refreshToken ?? null;
      }

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
