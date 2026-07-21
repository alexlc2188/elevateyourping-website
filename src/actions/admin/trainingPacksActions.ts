"use server";
import { requireRole } from "@/lib/auth";
import { prismaDb } from "@/lib/db";
import {
  createNewPack,
  getTrainingPacks,
  getTrainingPacksAdmin,
} from "@/lib/services/trainingPacks";
import {
  descriptionSchema,
  levelSchema,
  titlePackFormSchema,
  trainingPackTypeSchema,
} from "@/lib/validators/trainingPackSchema";
import { UserRole } from "@prisma/client";
import { z } from "zod";

export async function getTrainingPacksActionAdmin() {
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) return { success: false, data: null, error: auth.error };

  try {
    const data = await getTrainingPacksAdmin();
    return { success: true, data };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
      error: "Failed to get training packs",
    };
  }
}
export async function getTrainingPacksAction() {
  // const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  // if (!auth.success) return { success: false, data: null, error: auth.error };

  try {
    const data = await getTrainingPacks();
    return { success: true, data };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
      error: "Failed to get training packs",
    };
  }
}

export async function createNewPackAction(
  form: z.infer<typeof titlePackFormSchema>,
) {
  // ROLE VALIDATION
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success)
    return {
      data: null,
      success: false,
      error: "Not allowed",
    };

  const validated = titlePackFormSchema.safeParse(form);

  if (!validated.success) {
    return {
      success: false,
      fieldErrors: validated.error.flatten().fieldErrors,
      data: null,
    };
  }

  return await createNewPack(validated.data.title);
}

export async function updateTrainingPackTitle({
  trainingPackId,
  form,
}: {
  trainingPackId: string;
  form: z.infer<typeof titlePackFormSchema>;
}) {
  // ROLE VALIDATION
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success)
    return {
      data: null,
      success: false,
      error: "Not allowed",
    };

  const validated = titlePackFormSchema.safeParse(form);

  if (!validated.success) {
    return {
      success: false,
      fieldErrors: validated.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const { title } = await prismaDb.trainingPack.update({
      where: { id: trainingPackId },
      data: { title: validated.data.title },
    });
    return { success: true, data: title, error: null };
  } catch (error) {
    console.error("Error updating title: ", error);
    return {
      success: false,
      data: null,
      error: "Failed to update the pack title.",
    };
  }
}

export async function removeExerciseFromPackAction({
  trainingPackId,
  exerciseId,
}: {
  trainingPackId: string;
  exerciseId: string;
}) {
  // ROLE VALIDATION
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth.success) return auth;

  if (!trainingPackId || !exerciseId) {
    return {
      success: false,
      error: "Missing trainingPackId or exerciseId",
      data: null,
    };
  }

  try {
    const deleted = await prismaDb.trainingPackExercise.delete({
      where: {
        trainingPackId_trainingExerciseId: {
          trainingPackId,
          trainingExerciseId: exerciseId,
        },
      },
    });

    return {
      success: true,
      data: deleted,
      error: null,
    };
  } catch (error) {
    console.error("Error removing exercise from training pack:", error);
    return {
      success: false,
      error: "Failed to remove exercise from the pack.",
      data: null,
    };
  }
}

export async function updateTrainingPackLevel({
  packId,
  form,
}: {
  packId: string;
  form: z.infer<typeof levelSchema>;
}) {
  // Role check
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) {
    return {
      success: false,
      data: null,
      error: "Not allowed",
    };
  }

  // Validate form
  const validated = levelSchema.safeParse(form);
  if (!validated.success) {
    return {
      success: false,
      fieldErrors: validated.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const { level } = await prismaDb.trainingPack.update({
      where: { id: packId },
      data: { level: validated.data.level },
    });

    return {
      success: true,
      data: level,
      error: null,
    };
  } catch (error) {
    console.error("Error updating training pack level:", error);
    return {
      success: false,
      data: null,
      error: "Failed to update the pack level.",
    };
  }
}
export async function updateTrainingPackType({
  packId,
  form,
}: {
  packId: string;
  form: z.infer<typeof trainingPackTypeSchema>;
}) {
  // Role check
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) {
    return {
      success: false,
      data: null,
      error: "Not allowed",
    };
  }

  // Validate form
  const validated = trainingPackTypeSchema.safeParse(form);
  if (!validated.success) {
    return {
      success: false,
      fieldErrors: validated.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const { trainingPackType } = await prismaDb.trainingPack.update({
      where: { id: packId },
      data: { trainingPackType: validated.data.type },
    });

    return {
      success: true,
      data: trainingPackType,
      error: null,
    };
  } catch (error) {
    console.error("Error updating training pack type:", error);
    return {
      success: false,
      data: null,
      error: "Failed to update the pack type.",
    };
  }
}

