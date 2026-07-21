import { prismaDb } from "@/lib/db";
import TrainingPlanDetails from "@/components/admin/trainingPlan/TrainingPlanDetails";

export default async function AssignmentForMatch({
  matchId,
}: {
  matchId: string;
}) {
  const trainingPlan = await prismaDb.trainingPlan.findFirst({
    where: { matchId },
    include: {
      exercises: {
        include: { trainingExercise: true },
      },
    },
  });

  // Pass data to a client component for interaction/selection/assignment
  return <TrainingPlanDetails matchId={matchId} />;
}
