import {
  TrainingPack,
  TrainingPackExercise,
  TrainingExercise,
  Video,
} from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export type TrainingPackWithExercises = TrainingPack & {
  exercises: (TrainingPackExercise & {
    trainingExercise: Pick<TrainingExercise, "id" | "label"> & {
      mainVideo?: Pick<Video, "publicUrl" | "thumbnailUrl"> | null;
    };
  })[];
};

export interface DataTableProps {
  columns: ColumnDef<TrainingPackWithExercises, any>[];
  data: TrainingPackWithExercises[];
  total: number;
}
