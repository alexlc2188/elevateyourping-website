import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { prismaDb } from "@/lib/db";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prismaDb),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await prismaDb.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (token && user && user.email) {
        // First login — fetch role from DB and embed into token
        let dbUser;
        try {
          dbUser = await prismaDb.user.findUnique({
            where: { email: user.email },
          });
        } catch (err) {
          console.error("Failed to fetch user during JWT callback", err);
        }

        token.role = dbUser?.role || "USER"; // fallback default
        token.id = dbUser?.id as string;
        token.name = user?.name ?? "Anonymous";
        token.email = user.email;
        token.picture = user.image;
        token.isOAuth = true;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.isOAuth = token.isOAuth;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Only allow relative URLs or redirect to base
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl + "/app";
    },
  },

  ...authConfig,
});
