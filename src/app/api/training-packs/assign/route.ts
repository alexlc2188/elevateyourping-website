import { prismaDb } from "@/lib/db";
import { addTrainingPackToUser } from "@/lib/services/trainingPacks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, trainingPackId } = body;

    if (!userId || !trainingPackId) {
      return NextResponse.json(
        { success: false, error: "Missing userId or trainingPackId" },
        { status: 400 },
      );
    }

    await prismaDb.user.update({
      where: {
        id: userId,
      },
      data: {
        selectedTrainingPackId: trainingPackId,
        selectedTrainingPlanId: null,
      },
    });

    const result = await addTrainingPackToUser({ userId, trainingPackId });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Failed to assign training pack" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("[API] Error assigning training pack:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
