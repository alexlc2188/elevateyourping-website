import React from "react";

import { PageHeader } from "../exercises/_components/page-header";
import { z } from "zod";
import AssignmentForPack from "./_components/AssignmentForPack";
import AssignmentForMatch from "./_components/AssignmentForMatch";
import { ExerciseSelector } from "./ExerciseSelector";
import { trainingExercises } from "./_mockData";

// The function signature for searchParams in app router
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const querySchema = z.object({
  matchId: z.string().optional(),
  packId: z.string().optional(),
  search: z.string().optional(),
  type: z.string().optional(),
  skillLevel: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

export default async function AssignmentPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const data = querySchema.parse(searchParams);

  const { matchId, packId, search, type, skillLevel, page, limit } = data;

  // If neither id is provided, show a message or redirect
  if (!matchId && !packId) {
    return (
      <div className="p-8 text-center text-slate-500">
        No match or training pack selected. <br />
        Please{" "}
        <a href="/admin/matches" className="text-primary underline">
          choose one
        </a>{" "}
        to continue.
      </div>
    );
    // OR: redirect("/admin/matches");
  }

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <PageHeader
        title="Assign Training Exercises"
        exerciseTitle="assignments"
      />

      {data.matchId && <AssignmentForMatch matchId={data.matchId} />}

      {data.packId && <AssignmentForPack packId={data.packId} />}

      {/* // EXERCISE LIST */}
      <ExerciseSelector trainingExercises={trainingExercises} />
    </div>
  );
}
