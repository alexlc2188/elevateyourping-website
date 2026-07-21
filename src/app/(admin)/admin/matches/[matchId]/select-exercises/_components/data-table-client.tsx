"use client";
import { Tag, TrainingPlanExercise } from "@prisma/client";
import { ExerciseWithRelations, getExerciseColumns } from "./get-exercise-columns";
import { DataTable } from "./data-table";


export interface DataTableProps {
  data: ExerciseWithRelations[];
  total: number;
  matchId: string;
  availableTags: Tag[];
  trainingPlanExercises: TrainingPlanExercise[];
}

export function DataTableClient<
  TData extends { id: string; label: string },
  TValue,
>({ data, total, matchId, availableTags, trainingPlanExercises }: DataTableProps) {
  const columns = getExerciseColumns(matchId, trainingPlanExercises); // ✅ safe now, it's on client

  return (
    <DataTable<ExerciseWithRelations, any>
      columns={columns}
      data={data}
      total={total}
      availableTags={availableTags}
      trainingPlanExercises={trainingPlanExercises}
    />
  );
}
