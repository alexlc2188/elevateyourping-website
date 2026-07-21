"use client";
import {
  Training,
  TrainingExerciseWithVideos,
} from "@/components/workout/training";
import { MatchWithPayload } from "../page";
import { formatTime } from "@/lib/utils";
import { TrainingHeaderCard } from "@/components/headers/training-header-card";
import { useState } from "react";

export function TrainingListColumn({
  match,
  activeIndex,
  setActiveIndex,
}: {
  match: MatchWithPayload;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}) {
  const exercises: TrainingExerciseWithVideos[] =
    match.trainingPlan?.exercises.map((exercise) => ({
      ...exercise.trainingExercise,

      // Ensure tags is properly included
      tags: exercise.trainingExercise.tags || [],
    })) ?? [];

  const totalDuration = Math.round(
    exercises.reduce((acc, e) => {
      return acc + (e.duration || 0);
    }, 0) ?? 0,
  );

  // Debug: log exercises and their tags

  return (
    <div className=" mt-4 lg:mt-0 ">
      <div className="mx-auto space-y-4 ">
        <TrainingHeaderCard
          pack={{
            description:
              "Elevate your skills with a program built for your improvement",
            title:
              match.trainingPlan?.title ?? "Your Personalized Training Plan",
            exerciseCount: exercises.length,
            totalDuration: formatTime(totalDuration),
            tags: Array.from(
              new Set(
                exercises.flatMap((exercise) =>
                  (Array.isArray(exercise.tags) ? exercise.tags : [])
                    .map((tagObj: any) => tagObj.tag?.name)
                    .filter(Boolean),
                ),
              ),
            ),
            type: "rally",
            ctaLabel: "Start Your Training",
            startTrainingButton: true,
          }}
        />

        <Training
          exercises={exercises}
          startWithFirstExercise={true}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      </div>
    </div>
  );
}
