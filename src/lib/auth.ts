import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

import { cache } from "react";

export const currentUser = cache(async () => {
  const session = await auth();
  return session?.user;
});

export const currentRole = cache(async () => {
  const session = await auth();
  return session?.user?.role;
});

export const isAdmin = cache(async () => {
  const role = await currentRole();

  if (!role) {
    return false;
  }

  return role === UserRole.ADMIN || role === UserRole.OWNER;
});

export function canManageExercises(role: string) {
  return ["ADMIN", "COACH", "OWNER"].includes(role);
}

export function isOwner(role: string) {
  return role === "OWNER";
}

export function canAccess(userRole: string, allowedRoles: string[]) {
  return userRole === "OWNER" || allowedRoles.includes(userRole);
}

export async function requireRole(allowedRoles: UserRole[] = [UserRole.ADMIN]) {
  const user = await currentUser();

  if (user?.role === UserRole.OWNER) return { success: true, user };

  if (!user || !canAccess(user.role, allowedRoles)) {
    return {
      success: false,
      error: "Unauthorized",
      data: null,
    };
  }

  return { success: true, user };
}
