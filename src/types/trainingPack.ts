import { TrainingPack } from "@prisma/client";

export type TrainingPackWithExercises = TrainingPack & {
  exercises: {
    id: string;
    position: number;
    trainingExercise: {
      id: string;
      label: string;
      mainVideo?: {
        publicUrl: string;
        thumbnailUrl?: string;
      };
    };
  }[];
};