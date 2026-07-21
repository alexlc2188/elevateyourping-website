import { prismaDb } from "@/lib/db";

export default async function AssignmentForPack({
  packId,
}: {
  packId: string;
}) {
  const trainingPack = await prismaDb.trainingPack.findUnique({
    where: { id: packId },
    include: {
      exercises: {
        include: { trainingExercise: true },
      },
    },
  });

  return (
    <div>NEED TRAINING PACK</div>
    // <AssignmentForPack packId={packId} />
    // <AssignmentClient
    //   trainingExercises={trainingPack.exercises.map((e) => e.trainingExercise)}
    // />
  );
}
