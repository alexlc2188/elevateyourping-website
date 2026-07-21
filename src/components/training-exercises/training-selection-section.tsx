"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { TrainingExercise, Video } from "@prisma/client";
import { updateTrainingPlanExerciseOrderAction } from "@/actions/admin/trainingPlansActions";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { useRouter } from "next/navigation";
import {
  removeExerciseFromCollectionAction,
  updateExerciseOrderInCollectionAction,
} from "@/actions/admin/genericActions";

type Mode = "plan" | "pack";

interface Props {
  mode: Mode;
  trainingPlanId?: string;
  trainingPackId?: string;
  matchId?: string;
  initialData: {
    totalExerciseCount: number;
    exercises: {
      id: string;
      trainingExercise: TrainingExercise & {
        mainVideo?: Video | null;
      };
    }[];
  };
  addExerciseHref: string;
}

export const TrainingSelectionSection = ({
  initialData,
  mode,
  trainingPackId,
  trainingPlanId,
  matchId,
  addExerciseHref,
}: Props) => {
  const [items, setItems] = useState(initialData.exercises);
  const router = useRouter();

  const onReorder = async (orderedIds: { id: string; position: number }[]) => {
    try {
      let res;

      if (mode === "plan" && trainingPlanId) {
        res = await updateExerciseOrderInCollectionAction({
          parentId: trainingPlanId,
          orderedIds,
          collectionType: "plan",
        });
      } else if (mode === "pack" && trainingPackId) {
        res = await updateExerciseOrderInCollectionAction({
          parentId: trainingPackId,
          collectionType: "pack",
          orderedIds,
        });
      } else {
        throw new Error("Invalid mode or missing ID.");
      }

      if (!res.success) throw new Error(res.error);
      toast.success("Order saved");
    } catch (err: any) {
      toast.error(err.message || "Failed to reorder");
    }
  };

  const handleRemove = async (exerciseId: string) => {
    const prevItems = items;
    setItems((prev) =>
      prev.filter((item) => item.trainingExercise.id !== exerciseId),
    );

    const parentId =
      mode === "plan"
        ? trainingPlanId
        : mode === "pack"
        ? trainingPackId
        : null;

    if (!parentId) {
      toast.error("Missing ID for removal.");
      setItems(prevItems); // rollback
      return;
    }

    const res = await removeExerciseFromCollectionAction({
      collectionType: mode,
      parentId,
      exerciseId,
    });

    if (!res.success) {
      toast.error(res.error || "Failed to remove");
      setItems(prevItems); // rollback
      return;
    }

    toast.success("Exercise removed.");
    router.refresh();
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const reordered = [...items];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setItems(reordered);

    const orderedIds = reordered.map((item, index) => ({
      id: item.id,
      position: index,
    }));

    await onReorder(orderedIds);
  };

  return (
    <div className="mt-6 bg-muted/30 rounded-xl border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg tracking-tight">
          {mode === "pack" ? "Training Pack Videos" : "Training Plan Videos"}
        </h2>
        <Button asChild variant="outline">
          <Link href={addExerciseHref}>Add Exercise Video</Link>
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="exercises">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-4">
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white border shadow-sm rounded-xl p-5 transition hover:shadow-md">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab">
                            <GripVertical className="size-5" />
                          </div>
                          Drag to reorder
                        </div>
                        <ConfirmDialog
                          onConfirm={() =>
                            handleRemove(item.trainingExercise.id)
                          }>
                          <Button size="icon" variant="ghost">
                            <X className="size-5 text-muted-foreground hover:text-red-500 transition" />
                          </Button>
                        </ConfirmDialog>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-1 space-y-2">
                          <h3 className="text-lg font-semibold">
                            {item.trainingExercise.label}
                          </h3>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {item.trainingExercise.practiceInstruction}
                          </p>
                        </div>

                        {item.trainingExercise.mainVideo?.publicUrl ? (
                          <video
                            src={item.trainingExercise.mainVideo.publicUrl}
                            controls
                            muted
                            className="w-48 h-28 rounded border object-cover shrink-0"
                          />
                        ) : (
                          <div className="text-sm italic text-muted-foreground">
                            No video
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
