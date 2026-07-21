import { z } from "zod";

export const titlePackFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

export const levelSchema = z.object({
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"], {
    required_error: "Please select a level",
  }),
});

export const trainingPackTypeSchema = z.object({
  type: z.enum(
    ["technique", "rally", "serve", "return", "footwork", "allInOne"],
    {
      required_error: "Please select a training pack type",
    },
  ),
});

export const descriptionSchema = z.object({
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" })
    .max(500, { message: "Description must be at most 500 characters" }),
});

export const imageSchema = z.object({
  image: z
    .custom<FileList>(
      (val) =>
        typeof File !== "undefined" &&
        val instanceof FileList &&
        val.length === 1,
    )
    .refine((file) => file.length === 1, {
      message: "Please upload one image",
    }),
});
