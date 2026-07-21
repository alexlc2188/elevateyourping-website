import { prismaDb } from "../db";

/**
 * Get all training plans (admin usage)
 */
export const getAllTrainingPlans = async () => {
  try {
    const trainingPlans = await prismaDb.trainingPlan.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: trainingPlans };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to fetch user matches",
      data: [],
    };
  }
};

/**
 * Get a single training plan by its ID (includes match and nested exercises with videos)
 */
export async function getTrainingPlanById(planId: string) {
  if (!planId) {
    return {
      success: false,
      error: "Missing planId",
      data: null,
    };
  }

  try {
    const plan = await prismaDb.trainingPlan.findUnique({
      where: { id: planId },
      include: {
        match: {
          include: {
            user: true,
          },
        },
        exercises: {
          include: {
            trainingExercise: {
              include: {
                mainVideo: true,
                previewVideo: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      data: plan,
    };
  } catch (error) {
    console.error("Failed to load training plan:", error);
    return {
      success: false,
      error: "Failed to load training plan",
      data: null,
    };
  }
}

/**
 * Upsert a training plan for a specific match (update if exists, create if not)
 */
export async function upsertTrainingPlanService({
  matchId,
  title,
  exerciseIds,
}: {
  matchId: string;
  title: string;
  exerciseIds: string[];
}) {
  try {
    const plan = await prismaDb.trainingPlan.upsert({
      where: { matchId },
      update: {
        title,
        exercises: {
          deleteMany: {}, // remove old links
          create: exerciseIds.map((id, idx) => ({
            trainingExercise: { connect: { id } },
            position: idx,
          })),
        },
      },
      create: {
        match: { connect: { id: matchId } },
        title,
        exercises: {
          create: exerciseIds.map((id, idx) => ({
            trainingExercise: { connect: { id } },
            position: idx,
          })),
        },
      },
    });

    return { success: true, data: plan };
  } catch (error) {
    console.error("TrainingPlan upsert error:", error);
    return {
      success: false,
      error: "Something went wrong while saving the training plan.",
      data: null,
    };
  }
}

export async function getExercisesByMatchId(matchId: string) {
  if (!matchId) {
    return {
      success: false,
      error: "Missing match ID",
      data: null,
    };
  }

  try {
    const exercises = await prismaDb.trainingPlanExercise.findMany({
      where: {
        trainingPlan: {
          matchId: matchId, // 🔍 filter through the related trainingPlan
        },
      },
      include: {
        trainingExercise: {
          include: {
            mainVideo: true,
            previewVideo: true,
          },
        },
      },
    });

    return {
      success: true,
      data: exercises.map((e, i) => e.trainingExercise), // flatten
    };
  } catch (error) {
    console.error("getExercisesByMatchId error:", error);
    return {
      success: false,
      error: "Failed to fetch exercises",
      data: null,
    };
  }
}

export async function addExercisesToMatchPlan(
  matchId: string,
  exerciseIds: string[],
) {
  if (!matchId || exerciseIds.length === 0) {
    return {
      success: false,
      error: "Missing matchId or exercise IDs",
      data: null,
    };
  }

  try {
    const trainingPlan = await prismaDb.trainingPlan.findUnique({
      where: { matchId },
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

    const results = await Promise.all(
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
          update: {},
        }),
      ),
    );

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    console.error("Failed to add exercises to match plan:", error);
    return {
      success: false,
      error: "An error occurred while linking exercises to the plan.",
      data: null,
    };
  }
}

export async function removeExerciseFromMatchPlan(
  matchId: string,
  exerciseId: string,
) {
  if (!matchId || !exerciseId) {
    return {
      success: false,
      error: "Missing matchId or exercise IDs",
      data: null,
    };
  }

  try {
    const trainingPlan = await prismaDb.trainingPlan.findUnique({
      where: { matchId },
    });

    if (!trainingPlan) {
      return {
        success: false,
        error: "Training plan not found for the given match",
        data: null,
      };
    }

    const deleted = await prismaDb.trainingPlanExercise.delete({
      where: {
        trainingPlanId_trainingExerciseId: {
          trainingPlanId: trainingPlan.id,
          trainingExerciseId: exerciseId,
        },
      },
    });

    return {
      success: true,
      data: deleted,
    };
  } catch (error) {
    console.error("Error removing exercises from match plan:", error);
    return {
      success: false,
      error: "Failed to remove exercises from the plan.",
      data: null,
    };
  }
}

export async function updateTrainingPlanExerciseOrder({
  trainingPlanId,
  orderedIds,
}: {
  trainingPlanId: string;
  orderedIds: { id: string; position: number }[];
}) {
  try {
    await Promise.all(
      orderedIds.map(({ id, position }) =>
        prismaDb.trainingPlanExercise.update({
          where: { id },
          data: { position },
        }),
      ),
    );

    return { success: true };
  } catch (error) {
    console.error("Failed to reorder exercises", error);
    return { success: false, error: "Error updating order" };
  }
}

