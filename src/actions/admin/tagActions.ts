// app/actions/admin/tagActions.ts
"use server";

import { requireRole } from "@/lib/auth";
import { createTag, deleteTag } from "@/lib/services/tags";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createTagAction(label: string) {
  // ROLE VALIDATION
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) return auth;

  if (!label || label.trim().length < 2) {
    throw new Error("Tag must be at least 2 characters.");
  }

  const newTag = await createTag(label.trim());

  revalidatePath("/admin/exercises/tags");

  return newTag;
}

export async function deleteTagAction(id: string) {
  const auth = await requireRole([UserRole.ADMIN, UserRole.OWNER]);

  if (!auth) return auth;

  try {
    await deleteTag(id);
    return { success: true };
  } catch (err) {
    console.error("Failed to delete tag:", err);
    return { success: false, error: "Tag deletion failed" };
  }
}
