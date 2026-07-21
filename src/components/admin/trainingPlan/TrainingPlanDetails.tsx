import { prismaDb } from "@/lib/db";
import Link from "next/link";

export default async function TrainingPlanDetails({
  matchId,
}: {
  matchId: string;
}) {
  const trainingPlan = await prismaDb.trainingPlan.findFirst({
    where: { matchId },
    include: {
      exercises: {
        include: {
          trainingExercise: true,
        },
      },
    },
  });

  if (!trainingPlan) {
    return (
      <div className="py-8 text-center text-slate-800">
        <h2 className="text-3xl font-semibold mb-2">No Training Plan Found</h2>
        <p className="mb-4">This match does not have a training plan yet.</p>
        <Link
          href={`/admin/training-plans/create?matchId=${matchId}`}
          className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary/80">
          Create Training Plan
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 rounded bg-slate-50 mb-8">
      <h2 className="text-xl font-semibold mb-4">
        Training Plan: {trainingPlan.title}
      </h2>
      {trainingPlan.exercises.length === 0 ? (
        <div className="text-slate-500 mb-2">
          No exercises yet.{" "}
          <Link
            href={`/admin/training-plans/${trainingPlan.id}/edit`}
            className="text-primary underline">
            Add exercises
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {trainingPlan.exercises.map((item) => (
            <li
              key={item.id}
              className="border rounded p-2 flex items-center gap-2 bg-white">
              <span className="font-semibold">
                {item.trainingExercise.label}
              </span>
              <span className="text-xs text-slate-500 ml-2 px-2 py-0.5 rounded bg-slate-100">
                {item.trainingExercise.type}
              </span>
              <span className="text-xs text-slate-400 ml-2">
                {Math.round(item.trainingExercise.duration / 60)} min
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        <Link
          href={`/admin/training-plans/${trainingPlan.id}/edit`}
          className="text-primary underline">
          Edit Plan
        </Link>
      </div>
    </div>
  );
}
