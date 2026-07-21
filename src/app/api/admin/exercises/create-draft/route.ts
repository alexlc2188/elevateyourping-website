import { NextRequest, NextResponse } from "next/server";
import { ExerciseStatus } from "@prisma/client";
import { prismaDb } from "@/lib/db";
import { z } from "zod";
import { createExerciseDraftSchema } from "@/lib/validators/createExerciseDraftSchema";

export async function POST(req: NextRequest) {
  const data: z.infer<typeof createExerciseDraftSchema> = await req.json();
  const validatedFields = createExerciseDraftSchema.safeParse(data);

  if (!validatedFields.success) {
    return new NextResponse("Invalid fields!", { status: 400 });
  }

  const exerciseData = validatedFields.data;

  try {
    // Extract relation IDs from the data
    const { mainVideoId, previewVideoId, tags, focusAreas, ...restData } = exerciseData;
    
    // Prepare the data object for Prisma
    const createData: any = {
      ...restData,
      status: ExerciseStatus.DRAFT,
    };
    
    // Add video relations if IDs are provided
    if (mainVideoId) {
      createData.mainVideo = { connect: { id: mainVideoId } };
    }
    
    if (previewVideoId) {
      createData.previewVideo = { connect: { id: previewVideoId } };
    }
    
    // Handle tags if provided
    if (tags && tags.length > 0) {
      // Use connect for existing tags
      createData.tags = {
        create: tags.map(tagId => ({
          tagId: tagId
        }))
      };
    }
    
    // Handle focus areas if provided
    if (focusAreas && focusAreas.length > 0) {
      // Use connect for existing focus areas
      createData.focusAreas = {
        create: focusAreas.map(focusAreaId => ({
          focusAreaId: focusAreaId
        }))
      };
    }
    
    const draft = await prismaDb.trainingExercise.create({
      data: createData,
    });

    return NextResponse.json(draft, { status: 201 });
  } catch (err) {
    console.error("[EXERCISE_CREATE_ERROR]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
