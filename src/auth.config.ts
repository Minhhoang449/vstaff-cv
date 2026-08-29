import type { DefaultSession, NextAuthConfig } from "next-auth";
import type { UserRole } from "@/lib/candidates-shared";

declare module "next-auth" {
  interface User {
    role?: UserRole;
  }
  interface Session {
    user: {
      id?: string;
      role?: UserRole;
    } & DefaultSession["user"];
  }
}

/**
 * Edge-safe config (middleware). Credentials provider lives in auth.ts (Node).
 * Do NOT set `secret` here — Vercel bakes undefined at build time and blocks AUTH_SECRET fallback.
 */
export const authConfig = {
  providers: [],
  pages: {
    signIn: "/dang-nhap",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role as UserRole | undefined;
      }
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      if (pathname.startsWith("/dashboard")) return isLoggedIn;
      return true;
    },
  },
  session: { strategy: "jwt" },
  trustHost: true,
} satisfies NextAuthConfig;
