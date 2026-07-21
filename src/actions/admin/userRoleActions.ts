"use server";

import { prismaDb } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { userRoleFormSchema } from "@/lib/utils/user-role-management";



export async function updateUserRoleAction({
  userId,
  role,
}: {
  userId: string;
  role: UserRole;
}) {
  const auth = await requireRole([UserRole.OWNER]);
  if (!auth.success) {
    return {
      success: false,
      error: "Not authorized",
      data: null,
    };
  }

  const validated = userRoleFormSchema.safeParse({ role });
  if (!validated.success) {
    return {
      success: false,
      error: "Invalid role selected",
      data: null,
    };
  }

  try {
    const updatedUser = await prismaDb.user.update({
      where: { id: userId },
      data: { role: validated.data.role },
    });

    return {
      success: true,
      data: updatedUser,
      error: null,
    };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return {
      success: false,
      error: "Failed to update role",
      data: null,
    };
  }
}
