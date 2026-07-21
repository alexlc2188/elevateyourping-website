import { prismaDb } from "../db";

/**
 * Get all training plans (admin usage)
 */
export const getTrainingPacksAdmin = async () => {
  return await prismaDb.trainingPack.findMany({
    include: {
      exercises: {
        include: {
          trainingExercise: true,
        },
      },
      introVideo: true,
    },
  });
};

export const getTrainingPacks = async () => {
  return await prismaDb.trainingPack.findMany({
    where: {
      OR: [
        { isPublished: true },
        { shouldDisplayComingSoon: true }, // example second condition
      ],
    },
    include: {
      exercises: {
        include: {
          trainingExercise: true,
        },
      },
      introVideo: true,
    },
  });
};

export const createNewPack = async (title: string) => {
  try {
    const newPack = await prismaDb.trainingPack.create({
      data: {
        title,
      },
    });

    return {
      success: true,
      data: newPack.id,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to create a training pack",
      data: null,
    };
  }
};

export async function addTrainingPackToUser({
  userId,
  trainingPackId,
}: {
  userId: string;
  trainingPackId: string;
}) {
  try {
    const result = await prismaDb.userTrainingPackSelection.upsert({
      where: {
        userId_trainingPackId: {
          userId,
          trainingPackId,
        },
      },
      update: {}, // do nothing if exists
      create: {
        userId,
        trainingPackId,
      },
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Error assigning training pack to user:", error);
    return { success: false, error };
  }
}
