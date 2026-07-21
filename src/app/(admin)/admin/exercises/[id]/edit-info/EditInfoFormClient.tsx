"use client";
import React, { useState } from "react";
import { Tag, TrainingExercise, Video } from "@prisma/client";

import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { ExerciseActions } from "../../_components/exercise-actions";

import { updateExerciseBasicSchema } from "@/lib/validators/updateExerciseBasicSchema";
import { createExerciseAdvancedSchema } from "@/lib/validators/createExerciseAdvancedSchema";
import { Loader } from "@/components/loader";
import {
  updateExerciseAction,
  updateExerciseAdvancedSettingsAction,
} from "@/actions/admin/exercises";
import {
  getMissingFields,
  isReadyToPublish,
} from "@/lib/utils/exercise-validation";
import {
  processTags,
  processFocusAreas,
} from "@/lib/utils/exercise-data-processing";
import { VideoField } from "../../_components/video-field";
import { StepOneFields } from "../../_components/step-one-field";
import StepTwoFields from "../../_components/step-two-field";

type BasicFormValues = z.infer<typeof updateExerciseBasicSchema>;
type AdvancedFormValues = z.infer<typeof createExerciseAdvancedSchema>;

// Define the tag relation type
type TagRelation = {
  id: string;
  trainingExerciseId: string;
  tagId: string;
  tag?: {
    id: string;
    name: string;
  };
};

// Define the focus area relation type
type FocusAreaRelation = {
  id: string;
  trainingExerciseId: string;
  focusAreaId: string;
  focusArea?: {
    id: string;
    name: string;
  };
};

interface Props {
  exercise: TrainingExercise & {
    mainVideo?: Video | null;
    previewVideo?: Video | null;
    tags?: TagRelation[];
    focusAreas?: FocusAreaRelation[];
  };
  availableTags: Tag[];
}

export const EditInfoFormClient = ({ exercise, availableTags = [] }: Props) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic info form
  const basicForm = useForm<BasicFormValues>({
    resolver: zodResolver(updateExerciseBasicSchema),
    defaultValues: {
      label: exercise.label,
      duration: exercise.duration,
      practiceInstruction: exercise.practiceInstruction,
      thumbnail: exercise?.thumbnail ?? undefined,
      type: exercise.type,
      // Use new field names for videos
      mainVideoId: exercise?.mainVideoId ?? undefined,
      previewVideoId: exercise?.previewVideoId ?? undefined,
    },
  });

  // Process tags and focus areas from the database using utility functions

  // Advanced settings form
  const advancedForm = useForm<AdvancedFormValues>({
    resolver: zodResolver(createExerciseAdvancedSchema),
    defaultValues: {
      coachNotes: exercise.coachNotes || "",
      focusAreas: processFocusAreas(exercise.focusAreas),
      intensityScore: exercise.intensityScore || undefined,
      skillLevel: exercise.skillLevel || undefined,
      tags: processTags(exercise.tags),
    },
  });

  // Check if basic form fields are filled
  const requiredBasicFields = [
    basicForm.watch("label"),
    basicForm.watch("duration"),
    basicForm.watch("practiceInstruction"),
    basicForm.watch("type"),
  ];
  const isBasicDisabled = requiredBasicFields.some((field) => !field);

  // Combined submit handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Get values from both forms
      const basicData = basicForm.getValues();
      const advancedData = advancedForm.getValues();

      // Update basic info
      const basicResult = await updateExerciseAction(exercise.id, basicData);

      if (!basicResult.success) {
        toast.error("Failed to update basic info");
        return;
      }

      // Update advanced settings
      const advancedResult = await updateExerciseAdvancedSettingsAction(
        exercise.id,
        advancedData
      );

      if (!advancedResult.success) {
        toast.error("Failed to update advanced settings");
        return;
      }

      toast.success("Exercise updated successfully");
      router.refresh();
    } catch (error) {
      console.error("Error updating exercise:", error);
      toast.error("An error occurred while updating the exercise");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Video uploaders outside the form */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <VideoField
          captureFrameRatio="landscape"
          label="Main Video"
          fieldName="mainVideoId"
          showCaptureButton
          initialVideoId={exercise.mainVideoId || undefined}
          initialVideoUrl={exercise.mainVideo?.publicUrl || undefined}
          initialThumbnailUrl={exercise.thumbnail || undefined}
          onVideoSet={(videoId: string, thumbnailUrl?: string) => {
            basicForm.setValue("mainVideoId", videoId);
            // Set thumbnail if provided
            if (thumbnailUrl) {
              basicForm.setValue("thumbnail", thumbnailUrl);
            }
          }}
        />
        <VideoField
          showCaptureButton
          label="Preview Clip"
          captureFrameRatio="landscape"
          fieldName="previewVideoId"
          initialVideoId={exercise.previewVideoId || undefined}
          initialVideoUrl={exercise.previewVideo?.publicUrl || undefined}
          onVideoSet={(videoId: string) => {
            basicForm.setValue("previewVideoId", videoId);
          }}
        />
      </div>

      {/* Tabs for switching between basic and advanced */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="pt-6">
          <div className="bg-white rounded-md border p-6">
            <FormProvider {...basicForm}>
              <div className="space-y-6">
                <StepOneFields
                  form={basicForm}
                  isStepOneValid={true}
                  submitButtonLabel="" // No button here
                />
              </div>
            </FormProvider>
          </div>
        </TabsContent>

        {/* Advanced Settings Tab */}
        <TabsContent value="advanced" className="pt-6">
          <div className="bg-white rounded-md border p-6">
            <FormProvider {...advancedForm}>
              <div className="space-y-6">
                <StepTwoFields
                  exercise={exercise}
                  isStepOneValid={true}
                  submitButtonLabel="" // No button here
                  availableTags={availableTags}
                />
              </div>
            </FormProvider>
          </div>
        </TabsContent>
      </Tabs>

      {/* Buttons at the bottom */}
      <div className="flex justify-between mt-8">
        {/* Publish/Unpublish button */}
        <div>
          <ExerciseActions
            exercise={exercise}
            showEditButton={false}
            buttonSize="default"
            className="mt-2"
          />
        </div>

        {/* Update button */}
        <TooltipWrapper
          message="Please complete all required fields"
          disabled={!isBasicDisabled}
        >
          <Button
            onClick={handleSubmit}
            disabled={isBasicDisabled || isSubmitting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isSubmitting ? <Loader className="mr-2" /> : null}
            Update Exercise
          </Button>
        </TooltipWrapper>
      </div>
    </div>
  );
};
