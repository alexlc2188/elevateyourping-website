"use client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  FocusArea,
  Tag,
  TrainingExercise,
  TrainingPlanExercise,
} from "@prisma/client";
import { addExercisesToCollectionAction } from "@/actions/admin/genericActions";

export type ExerciseWithRelations = TrainingExercise & {
  tags: { tag: Tag }[];
  focusAreas: { focusArea: FocusArea }[];
  mainVideo?: {
    publicUrl: string;
    thumbnailUrl?: string;
  };
  // trainingExercises: TrainingPlanExercise[]
};

export function getExerciseColumns(
  matchId: string,
  trainingExercises: TrainingPlanExercise[],
): ColumnDef<ExerciseWithRelations>[] {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "label",
      header: "Title",
    },
    {
      accessorKey: "skillLevel",
      header: "Skill Level",
    },
    {
      accessorKey: "intensityScore",
      header: "Intensity",
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.tags.map((t) => (
            <Badge key={t.tag.id}>{t.tag.name}</Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "focusAreas",
      header: "Focus Areas",
      cell: ({ row }) =>
        row.original.focusAreas.map((fa) => fa.focusArea.name).join(", "),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span>{format(new Date(row.original.createdAt), "dd MMM yyyy")}</span>
      ),
    },
    {
      id: "preview",
      header: "Preview",
      cell: ({ row }) => {
        const url = row.original.mainVideo?.publicUrl;
        if (!url)
          return (
            <span className="text-muted-foreground text-xs">No video</span>
          );

        return (
          <video
            src={url}
            controls
            preload="false"
            className="w-full max-w-[200px] h-32 object-cover rounded"
          />
        );
      },
      enableSorting: false,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const exerciseId = row.original.id;

        // ✅ Check if this exercise is already in the plan
        const isAlreadyInPlan = trainingExercises.some(
          (te) => te.trainingExerciseId === exerciseId,
        );

        if (isAlreadyInPlan) {
          return (
            <Badge
              variant="outline"
              className="text-green-700 border-green-500">
              Already Added
            </Badge>
          );
        }

        return (
          <form
            action={async () => {
              setIsLoading(true);
              try {
                const { success, data, error } =
                  await addExercisesToCollectionAction({
                    collectionType: "plan",
                    parentId: matchId,
                    exerciseIds: [exerciseId],
                  });

                if (!success) {
                  throw new Error(error || "Failed to add exercise.");
                }

                toast.success("Exercise added to plan");
                router.refresh(); // Refresh if needed to reflect change
              } catch (err: any) {
                console.error(err);
                toast.error(err.message || "An unexpected error occurred.");
              } finally {
                setIsLoading(false);
              }
            }}>
            <Button type="submit" variant="outline" size="sm">
              {isLoading ? "Adding Exercise ..." : "Add Exercise"}
            </Button>
          </form>
        );
      },
    },
  ];
}
