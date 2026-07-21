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
import { ExerciseActions } from "./exercise-actions";
import { Loader } from "@/components/loader";
import {
  updateExerciseAction,
  updateExerciseAdvancedSettingsAction,
  createExerciseDraftAction,
} from "@/actions/admin/exercises";
import {
  processTags,
  processFocusAreas,
} from "@/lib/utils/exercise-data-processing";
import { VideoField } from "./video-field";
import { StepOneFields } from "./step-one-field";
import StepTwoFields from "./step-two-field";
import { createExerciseDraftSchema } from "@/lib/validators/createExerciseDraftSchema";
import { updateExerciseBasicSchema } from "@/lib/validators/updateExerciseBasicSchema";
import { createExerciseAdvancedSchema } from "@/lib/validators/createExerciseAdvancedSchema";

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

type BasicFormValues = z.infer<typeof updateExerciseBasicSchema>;
type AdvancedFormValues = z.infer<typeof createExerciseAdvancedSchema>;
type CreateFormValues = z.infer<typeof createExerciseDraftSchema>;

interface ExerciseFormProps {
  exercise?: TrainingExercise & {
    mainVideo?: Video | null;
    previewVideo?: Video | null;
    tags?: TagRelation[];
    focusAreas?: FocusAreaRelation[];
  };
  availableTags: Tag[];
  isNew?: boolean;
}

export const ExerciseForm = ({
  exercise,
  availableTags = [],
  isNew = false,
}: ExerciseFormProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic info form
  const basicForm = useForm<BasicFormValues>({
    resolver: zodResolver(updateExerciseBasicSchema),
    defaultValues: {
      label: exercise?.label || "",
      duration: exercise?.duration || 300,
      practiceInstruction: exercise?.practiceInstruction || "",
      thumbnail: exercise?.thumbnail || undefined,
      type: exercise?.type || undefined,
      mainVideoId: exercise?.mainVideoId || undefined,
      previewVideoId: exercise?.previewVideoId || undefined,
    },
  });

  // Advanced settings form
  const advancedForm = useForm<AdvancedFormValues>({
    resolver: zodResolver(createExerciseAdvancedSchema),
    defaultValues: {
      coachNotes: exercise?.coachNotes || "",
      focusAreas: exercise?.focusAreas
        ? processFocusAreas(exercise.focusAreas)
        : [],
      intensityScore: exercise?.intensityScore || undefined,
      skillLevel: exercise?.skillLevel || undefined,
      tags: exercise?.tags ? processTags(exercise.tags) : [],
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

  // Combined submit handler for both create and update
  const handleSubmit = async () => {
    console.log("Starting form submission...");
    setIsSubmitting(true);
    try {
      // Get values from both forms
      const basicData = basicForm.getValues();
      console.log("Basic form values:", JSON.stringify(basicData, null, 2));

      if (isNew) {
        // Combine basic and advanced form values for creation
        const advancedData = advancedForm.getValues();
        const createData: CreateFormValues = {
          ...basicData,
          ...advancedData,
        };
        console.log(
          "Prepared combined create data:",
          JSON.stringify(createData, null, 2)
        );

        console.log("Calling createExerciseDraftAction...");
        const res = await createExerciseDraftAction(createData);
        console.log(
          "Response from createExerciseDraftAction:",
          JSON.stringify(res, null, 2)
        );

        if (!res.success || !res.data) {
          // Map backend field errors to form fields
          // Add type guard to safely check for fieldErrors
          if ("fieldErrors" in res && res.fieldErrors) {
            Object.entries(res.fieldErrors).forEach(([field, messages]) => {
              if (Array.isArray(messages)) {
                basicForm.setError(field as any, {
                  type: "server",
                  message: messages.join(", "),
                });
              }
            });
          }
          const errorMessage =
            "error" in res
              ? res.error
              : "Validation failed. Please check the form.";
          toast.error(`Failed to save draft: ${errorMessage}`);
          return;
        }

        console.log("Draft created successfully, redirecting...");
        toast.success("Draft created!");
        router.push(`/admin/exercises/drafts`);
      } else if (exercise) {
        // Update existing exercise
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
      }
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
          initialVideoId={exercise?.mainVideoId || undefined}
          initialVideoUrl={
            exercise?.mainVideo?.streamingUrl ||
            exercise?.mainVideo?.publicUrl ||
            undefined
          }
          videoType="exercises"
          encodingStatus={exercise?.mainVideo?.encodingStatus || undefined}
          onVideoSet={(videoId: string, thumbnailUrl?: string) => {
            basicForm.setValue("mainVideoId", videoId);
          }}
          onVideoDelete={async () => {
            basicForm.setValue("mainVideoId", undefined);

            // If editing an existing exercise, immediately update the database
            if (!isNew && exercise) {
              try {
                const basicData = basicForm.getValues();
                await updateExerciseAction(exercise.id, basicData);
                toast.success("Main video removed");
                router.refresh();
              } catch (error) {
                toast.error("Failed to remove video");
                console.error("Error removing main video:", error);
              }
            }
          }}
        />
        <VideoField
          label="Preview Clip"
          captureFrameRatio="landscape"
          fieldName="previewVideoId"
          initialVideoId={exercise?.previewVideoId || undefined}
          initialVideoUrl={
            exercise?.previewVideo?.streamingUrl ||
            exercise?.previewVideo?.publicUrl ||
            undefined
          }
          videoType="exercises"
          encodingStatus={exercise?.previewVideo?.encodingStatus || undefined}
          onVideoSet={(videoId: string) => {
            basicForm.setValue("previewVideoId", videoId);
          }}
          onVideoDelete={async () => {
            basicForm.setValue("previewVideoId", undefined);

            // If editing an existing exercise, immediately update the database
            if (!isNew && exercise) {
              try {
                const basicData = basicForm.getValues();
                await updateExerciseAction(exercise.id, basicData);
                toast.success("Preview video removed");
                router.refresh();
              } catch (error) {
                toast.error("Failed to remove video");
                console.error("Error removing preview video:", error);
              }
            }
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
                  exercise={
                    exercise || {
                      id: "",
                      label: "",
                      type: "rally", // Default type as rally instead of null
                      duration: 300,
                      practiceInstruction: "",
                      status: "DRAFT",
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      thumbnail: null,
                      repsInstruction: null,
                      coachNotes: null,
                      mainVideoId: null,
                      previewVideoId: null,
                      intensityScore: null,
                      skillLevel: null,
                      entityState: "CREATED",
                    }
                  }
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
        {/* Publish/Unpublish button - only show for existing exercises */}
        <div>
          {!isNew && exercise && (
            <ExerciseActions
              exercise={exercise}
              showEditButton={false}
              buttonSize="default"
              className="mt-2"
            />
          )}
        </div>

        {/* Submit button */}
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
            {isNew ? "Create Exercise" : "Update Exercise"}
          </Button>
        </TooltipWrapper>
      </div>
    </div>
  );
};
