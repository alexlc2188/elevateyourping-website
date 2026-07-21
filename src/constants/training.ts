import { TrainingExercise } from "@prisma/client";

export const typeColors: Record<
  TrainingExercise["type"],
  { dot: string; pill: string; text: string }
> = {
  technique: {
    dot: "bg-blue-500", // #3B82F6 - calm, structured
    pill: "bg-blue-100",
    text: "text-blue-800",
  },
  rally: {
    dot: "bg-red-500", // #EF4444 - energetic, intense
    pill: "bg-red-100",
    text: "text-red-800",
  },
  serve: {
    dot: "bg-amber-500", // #F59E0B - warm, punchy
    pill: "bg-amber-100",
    text: "text-amber-800",
  },
  return: {
    dot: "bg-purple-500", // #8B5CF6 - dynamic, reactive
    pill: "bg-purple-100",
    text: "text-purple-800",
  },
  footwork: {
    dot: "bg-emerald-500", // #10B981 - vibrant, movement
    pill: "bg-emerald-100",
    text: "text-emerald-800",
  },
};

