import NextAuth, { DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { JWT } from "next-auth/jwt";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  email: string;
  id: string;
  isPro: boolean;
  sessionToken: number;
  name: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    role: UserRole;
    sessionToken: number;
    isOAuth: boolean;
    email: string;
    id: string;
    name: string;
  }
}
