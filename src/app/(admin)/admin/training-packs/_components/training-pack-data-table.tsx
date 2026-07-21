"use client";

import { getTrainingPackColumns } from "./get-training-pack-columns";
import { TrainingPackDataTable } from "./data-table";
import { TrainingPackWithExercises } from "./types";

export interface Props {
  data: TrainingPackWithExercises[];
  total: number;
}

export function TrainingPackDataTableClient({ data, total }: Props) {
  const columns = getTrainingPackColumns();

  return <TrainingPackDataTable columns={columns} data={data} total={total} />;
}
