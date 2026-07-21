"use client";

import { TrainingExerciseWithVideos } from "@/components/workout/training";
import { TrainingPreviewCard } from "@/components/workout/trainingPreviewCard";
import { MatchWithPayload } from "../page";

export function TrainingPreviewColumn({
  match,
  activeIndex,
}: {
  matchId: string;
  match: MatchWithPayload;
  activeIndex: number;
}) {
  const exercises: TrainingExerciseWithVideos[] =
    match.trainingPlan?.exercises.map((exercise) => ({
      ...exercise.trainingExercise,
    })) ?? [];

  return (
    <div className="hidden lg:flex lg:w-full lg:flex-1">
      <TrainingPreviewCard exercises={exercises} activeIndex={activeIndex} />
    </div>
  );
}