export async function updateTrainingPackDescription({
  packId,
  form,
}: {
  packId: string;
  form: z.infer<typeof descriptionSchema>;
}) {
  // Role validation
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success)
    return {
      success: false,
      data: null,
      error: "Not allowed",
    };

  // Schema validation
  const validated = descriptionSchema.safeParse(form);
  if (!validated.success) {
    return {
      success: false,
      fieldErrors: validated.error.flatten().fieldErrors,
      data: null,
    };
  }

  try {
    const { description } = await prismaDb.trainingPack.update({
      where: { id: packId },
      data: { description: validated.data.description },
    });

    return {
      success: true,
      data: description,
      error: null,
    };
  } catch (error) {
    console.error("Error updating description:", error);
    return {
      success: false,
      data: null,
      error: "Failed to update the pack description.",
    };
  }
}

// You can replace this with your actual upload logic (e.g., Cloudflare, S3, etc.)
async function uploadImage(file: File): Promise<string> {
  // For demo, just mock an uploaded URL
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  // In production, you would upload the file to a real storage service and return the URL
  const mockUrl = `data:${file.type};base64,${base64}`;
  return mockUrl;
}

export async function updateTrainingPackImage(formData: FormData) {
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) {
    return {
      success: false,
      data: null,
      error: "Not authorized",
    };
  }

  const packId = formData.get("packId") as string;
  const file = formData.get("file") as File;

  if (!packId || !file) {
    return {
      success: false,
      data: null,
      error: "Missing packId or file",
    };
  }

  try {
    const imageUrl = await uploadImage(file);

    const updated = await prismaDb.trainingPack.update({
      where: { id: packId },
      data: { imageUrl },
    });

    return {
      success: true,
      data: updated.imageUrl,
      error: null,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      data: null,
      error: "Failed to update training pack image.",
    };
  }
}

export async function publishTrainingPackAction({
  packId,
  isPublished,
}: {
  packId: string;
  isPublished: boolean;
}) {
  // Role validation
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success)
    return {
      success: false,
      error: auth.error,
      data: null,
    };

  if (!packId) {
    return {
      success: false,
      error: "Missing training pack ID",
      data: null,
    };
  }

  try {
    const updatedPack = await prismaDb.trainingPack.update({
      where: { id: packId },
      data: {
        isPublished: !isPublished,
      },
    });

    if (!updatedPack) {
      return {
        success: false,
        error: "Training pack not found",
        data: null,
      };
    }

    return {
      success: true,
      data: updatedPack,
      error: null,
    };
  } catch (error) {
    console.error("Error publishing training pack:", error);
    return {
      success: false,
      error: "Failed to publish the training pack",
      data: null,
    };
  }
}

export async function updateTrainingPackVideo({
  packId,
  videoId,
}: {
  packId: string;
  videoId: string;
}) {
  // Role validation
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) {
    return {
      success: false,
      error: auth.error,
      data: null,
    };
  }

  if (!packId || !videoId) {
    return {
      success: false,
      error: "Missing packId or videoId",
      data: null,
    };
  }

  try {
    const updatedPack = await prismaDb.trainingPack.update({
      where: { id: packId },
      data: {
        introVideo: {
          connect: { id: videoId },
        },
      },
      include: {
        introVideo: true,
      },
    });

    return {
      success: true,
      data: updatedPack.introVideo,
      error: null,
    };
  } catch (error) {
    console.error("Error updating training pack video:", error);
    return {
      success: false,
      error: "Failed to update the training pack video",
      data: null,
    };
  }
}
