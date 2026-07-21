"use client";
import React from "react";
import { Tag, TrainingExercise } from "@prisma/client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Form } from "@/components/ui/form";

import { createExerciseAdvancedSchema } from "@/lib/validators/createExerciseAdvancedSchema";
import StepTwoFields from "../../_components/step-two-field";

import { BackButton } from "@/components/back-button";
import { updateExerciseAdvancedSettingsAction } from "@/actions/admin/exercises";

type FormValues = z.infer<typeof createExerciseAdvancedSchema>;

interface Props {
  exercise: TrainingExercise;
  availableTags: Tag[]
}
export const EditAdvancedFormClient = ({ exercise, availableTags = [] }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(createExerciseAdvancedSchema),
    defaultValues: {}, // will be filled later
  });

  const requiredFields = [
    form.watch("coachNotes"),
    form.watch("focusAreas"),
    form.watch("intensityScore"),
    form.watch("reps"),
    form.watch("skillLevel"),
    form.watch("tags"),
    form.watch("reps"),
  ];

  const isDisabled = requiredFields.every((field) => !field);

  const onSubmit = async (data: FormValues) => {
    const res = await updateExerciseAdvancedSettingsAction(exercise.id, data);
    if (res.success) {
      toast.success("Exercise updated");
      router.push("/admin/exercises");
    } else {
      toast.error("Failed to update exercise");
    }
  };

  if (loading) {
    return <Skeleton className="h-48 w-full rounded-md" />;
  }

  return (
    <main className="py-10 space-y-6">
      <BackButton />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Filtering Options</h1>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <StepTwoFields
            exercise={exercise}
            isStepOneValid={!isDisabled}
            submitButtonLabel="UPDATE"
            availableTags={availableTags}
          />
        </form>
      </Form>
    </main>
  );
};
