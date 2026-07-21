import { Prisma } from "@prisma/client";
import { prismaDb } from "../db";
import { z } from "zod";
import { createExerciseDraftSchema } from "../validators/createExerciseDraftSchema";
import { updateExerciseBasicSchema } from "../validators/updateExerciseBasicSchema";
import { createExerciseAdvancedSchema } from "../validators/createExerciseAdvancedSchema";

export async function getPublishedExercises() {
  try {
    const data = await prismaDb.trainingExercise.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
      include: {
        previewVideo: true,
        mainVideo: true,
      },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching published exercises:", error);
    return { success: false, data: [] };
  }
}

// Get a single exercise by ID
export async function getExerciseById(id: string) {
  try {
    const exercise = await prismaDb.trainingExercise.findUnique({
      where: { id },
      include: {
        // Include the video relations
        mainVideo: true,
        previewVideo: true,
        // Include tags and focus areas
        tags: {
          include: {
            tag: true,
          },
        },
        focusAreas: {
          include: {
            focusArea: true,
          },
        },
      },
    });
    return { success: true, data: exercise };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch exercise", data: null };
  }
}

// Get all draft exercises
export async function getExerciseDrafts() {
  try {
    const drafts = await prismaDb.trainingExercise.findMany({
      where: { status: "DRAFT" },
      orderBy: { createdAt: "asc" },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        focusAreas: {
          include: {
            focusArea: true,
          },
        },
        mainVideo: true,
        previewVideo: true,
      },
    });
    return { success: true, data: drafts };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch drafts", data: [] };
  }
}

// Get all draft exercises
export async function getExercisePublished() {
  try {
    const exercises = await prismaDb.trainingExercise.findMany({
      where: {
        status: "PUBLISHED",
      },
    });
    return { success: true, data: exercises };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch exercises", data: [] };
  }
}

// Create a draft exercise
export async function createExerciseDraftInDb(
  data: z.infer<typeof createExerciseDraftSchema>
) {
  try {
    // Extract video IDs from the data
    const { mainVideoId, previewVideoId, ...restData } = data;

    // Determine which video IDs to use (prefer new fields over legacy fields)
    const finalMainVideoId = mainVideoId;
    const finalPreviewVideoId = previewVideoId;

    // Extract advanced fields for relations
    const { tags, focusAreas, ...exerciseData } = restData;

    // Prepare the create data
    const createData: Prisma.TrainingExerciseCreateInput = {
      ...exerciseData,
      status: "DRAFT",
      // Connect videos if IDs exist
      ...(finalMainVideoId
        ? {
            mainVideo: {
              connect: { id: finalMainVideoId },
            },
          }
        : {}),
      ...(finalPreviewVideoId
        ? {
            previewVideo: {
              connect: { id: finalPreviewVideoId },
            },
          }
        : {}),
      // Create tags and focus areas relations if provided
      ...(tags && Array.isArray(tags)
        ? {
            tags: {
              create: tags.map((tagId: string) => ({
                tag: { connect: { id: tagId } },
              })),
            },
          }
        : {}),
      ...(focusAreas && Array.isArray(focusAreas)
        ? {
            focusAreas: {
              create: focusAreas.map((focusAreaId: string) => ({
                focusArea: { connect: { id: focusAreaId } },
              })),
            },
          }
        : {}),
    };

    // Create the exercise with proper relations
    const draft = await prismaDb.trainingExercise.create({
      data: createData,
      include: {
        mainVideo: true,
        previewVideo: true,
      },
    });

    return { success: true, data: draft };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create draft", data: null };
  }
}

// Update an exercise
export async function updateExerciseInDb(
  id: string,
  data: z.infer<typeof updateExerciseBasicSchema>
) {
  try {
    // Extract relation IDs from the data
    const { mainVideoId, previewVideoId, tags, focusAreas, ...restData } = data;

    // Determine which video IDs to use (prefer new fields over legacy fields)
    const finalMainVideoId = mainVideoId;
    const finalPreviewVideoId = previewVideoId;

    // Prepare the update data
    const updateData: Prisma.TrainingExerciseUpdateInput = {
      ...restData,
      // Handle main video connection/disconnection
      ...(finalMainVideoId
        ? {
            mainVideo: {
              connect: { id: finalMainVideoId },
            },
          }
        : {
            mainVideo: {
              disconnect: true,
            },
          }),
      // Handle preview video connection/disconnection
      ...(finalPreviewVideoId
        ? {
            previewVideo: {
              connect: { id: finalPreviewVideoId },
            },
          }
        : {
            previewVideo: {
              disconnect: true,
            },
          }),
    };

    // Handle tags if provided
    if (tags && tags.length > 0) {
      // First delete existing tags
      await prismaDb.trainingExerciseTag.deleteMany({
        where: { trainingExerciseId: id },
      });

      // Then create new tag relations
      updateData.tags = {
        create: tags.map((tagId) => ({
          tagId: tagId,
        })),
      };
    }

    // Handle focus areas if provided
    if (focusAreas && focusAreas.length > 0) {
      // First delete existing focus areas
      await prismaDb.trainingExerciseFocus.deleteMany({
        where: { trainingExerciseId: id },
      });

      // Then create new focus area relations
      updateData.focusAreas = {
        create: focusAreas.map((focusAreaId) => ({
          focusAreaId: focusAreaId,
        })),
      };
    }

    // Update the exercise with proper relations
    const updated = await prismaDb.trainingExercise.update({
      where: { id },
      data: updateData,
      include: {
        mainVideo: true,
        previewVideo: true,
      },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update exercise", data: null };
  }
}

// Update an exercise in DB
export async function updateExerciseAdvancedInDb(
  id: string,
  rawData: z.infer<typeof createExerciseAdvancedSchema>
) {
  const { tags, focusAreas, ...rest } = rawData;

  const data: Prisma.TrainingExerciseUpdateInput = {
    ...rest,

    tags: {
      deleteMany: {}, // Clear all existing tag links
      create: (tags || []).map((tagId) => ({
        tag: { connect: { id: tagId } },
      })),
    },

    focusAreas: {
      deleteMany: {}, // Clear all existing focus area links
      create: (focusAreas || []).map((focusAreaId) => ({
        focusArea: { connect: { id: focusAreaId } },
      })),
    },
  };

  try {
    const updated = await prismaDb.trainingExercise.update({
      where: { id },
      data: data as Prisma.TrainingExerciseUpdateInput,
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Update failed", data: null };
  }
}

// Publish an exercise (update status to PUBLISHED)
export async function publishExerciseInDb(id: string) {
  try {
    await prismaDb.trainingExercise.update({
      where: { id },
      data: {
        status: "PUBLISHED",
      } as Prisma.TrainingExerciseUpdateInput,
    });
    return { success: true, message: "Exercise published!" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Publish failed", data: null };
  }
}

// Unpublish an exercise (update status to DRAFT)
export async function unpublishExerciseInDb(id: string) {
  try {
    await prismaDb.trainingExercise.update({
      where: { id },
      data: {
        status: "DRAFT",
      } as Prisma.TrainingExerciseUpdateInput,
    });
    return { success: true, message: "Exercise unpublished!" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Unpublish failed", data: null };
  }
}
