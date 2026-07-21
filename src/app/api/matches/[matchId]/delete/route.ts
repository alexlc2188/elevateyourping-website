import { requireRole } from "@/lib/auth";
import { prismaDb } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ matchId: string }> },
) {
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);

  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  const { matchId } = await params;

  if (!matchId) {
    return NextResponse.json(
      { error: "Match ID is required" },
      { status: 400 },
    );
  }

  try {
    await prismaDb.trainingPlan.deleteMany({
      where: { matchId },
    });

    // Then delete the match
    await prismaDb.match.delete({
      where: { id: matchId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE MATCH ERROR", error);
    return NextResponse.json(
      { error: "Failed to delete match" },
      { status: 500 },
    );
  }
}
