import { z } from "zod";

export const createMatchSchema = z
  .object({
    opponentName: z
      .string()
      .min(1, { message: "Please enter your opponent's name." }),

    eventName: z
      .string()
      .optional(),  // Made location/venue optional

    matchDate: z.coerce.date({
      required_error: "Match date is required",
      invalid_type_error: "Invalid date format",
    }),

    finalScore: z
      .string()
      .optional(),  // Made final score optional

    aboutMe: z.string().optional(),

    offerType: z.enum(["LOG", "REVIEW_ONLY", "REVIEW_AND_PLAN"]).optional(),

    logNote: z
      .string()
      .max(1000, { message: "Notes must be under 1000 characters." })
      .optional(),  // Made notes optional and removed minimum length requirement
    setVideoIds: z.array(z.string()).optional(),

    playerSets: z.string().optional(),
    opponentSets: z.string().optional(),  // Made score fields optional
  })
  .superRefine((values, ctx) => {
    // Only validate if one score is provided but not the other
    if ((values.playerSets && !values.opponentSets) || (!values.playerSets && values.opponentSets)) {
      ctx.addIssue({
        path: ["finalScore"],
        code: z.ZodIssueCode.custom,
        message: "If providing a score, please select both player and opponent scores.",
      });
    }
  });
