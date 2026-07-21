import React from "react";
import { PageHeaderGeneric } from "../../../_components/page-header-generic";
import { prismaDb } from "@/lib/db";

import { Banner } from "@/components/banner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { FaUser } from "react-icons/fa";
import { SubmittedVideoSection } from "./_components/submitted-video-section";
import { MatchVideoForm } from "../../_components/match-video-form";
import { notFound } from "next/navigation";
import { PublishUnpublishButton } from "@/components/buttons/publish-unpublish";
import { PlanTitleForm } from "./_components/plan-title-form";
import { MatchBreadcrumbs } from "../../_components/match-breadcrumbs";
import { TrainingSelectionSection } from "@/components/training-exercises/training-selection-section";
import { CreateTrainingPlanModal } from "./_components/CreateTrainingPlanModal";
import { ShortSetVideosSection } from "./_components/short-set-videos-section";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const ReviewMatchPage = async ({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) => {
  const { matchId } = await params;

  // Fetch the match with all related data including the review video
  const userMatch = await prismaDb.match.findUnique({
    where: {
      id: matchId,
    },
    include: {
      trainingPlan: {
        include: {
          exercises: {
            include: {
              trainingExercise: {
                include: {
                  mainVideo: true,
                },
              },
            },
            orderBy: { position: "asc" },
          },
        },
      },
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      // Include all videos with encoding status
      reviewVideo: {
        select: {
          id: true,
          publicUrl: true,
          streamingUrl: true,
          thumbnailUrl: true,
          encodingStatus: true,
        },
      },
      highlightVideo: {
        select: {
          id: true,
          publicUrl: true,
          streamingUrl: true,
          thumbnailUrl: true,
          encodingStatus: true,
        },
      },
      detailedSetVideos: {
        include: {
          video: true,
        },
      },
      shortSetVideos: {
        include: {
          video: true,
        },
      },
    },
  });

  if (!userMatch) return notFound();

  // Just fetch the exercise count now that we have the video directly
  const totalExerciseCount = await prismaDb.trainingExercise.count();

  const exerciseCount = totalExerciseCount || 0;

  if (!userMatch) return notFound();

  // Define required fields based on offerType
  const isReviewAndPlan = userMatch.offerType === "REVIEW_AND_PLAN";

  const requiredFields = [
    userMatch.reviewVideoId,
    userMatch.highlightVideoId,
    ...(isReviewAndPlan
      ? [
          userMatch.trainingPlan?.title,
          (userMatch.trainingPlan?.exercises?.length ?? 0) >= 4,
        ]
      : []),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  const { user } = userMatch;
  const userName = userMatch.user?.name ?? "Unknown";

  const trainingPlanId = userMatch?.trainingPlanId;
  const trainingPlan = userMatch?.trainingPlan;
  const exercises = trainingPlan?.exercises;

  if (!trainingPlan) {
    return <CreateTrainingPlanModal matchId={matchId} />;
  }

  return (
    <>
      {!userMatch.isPublished && (
        <Banner label="This match is unpublished. It will not be visible to the customer." />
      )}

      {userMatch.offerType === "REVIEW_ONLY" && (
        <div
          className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4"
          role="alert"
        >
          <p className="font-bold">Review Only</p>
          <p>This match requires a review video. No training plan is needed.</p>
        </div>
      )}

      {userMatch.offerType === "REVIEW_AND_PLAN" && (
        <div
          className="bg-purple-100 border-l-4 border-purple-500 text-purple-700 p-4 mb-4"
          role="alert"
        >
          <p className="font-bold">Review + Training Plan</p>
          <p>
            This match requires a review video, set videos, and a training plan.
          </p>
        </div>
      )}
      <div className="mt-6">
        <MatchBreadcrumbs
          matchTitle={`${user?.name || "Player"} vs ${
            userMatch.opponentName || "Opponent"
          } ${
            userMatch.createdAt
              ? `(${new Date(userMatch.createdAt).toLocaleDateString()})`
              : ""
          }`}
        />
      </div>
      <div>
        <PageHeaderGeneric
          header={`${user?.name || "Player"} vs ${
            userMatch.opponentName || "Opponent"
          } ${userMatch.eventName ? `- ${userMatch.eventName}` : ""}`}
        />
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/app/matches/${userMatch.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View as User
              </Button>
            </Link>
            <PublishUnpublishButton
              disabled={!isComplete}
              matchId={userMatch.id}
              isPublished={userMatch.isPublished}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 mt-4 relative">
          {/* LEFT COLUMN — Match Prefilled Info */}
          <div className="space-y-4 bg-muted/10 p-6 rounded-md lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarImage
                  src={user?.image ?? undefined}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback className="bg-primary">
                  <FaUser className="text-primary-foreground" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{userName}</p>
                <p className="text-sm text-muted-foreground">Player</p>
              </div>
            </div>

            <div className="space-y-8">
              <p>
                <strong>Opponent:</strong>{" "}
                {userMatch.opponentName || "Not provided"}
              </p>
              <p>
                <strong>Final Score:</strong>{" "}
                {userMatch.finalScore || "Not provided"}
              </p>
              <p>
                <strong>Event:</strong> {userMatch.eventName || "Not provided"}
              </p>
              <p>
                <strong>About Me:</strong> {userMatch.aboutMe || "Not provided"}
              </p>
              <p>
                <strong>Player Note:</strong>{" "}
                {userMatch.notes || "Not provided"}
              </p>
              <p>
                <strong>Offer Type:</strong>{" "}
                <span className="capitalize">
                  {userMatch.offerType?.toLowerCase() || "Not specified"}
                </span>
              </p>

              <SubmittedVideoSection match={userMatch} />
            </div>

            <p className="text-xs text-muted-foreground">
              Completion: {completionText}
            </p>
          </div>

          {/* RIGHT COLUMN — Coach inputs (empty for now) */}
          <div className="bg-white border rounded-md p-6 shadow-sm">
            {/* Future: Coach Notes / Drill Selection */}
            <p className="text-muted-foreground text-sm">
              This section is for the coach to review and assign exercises.
            </p>

            {/* Short Set Videos Section */}
            <div className="mb-6">
              <ShortSetVideosSection
                matchId={userMatch.id}
                initialVideos={userMatch.shortSetVideos}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-full">
                <MatchVideoForm
                  header="Match Review Video"
                  videoType="review"
                  initialData={{
                    matchId: userMatch.id,
                    videoId: userMatch.reviewVideoId,
                    encodingStatus:
                      userMatch.reviewVideo?.encodingStatus || null,
                  }}
                  initialVideoUrl={
                    userMatch.reviewVideo?.streamingUrl ||
                    userMatch.reviewVideo?.publicUrl ||
                    undefined
                  }
                  description="Upload the full match video for detailed analysis"
                />
              </div>

              <div className="h-full">
                <MatchVideoForm
                  header="Match Highlights Video"
                  videoType="highlight"
                  initialData={{
                    matchId: userMatch.id,
                    videoId: userMatch.highlightVideoId,
                    encodingStatus:
                      userMatch.highlightVideo?.encodingStatus || null,
                  }}
                  initialVideoUrl={
                    userMatch.highlightVideo?.streamingUrl ||
                    userMatch.highlightVideo?.publicUrl ||
                    undefined
                  }
                  description="Upload a short highlights video of key moments"
                />
              </div>

              {/* TODO: IF FULL 5 SET REVIEW SHOW 5 UPLOADS */}
            </div>

            <div className="relative mt-6 border bg-slate-100 rounded-md p-4 space-y-8">
              <PlanTitleForm
                header="Training Plan Title"
                initialData={{
                  title: userMatch.trainingPlan?.title ?? "",
                  matchId: userMatch.id,
                }}
              />
              {trainingPlanId && (
                <TrainingSelectionSection
                  addExerciseHref={`/admin/matches/${matchId}/select-exercises/?trainingPlanId=${trainingPlanId}`}
                  initialData={{
                    totalExerciseCount: exerciseCount,
                    exercises:
                      exercises?.map((e) => ({
                        id: e.id, // from the TrainingPlanExercise model
                        trainingExercise: {
                          ...e.trainingExercise,
                          mainVideo: e.trainingExercise.mainVideo ?? null, // just ensure it's included
                        },
                      })) ?? [],
                  }}
                  mode="plan"
                  trainingPlanId={trainingPlanId}
                  matchId={userMatch.id}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewMatchPage;
