import { NextRequest, NextResponse } from "next/server";
import { getExercisePublished } from "@/lib/services/exercises";
import { requireRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export async function GET(req: NextRequest) {
  // ROLE VALIDATION
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) {
    return NextResponse.json(
      { success: false, message: "Not allowed" },
      { status: 401 },
    );
  }

  const result = await getExercisePublished();

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result, { status: 200 });
}
