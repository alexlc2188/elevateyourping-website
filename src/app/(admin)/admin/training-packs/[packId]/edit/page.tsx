import React from "react";
import { PageHeaderGeneric } from "../../../_components/page-header-generic";
import { prismaDb } from "@/lib/db";

import { Banner } from "@/components/banner";

import { notFound } from "next/navigation";
import { PublishUnpublishButton } from "@/components/buttons/publish-unpublish";
import { TrainingPackBreadcrumbs } from "../../_components/training-pack-breadcrumbs";
import { TrainingPackTitleForm } from "./_components/training-pack-title-form";
import { TrainingPackVideoForm } from "../../_components/training-pack-video-form";
import { TrainingSelectionSection } from "@/components/training-exercises/training-selection-section";
import { TrainingPackLevelForm } from "./_components/training-pack-level-form";
import { TrainingPackDescriptionForm } from "./_components/training-pack-description-form";
import { TrainingPackImageForm } from "./_components/training-pack-image-form";
import { PublishUnpublishButtonTrainingPack } from "@/components/buttons/publish-unpublish-training-pack";
import { TrainingPackTypeForm } from "./_components/training-pack-type-form";

const EditReviewPack = async ({
  params,
}: {
  params: Promise<{ packId: string }>;
}) => {
  const { packId } = await params;

  const [trainingPack, totalExerciseCount] = await Promise.all([
    prismaDb.trainingPack.findUnique({
      where: {
        id: packId,
      },
      include: {
        introVideo: {
          select: {
            id: true,
            publicUrl: true,
            streamingUrl: true,
            thumbnailUrl: true,
            encodingStatus: true,
          },
        },
        exercises: {
          include: {
            trainingExercise: {
              include: {
                previewVideo: true,
              },
            },
          },
        },
      },
    }),
    prismaDb.trainingExercise.count(),
  ]);

  const exerciseCount = totalExerciseCount || 0;

  if (!trainingPack) return notFound();

  const requiredFields = [
    trainingPack.title,
    trainingPack.description,
    trainingPack.level,
    trainingPack.imageUrl,
    trainingPack.introVideo,
    (trainingPack.exercises?.length ?? 0) > 4,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!trainingPack.isPublished && (
        <Banner label="This training pack is unpublished. It will not be visible in the library." />
      )}

      <div className="mt-6">
        <TrainingPackBreadcrumbs trainingPackTitle={trainingPack.title} />
      </div>
      <div className="mt-6">
        <PageHeaderGeneric header="Edit Training Pack" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          {/* TODO: make it work to update different collection or duplicate */}
          <PublishUnpublishButtonTrainingPack
            disabled={!isComplete}
            trainingPackId={trainingPack.id}
            isPublished={trainingPack.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 mt-4 relative">
          {/* LEFT COLUMN — Match Prefilled Info */}
          <div className="relative  border bg-slate-100 rounded-md p-4 space-y-8">
            <TrainingPackTitleForm
              header="Training Pack Title"
              initialData={{
                title: trainingPack.title ?? "",
                packId: trainingPack.id,
              }}
            />
            <TrainingPackDescriptionForm
              header="Training Pack Description"
              initialData={{
                packId: trainingPack.id,
                description: trainingPack.description,
              }}
            />
            <TrainingPackLevelForm
              header="Level difficulty"
              initialData={{
                level: trainingPack.level,
                packId: trainingPack.id,
              }}
            />
            <TrainingPackTypeForm
              header="Training Pack Type"
              initialData={{
                trainingPackType: trainingPack.trainingPackType,
                packId: trainingPack.id,
              }}
            />
            <TrainingPackImageForm
              header="Upload thumbnail image"
              initialData={{
                packId: trainingPack.id,
                imageUrl: trainingPack.imageUrl,
              }}
            />
          </div>

          {/* RIGHT COLUMN — Coach inputs (empty for now) */}
          <div className="bg-white border rounded-md p-6 shadow-sm">
            <p className="text-muted-foreground text-sm">
              This section is for the coach to create a new pack to add to the
              main library.
            </p>

            {/* // TODO: Need to be generic to accept different type of videos. 
            // * need to add the packId
            // */}
            <div className="h-auto">
              <TrainingPackVideoForm
                header="Intro Pack Video"
                initialData={{
                  packId: packId,
                  videoId: trainingPack.introVideo?.id || null,
                  encodingStatus:
                    trainingPack.introVideo?.encodingStatus || null,
                }}
                initialVideoUrl={
                  trainingPack.introVideo?.streamingUrl ||
                  trainingPack.introVideo?.publicUrl ||
                  undefined
                }
                description="Upload the full match video for detailed analysis"
              />
            </div>
            <div className="relative mt-6 border bg-slate-100 rounded-md p-4 space-y-8">
              {trainingPack && (
                <TrainingSelectionSection
                  addExerciseHref={`/admin/training-packs/${packId}/select-exercises`}
                  initialData={{
                    totalExerciseCount: exerciseCount,
                    exercises:
                      trainingPack.exercises?.map((e) => ({
                        id: e.id,
                        trainingExercise: {
                          ...e.trainingExercise,
                          mainVideo: e.trainingExercise.previewVideo ?? null,
                        },
                      })) ?? [],
                  }}
                  mode="pack"
                  trainingPackId={trainingPack.id}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditReviewPack;
