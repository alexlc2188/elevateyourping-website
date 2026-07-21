"use server";
import { prismaDb } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

type CollectionType = "plan" | "pack";

type RemoveExerciseInput = {
  collectionType: CollectionType;
  parentId: string; // trainingPlanId or trainingPackId
  exerciseId: string;
};

export async function removeExerciseFromCollectionAction({
  collectionType,
  /** trainingPlanId or trainingPackId */
  parentId,
  exerciseId,
}: RemoveExerciseInput) {
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) return auth;

  if (!parentId || !exerciseId) {
    return {
      success: false,
      error: "Missing parentId or exerciseId",
      data: null,
    };
  }

  try {
    let deleted;

    if (collectionType === "plan") {
      deleted = await prismaDb.trainingPlanExercise.delete({
        where: {
          trainingPlanId_trainingExerciseId: {
            trainingPlanId: parentId,
            trainingExerciseId: exerciseId,
          },
        },
      });
    } else if (collectionType === "pack") {
      deleted = await prismaDb.trainingPackExercise.delete({
        where: {
          trainingPackId_trainingExerciseId: {
            trainingPackId: parentId,
            trainingExerciseId: exerciseId,
          },
        },
      });
    } else {
      return {
        success: false,
        error: "Invalid collection type",
        data: null,
      };
    }

    return {
      success: true,
      data: deleted,
      error: null,
    };
  } catch (error) {
    console.error("Error removing exercise from collection:", error);
    return {
      success: false,
      error: `Failed to remove exercise from ${collectionType}.`,
      data: null,
    };
  }
}

type UpdateExerciseOrderInput = {
  collectionType: CollectionType;
  orderedIds: { id: string; position: number }[];
  parentId: string; // trainingPlanId or trainingPackId
};

export async function updateExerciseOrderInCollectionAction({
  collectionType,
  parentId,
  orderedIds,
}: UpdateExerciseOrderInput) {
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) return auth;

  if (!parentId || orderedIds.length === 0) {
    return { success: false, error: "Missing parentId or ordered items." };
  }

  try {
    if (collectionType === "plan") {
      const planExercises = await prismaDb.trainingPlanExercise.findMany({
        where: { trainingPlanId: parentId },
        select: { id: true },
      });

      const validIds = new Set(planExercises.map((e) => e.id));

      const invalid = orderedIds.find((item) => !validIds.has(item.id));
      if (invalid) {
        return {
          success: false,
          error: `Exercise ID ${invalid.id} does not belong to trainingPlanId ${parentId}`,
        };
      }

      await Promise.all(
        orderedIds.map(({ id, position }) =>
          prismaDb.trainingPlanExercise.update({
            where: { id },
            data: { position },
          }),
        ),
      );
    } else if (collectionType === "pack") {
      const packExercises = await prismaDb.trainingPackExercise.findMany({
        where: { trainingPackId: parentId },
        select: { id: true },
      });

      const validIds = new Set(packExercises.map((e) => e.id));

      const invalid = orderedIds.find((item) => !validIds.has(item.id));
      if (invalid) {
        return {
          success: false,
          error: `Exercise ID ${invalid.id} does not belong to trainingPackId ${parentId}`,
        };
      }

      await Promise.all(
        orderedIds.map(({ id, position }) =>
          prismaDb.trainingPackExercise.update({
            where: { id },
            data: { position },
          }),
        ),
      );
    } else {
      return { success: false, error: "Invalid collection type." };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to reorder exercises:", error);
    return { success: false, error: "Error updating order" };
  }
}

type AddExercisesToCollectionInput = {
  collectionType: CollectionType;
  parentId: string; // matchId or trainingPackId
  exerciseIds: string[];
};

export async function addExercisesToCollectionAction({
  collectionType,
  parentId,
  exerciseIds,
}: AddExercisesToCollectionInput) {
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) return auth;

  if (!parentId || exerciseIds.length === 0) {
    return {
      success: false,
      error: "Missing parentId or exercise IDs",
      data: null,
    };
  }

  try {
    if (collectionType === "plan") {
      // Find the trainingPlan via matchId
      const trainingPlan = await prismaDb.trainingPlan.findUnique({
        where: { matchId: parentId },
      });

      if (!trainingPlan) {
        return {
          success: false,
          error: "No training plan found for this match",
          data: null,
        };
      }

      const currentCount = await prismaDb.trainingPlanExercise.count({
        where: { trainingPlanId: trainingPlan.id },
      });

      const inserts = await Promise.all(
        exerciseIds.map((exerciseId, i) =>
          prismaDb.trainingPlanExercise.upsert({
            where: {
              trainingPlanId_trainingExerciseId: {
                trainingPlanId: trainingPlan.id,
                trainingExerciseId: exerciseId,
              },
            },
            create: {
              trainingPlanId: trainingPlan.id,
              trainingExerciseId: exerciseId,
              position: currentCount + i,
            },
            update: {}, // no update for existing links
          }),
        ),
      );

      return { success: true, data: inserts, error:null };
    }

    if (collectionType === "pack") {
      const currentCount = await prismaDb.trainingPackExercise.count({
        where: { trainingPackId: parentId },
      });

      const inserts = await Promise.all(
        exerciseIds.map((exerciseId, i) =>
          prismaDb.trainingPackExercise.upsert({
            where: {
              trainingPackId_trainingExerciseId: {
                trainingPackId: parentId,
                trainingExerciseId: exerciseId,
              },
            },
            create: {
              trainingPackId: parentId,
              trainingExerciseId: exerciseId,
              position: currentCount + i,
            },
            update: {},
          }),
        ),
      );

      return { success: true, data: inserts };
    }

    return {
      success: false,
      error: "Invalid collection type",
      data: null,
    };
  } catch (error) {
    console.error("Failed to add exercises:", error);
    return {
      success: false,
      error: "An error occurred while adding exercises.",
      data: null,
    };
  }
}
