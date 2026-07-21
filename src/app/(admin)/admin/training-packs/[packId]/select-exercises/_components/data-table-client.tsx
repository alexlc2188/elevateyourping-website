"use client";
import { Tag, TrainingPackExercise } from "@prisma/client";
import {
  ExerciseWithRelations,
  getExerciseColumns,
} from "./get-exercise-columns";
import { DataTable } from "./data-table";

export interface DataTableProps {
  data: ExerciseWithRelations[];
  total: number;
  trainingPackId: string;
  availableTags: Tag[];
  trainingPackExercises: TrainingPackExercise[];
}

export function DataTableClient<
  TData extends { id: string; label: string },
  TValue,
>({
  data,
  total,
  trainingPackId,
  availableTags,
  trainingPackExercises,
}: DataTableProps) {
  const columns = getExerciseColumns(trainingPackId, trainingPackExercises); // ✅ safe now, it's on client

  return (
    <DataTable<ExerciseWithRelations, any>
      columns={columns}
      data={data}
      total={total}
      availableTags={availableTags}
      trainingPackExercises={trainingPackExercises}
    />
  );
}
