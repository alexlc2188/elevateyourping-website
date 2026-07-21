"use server";

import { requireRole } from "@/lib/auth";

import {
  addExercisesToMatchPlan,
  getAllTrainingPlans,
  getTrainingPlanById,
  removeExerciseFromMatchPlan,
  updateTrainingPlanExerciseOrder,
  upsertTrainingPlanService,
} from "@/lib/services/trainingPlans";

import { trainingPlanSchema } from "@/lib/validators/trainingPlanSchema";
import { UserRole } from "@prisma/client";

export async function getAllTrainingPlansAction() {
  // ROLE VALIDATION
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) return auth;

  const allPlans = await getAllTrainingPlans();
  return allPlans;
}

export async function getTrainingPlanAction(planId: string) {
  // ROLE VALIDATION
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) return auth;

  const result = await getTrainingPlanById(planId);

  return result;
}

export async function upsertTrainingPlanAction(input: {
  matchId: string;
  title: string;
  exerciseIds: string[];
}) {
  // ROLE VALIDATION
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) return auth;

  const parsed = trainingPlanSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      issues: parsed.error.flatten().fieldErrors,
    };
  }

  return await upsertTrainingPlanService(parsed.data);
}

export async function addExercisesToPlanAction({
  matchId,
  exerciseIds,
}: {
  matchId: string;
  exerciseIds: string[];
}) {
  // ROLE VALIDATION
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) return auth;

  return await addExercisesToMatchPlan(matchId, exerciseIds);
}

export async function removeExercisesFromMatchPlanAction({
  matchId,
  exerciseId,
}: {
  matchId: string;
  exerciseId: string;
}) {
  // ROLE VALIDATION
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) return auth;

  return await removeExerciseFromMatchPlan(matchId, exerciseId);
}

export async function updateTrainingPlanExerciseOrderAction({
  trainingPlanId,
  orderedIds,
}: {
  trainingPlanId: string;
  orderedIds: { id: string; position: number }[];
}) {
  // ROLE VALIDATION
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) return auth;
  return await updateTrainingPlanExerciseOrder({ trainingPlanId, orderedIds });
}
