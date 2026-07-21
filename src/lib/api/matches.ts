import { z } from "zod";
import { createMatchSchema } from "../validators/matches/matchSchema";

type CreateMatchInput = z.infer<typeof createMatchSchema>;

export async function createMatch(input: CreateMatchInput) {
  const validation = createMatchSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      issues: validation.error.flatten().fieldErrors,
    };
  }

  // ✅ Use the validated data, not the original input @jerome => safer
  const validatedData = validation.data;

  try {
    const res = await fetch("/api/matches/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data?.error || "Unknown error" };
    }

    return { success: true, match: data.match };
  } catch (err) {
    return { success: false, error: "Network or server error" };
  }
}
