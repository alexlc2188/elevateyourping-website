"use client";
import { Training } from "@/components/workout/training";
import { Prisma, PrismaClient } from "@prisma/client";
import React, { useState } from "react";
import { TrainingPreviewColumn } from "../../matches/[matchId]/_components/TrainingPreviewColumn";
import { TrainingPreviewCard } from "@/components/workout/trainingPreviewCard";

type PackWithPayload = Prisma.TrainingPackGetPayload<{
  include: {
    exercises: {
      include: {
        trainingExercise: {
          include: {
            mainVideo: {
              select: {
                publicUrl: true;
                streamingUrl: true;
              };
            };
            previewVideo: {
              select: {
                publicUrl: true;
                streamingUrl: true;
              };
            };
            tags: {
              include: {
                tag: true;
              };
            };
          };
        };
      };
    };
  };
}>;

interface Props {
  trainingPack: PackWithPayload;
}

export const TrainingClient = ({ trainingPack }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex gap-4 justify-between ">
      <div className="flex-1">
        <Training
          setActiveIndex={setActiveIndex}
          activeIndex={activeIndex}
          startWithFirstExercise={true}
          exercises={
            trainingPack?.exercises.map((e) => ({
              ...e.trainingExercise,
              tags: e.trainingExercise.tags || [],
            })) || []
          }
          noWorkoutMessage="No training loaded. Please select one."
        />
      </div>
      <div className="hidden lg:block lg:flex-1">
        <div className="hidden lg:flex lg:w-full lg:flex-1">
          <TrainingPreviewCard
            exercises={
              trainingPack?.exercises.map((e) => ({
                ...e.trainingExercise,
                tags: e.trainingExercise.tags || [],
              })) || []
            }
            activeIndex={activeIndex}
          />
        </div>
      </div>
    </div>
  );
};
