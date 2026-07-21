// lib/validators/trainingPlanSchema.ts
import { z } from "zod";

export const trainingPlanSchema = z.object({
  matchId: z.string().min(1),
  title: z.string().min(5, "Title too short"),
  exerciseIds: z.array(z.string().min(1)),
});

export const trainingPlanTitleSchema = z.object({
  title: z.string().min(10, {
    message: "Training Plan is required",
  }),
});
