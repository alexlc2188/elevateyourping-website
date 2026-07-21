"use server";

import { requireRole } from "@/lib/auth";
import { prismaDb } from "@/lib/db";
import { publishMatch } from "@/lib/services/matches";
import { trainingPlanTitleSchema } from "@/lib/validators/trainingPlanSchema";
import { UserRole } from "@prisma/client";
import { z } from "zod";

export async function updateMatchVideo({
  matchId,
  type,
  videoId,
}: {
  matchId: string;
  type: "highlight" | "review" | "introPack";
  videoId: string;
}) {
  // ROLE VALIDATION
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) return auth;

  const data =
    type === "highlight"
      ? { highlightVideoId: videoId }
      : { reviewVideoId: videoId };

  try {
    await prismaDb.match.update({
      where: { id: matchId },
      data,
    });

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function updateTrainingPlanTitle({
  matchId,
  form,
}: {
  matchId: string;
  form: z.infer<typeof trainingPlanTitleSchema>;
}) {
  // ROLE VALIDATION
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) return auth;

  const validated = trainingPlanTitleSchema.safeParse(form);

  if (!validated.success) {
    return {
      success: false,
      fieldErrors: validated.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const existingPlan = await prismaDb.trainingPlan.findUnique({
      where: { matchId },
    });

    if (existingPlan) {
      // Update existing
      await prismaDb.trainingPlan.update({
        where: { matchId },
        data: { title: validated.data.title },
      });
    } else {
      // Create and link via match
      await prismaDb.trainingPlan.create({
        data: {
          matchId,
          title: validated.data.title,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function publishMatchAction({
  matchId,
  isPublished,
}: {
  matchId: string;
  isPublished: boolean;
}) {
  // ROLE VALIDATION
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) return auth;
  return await publishMatch(matchId, isPublished);
}

export async function createUserTrainingSelectionForPlan({
  userId,
  trainingPlanId,
}: {
  userId: string;
  trainingPlanId: string;
}) {
  try {
    await prismaDb.userTrainingPlanSelection.upsert({
      where: {
        userId_trainingPlanId: {
          userId,
          trainingPlanId,
        },
      },
      update: {},
      create: {
        user: { connect: { id: userId } },
        trainingPlan: { connect: { id: trainingPlanId } },
      },
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Failed to create UserTrainingSelection:", error);
    return { success: false, error: "Failed to create training selection" };
  }
}
