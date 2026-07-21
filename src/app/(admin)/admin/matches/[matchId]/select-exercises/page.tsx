import { prisma } from "@/lib/prisma";
import { SkillLevel } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { SortingState } from "@tanstack/react-table";
import { PageHeaderGeneric } from "../../../_components/page-header-generic";
import { DataTableClient } from "./_components/data-table-client";
import { redirect } from "next/navigation";
import { BackButton } from "@/components/back-button";
import { ExerciseWithRelations } from "./_components/get-exercise-columns";

const querySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce
    .number()
    .optional()
    .default(10)
    .transform((val) => Math.min(val, 10)), // Ensure limit never exceeds 10
  query: z.string().optional(),
  tags: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",") : [])),
  focusAreas: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",") : [])),
  skillLevel: z.nativeEnum(SkillLevel).optional(),
  intensityScore: z
    .string()
    .optional()
    .transform((val) => {
      const parsed = Number(val);
      return isNaN(parsed) ? undefined : parsed;
    }),
  trainingPlanId: z.string().optional(),
  sort: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return [];
      try {
        return JSON.parse(val) as SortingState;
      } catch {
        return [];
      }
    }),
});

type Props = {
  params: Promise<{ matchId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SelectExercisePage({
  params,
  searchParams,
}: Props) {
  const { matchId } = await params;

  const resolvedSearchParams = await searchParams;

  // Build the where clause based on search params
  const {
    page,
    limit,
    tags,
    focusAreas,
    skillLevel,
    intensityScore,
    query,
    sort,
    trainingPlanId,
  } = querySchema.parse(resolvedSearchParams);

  if (!trainingPlanId) {
    redirect("/admin/matches");
  }

  const skip = (page - 1) * limit;

  const where: Prisma.TrainingExerciseWhereInput = {
    AND: [
      skillLevel ? { skillLevel } : {},
      { status: "PUBLISHED" },
      intensityScore ? { intensityScore } : {},
      ...(tags.length > 0
        ? tags.map((tagId) => ({
            tags: {
              some: {
                tag: {
                  id: tagId,
                },
              },
            },
          }))
        : []),
      focusAreas.length > 0
        ? {
            focusAreas: {
              some: { focusArea: { id: { in: focusAreas } } },
            },
          }
        : {},
      query
        ? {
            OR: [
              { label: { contains: query, mode: "insensitive" } },
              { coachNotes: { contains: query, mode: "insensitive" } },
              { practiceInstruction: { contains: query, mode: "insensitive" } },
            ],
          }
        : {},
    ],
  };

  const [exercises, total, trainingPlan] = await Promise.all([
    prisma.trainingExercise.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        label: true,
        coachNotes: true,
        intensityScore: true,
        skillLevel: true,
        createdAt: true,
        updatedAt: true,
        mainVideo: {
          select: {
            publicUrl: true,
            thumbnailUrl: true,
          },
        },

        tags: {
          select: { tag: { select: { id: true, name: true } } },
        },
        focusAreas: {
          select: { focusArea: { select: { id: true, name: true } } },
        },
      },
    }) as Promise<ExerciseWithRelations[]>,
    prisma.trainingExercise.count({ where }),
    prisma.trainingPlan.findUnique({
      where: {
        id: trainingPlanId,
      },
      select: {
        exercises: {
          include: {
            trainingExercise: {
              select: {
                label: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const allTags = await prisma.tag.findMany({
    select: { id: true, name: true },
  });

  const trainingPlanExercises = trainingPlan?.exercises ?? [];

  return (
    <div>
      <PageHeaderGeneric header="Exercise Selector" />
      <BackButton />
      <section className="py-4">
        <p className="font-bold">Exercises in Plan: </p>
        {trainingPlanExercises.length === 0 && (
          <p>No exercises in this plan !</p>
        )}
        {trainingPlanExercises.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {trainingPlanExercises.map((exercise) => (
              <span
                key={exercise.id}
                className="text-sm px-3 py-1 rounded-full border border-primary text-muted-foreground shadow-sm">
                {exercise.trainingExercise.label}
              </span>
            ))}
          </div>
        )}
      </section>
      <DataTableClient
        availableTags={allTags}
        total={total}
        data={exercises}
        matchId={matchId}
        trainingPlanExercises={trainingPlan?.exercises ?? []}
      />
    </div>
  );
}
