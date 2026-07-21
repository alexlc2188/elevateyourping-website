import { z } from "zod";

export const createExerciseDraftSchema = z.object({
  type: z.enum(["technique", "rally", "serve", "return", "footwork"], {
    errorMap: () => ({ message: "Please select a training type" }),
  }),
  label: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
  duration: z
    .number({ invalid_type_error: "Duration is required" })
    .refine((val): val is number => val !== null, {
      message: "Duration is required",
    }),
  practiceInstruction: z.string().min(25, {
    message: "Description is required and needs a minimum of 25 characters",
  }),
  // Video relations
  mainVideoId: z.string().optional(),
  previewVideoId: z.string().optional(),
  thumbnail: z.string().optional(),

  // Advanced settings fields
  coachNotes: z.string().optional(),
  tags: z.array(z.string()).optional(), // IDs
  focusAreas: z.array(z.string()).optional(), // IDs
  intensityScore: z.coerce.number().min(1).max(5).optional(),
  skillLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  reps: z
    .object({
      sets: z.number().min(1),
      repetitions: z.number().min(1),
    })
    .optional(),
});
