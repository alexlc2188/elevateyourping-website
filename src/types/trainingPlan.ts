import {
  Match,
  TrainingExercise,
  TrainingPlan,
  TrainingPlanExercise,
  User,
} from "@prisma/client";

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
};

export type TrainingPlanWithDetails = TrainingPlan & {
  match: Match & {
    user: User | null;
  };
  exercises: (TrainingPlanExercise & {
    trainingExercise: TrainingExercise;
  })[];
};
