"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Match, TrainingExercise, TrainingPlanExercise } from "@prisma/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ExerciseSelectorModal } from "@/components/admin/trainingPlan/exercise-selector-modal";
import { upsertTrainingPlanAction } from "@/actions/admin/trainingPlansActions";

interface Props {
  trainingPlan: {
    id?: string;
    title: string;
    matchId: string;
    exercises: (TrainingPlanExercise & {
      trainingExercise: TrainingExercise;
    })[];
  } | null;
  match: Match;
}

export function TrainingPlanEditor({ trainingPlan, match }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(trainingPlan?.title ?? "");
  const [selectedExercises, setSelectedExercises] = useState<
    TrainingExercise[]
  >(trainingPlan?.exercises.map((e) => e.trainingExercise) ?? []);

  const selectedIds = selectedExercises.map((e) => e.id);

  const toggleSelect = (id: string) => {
    setSelectedExercises((prev) =>
      prev.some((e) => e.id === id) ? prev.filter((e) => e.id !== id) : prev,
    );
  };

  const handleSubmit = async () => {
    const res = await upsertTrainingPlanAction({
      title,
      matchId: match.id,
      exerciseIds: selectedIds,
    });

    if (res.success) {
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Plan Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Alex's Forehand Focus Plan"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-3xl">Selected Drills</h3>
          <ExerciseSelectorModal
            selectedIds={selectedIds}
            onSelect={(exercise) =>
              setSelectedExercises((prev) => [...prev, exercise])
            }
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {selectedExercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => toggleSelect(exercise.id)}
              className={cn(
                "border rounded-md p-3 text-left",
                selectedIds.includes(exercise.id)
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300",
              )}>
              <h4 className="font-semibold text-2xl">{exercise.label}</h4>
              <p className="text-muted-foreground line-clamp-4">
                {exercise.practiceInstruction}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!title || selectedExercises.length === 0}>
          {trainingPlan?.exercises.length ? "Update Plan" : "Create Plan"}
        </Button>
      </div>
    </div>
  );
}
