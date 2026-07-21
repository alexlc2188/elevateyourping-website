"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrainingExercise } from "@prisma/client";
import { ApiResponse } from "@/types/trainingPlan";
import { PlusCircle } from "lucide-react";

interface ExerciseSelectorModalProps {
  selectedIds: string[];
  onSelect: (exercise: TrainingExercise) => void;
}

export function ExerciseSelectorModal({
  selectedIds,
  onSelect,
}: ExerciseSelectorModalProps) {
  const [exercises, setExercises] = useState<TrainingExercise[]>([]);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchExercises = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/exercises");
        const json = (await res.json()) as ApiResponse<TrainingExercise[]>;

        if (!res.ok || !json.success) {
          console.error("API returned error:", json.error);
          setExercises([]);
          return;
        }

        setExercises(json.data);
      } catch (err) {
        console.error("Unexpected fetch error", err);
        setExercises([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [open]);

  const filtered = exercises?.filter(
    (ex) =>
      filter === "" || ex.label?.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Exercise</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg space-y-4">
        <DialogTitle>Select Exercise</DialogTitle>
        <div className="space-y-2">
          <Input
            placeholder="Search exercises..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {loading ? (
              <div className="text-sm text-muted-foreground">
                Loading exercises...
              </div>
            ) : (
              filtered.map((exercise) => (
                <button
                  key={exercise.id}
                  className="group relative w-full text-left border rounded-md p-3 hover:bg-accent disabled:opacity-50 cursor-pointer transition"
                  disabled={selectedIds.includes(exercise.id)}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelect(exercise);
                    setOpen(false);
                  }}>
                  <div className="font-medium text-sm">{exercise.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {exercise.practiceInstruction}
                  </div>

                  {/* PlusCircle appears only on hover */}
                  <PlusCircle
                    className="absolute top-2 right-2 w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-hidden
                  />
                </button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
