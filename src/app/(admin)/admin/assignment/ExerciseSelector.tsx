"use client";
import { TrainingExerciseCard } from "@/components/exercise/TrainingExerciseCard";
import { TrainingExercise } from "@prisma/client";
import React, { useState } from "react";

export const ExerciseSelector = ({
  trainingExercises,
}: {
  trainingExercises: TrainingExercise[];
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div>
      {!ready && (
        <div className="space-y-4 max-w-md mx-auto text-center mb-8">
          <p className="text-lg">Are you ready to assign exercises?</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setReady(true)}
              className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
              Assign to Match
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Exercises */}
      {ready && (
        <div className="grid grid-cols-3">
          {trainingExercises.map((exercise, idx) => (
            <div
              key={exercise.id}
              className={`border-2 rounded-xl p-1 transition ${
                selected.includes(exercise.id)
                  ? "border-black bg-slate-100"
                  : "border-transparent"
              }`}
              onClick={() => toggleSelection(exercise.id)}>
              <TrainingExerciseCard exercise={{ ...exercise }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
