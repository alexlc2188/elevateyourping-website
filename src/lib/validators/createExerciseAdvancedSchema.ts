import { z } from "zod";

export const createExerciseAdvancedSchema = z.object({
  // New optional fields
  coachNotes: z.string().optional(),
  tags: z.array(z.string()).optional(), // IDs
  focusAreas: z.array(z.string()).optional(), // IDs
  intensityScore: z.coerce.number().min(1).max(5).optional(),
  thumbnail: z.string().optional(),
  skillLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),

  reps: z
    .object({
      sets: z.number().min(1),
      repetitions: z.number().min(1),
    })
    .optional(),
});
