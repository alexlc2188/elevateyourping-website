// ✅ SERVER ACTIONS — app/actions/exerciseActions.ts
"use server";

import { z } from "zod";
import {
  updateExerciseInDb,
  publishExerciseInDb,
  unpublishExerciseInDb,
  createExerciseDraftInDb,
  updateExerciseAdvancedInDb,
} from "@/lib/services/exercises";

import { createExerciseAdvancedSchema } from "@/lib/validators/createExerciseAdvancedSchema";
import { createExerciseDraftSchema } from "@/lib/validators/createExerciseDraftSchema";
import { updateExerciseBasicSchema } from "@/lib/validators/updateExerciseBasicSchema";
import { canAccess, currentUser, requireRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

// Server action to create a draft exercise
export async function createExerciseDraftAction(
  form: z.infer<typeof createExerciseDraftSchema>,
) {
  console.log('[createExerciseDraftAction] Starting with form data:', JSON.stringify(form, null, 2));
  
  // ROLE VALIDATION
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) {
    console.error('[createExerciseDraftAction] Authorization failed:', auth);
    return auth;
  }

  const validated = createExerciseDraftSchema.safeParse(form);

  if (!validated.success) {
    return {
      success: false,
      fieldErrors: validated.error.flatten().fieldErrors,
      data: null,
    };
  }

  return await createExerciseDraftInDb(validated.data);
}

// Server action to update an exercise
export async function updateExerciseAction(
  id: string,
  form: z.infer<typeof updateExerciseBasicSchema>,
) {
  // ROLE VALIDATION
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) return auth;

  const validated = updateExerciseBasicSchema.safeParse(form);

  if (!validated.success) {
    return {
      success: false,
      fieldErrors: validated.error.flatten().fieldErrors,
      data: null,
    };
  }

  return await updateExerciseInDb(id, validated.data);
}

// Server action to update advanced settings of an exercise
export async function updateExerciseAdvancedSettingsAction(
  id: string,
  form: z.infer<typeof createExerciseAdvancedSchema>,
) {
  // ROLE VALIDATION
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) return auth;

  const validated = createExerciseAdvancedSchema.safeParse(form);

  if (!validated.success) {
    return {
      success: false,
      fieldErrors: validated.error.flatten().fieldErrors,
      data: null,
    };
  }

  return await updateExerciseAdvancedInDb(id, validated.data);
}

// Server action to publish an exercise
export async function publishExerciseAction(id: string) {
  // ROLE VALIDATION
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) return auth;

  return await publishExerciseInDb(id);
}

// Server action to unpublish an exercise
export async function unpublishExerciseAction(id: string) {
  return await unpublishExerciseInDb(id);
}
