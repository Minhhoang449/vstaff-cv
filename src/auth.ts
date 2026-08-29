import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { readAuthSecret } from "@/lib/auth-secret";
import { verifyUserCredentials } from "@/lib/users-auth";

const secret = readAuthSecret();

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  ...(secret ? { secret } : {}),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = await verifyUserCredentials(email, password);
        if (!user) {
          console.warn("[auth] credentials rejected", { email });
          return null;
        }
        if (user.accountStatus === "suspended") {
          console.warn("[auth] account suspended", { email });
          return null;
        }

        return {
          id: user.uid,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
});
