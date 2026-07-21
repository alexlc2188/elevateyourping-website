"use client";
import React, { useRef, useState } from "react";
import TrainingCell from "./trainingCell";
import { TrainingStepType } from "@/__data/users-simplified";
import { WorkoutCarouselModal } from "./workoutCarouselModal";
import { Prisma } from "@prisma/client";
import { TrainingModeEmptyState } from "./TrainingModeEmptyState";
import { usePathname } from "next/navigation";

export type TrainingExerciseWithVideos = Prisma.TrainingExerciseGetPayload<{
  include: {
    mainVideo: {
      select: {
        publicUrl: true;
        streamingUrl: true;
      };
    };
    previewVideo: {
      select: {
        publicUrl: true;
        streamingUrl: true;
      };
    };

    tags: {
      include: {
        tag: true;
      };
    };
  };
}>;

export const Training = ({
  exercises,
  noWorkoutMessage,
  startWithFirstExercise,
  activeIndex,
  setActiveIndex,
}: {
  exercises: TrainingExerciseWithVideos[];
  noWorkoutMessage?: string;
  startWithFirstExercise?: boolean;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}) => {
  // const [activeIndex, setActiveIndex] = useState(0);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const pathname = usePathname();

  const isMatchRoute = pathname.includes("/matches");

  // Auto-open the first exercise if startWithFirstExercise is true
  React.useEffect(() => {
    if (startWithFirstExercise && exercises.length > 0) {
      // Don't auto-open on initial render to avoid conflicts with button click
      // The button will handle opening the first exercise
    }
  }, [startWithFirstExercise, exercises]);

  const handlePreview = (videoId: string, idx: number) => {
    setActiveIndex?.(idx);
    // Log the video ID and full exercise object for debugging
    const exercise = exercises[idx];
    const timestamp = new Date().toISOString();

    // Get the video IDs for direct database lookup
    const mainVideoId = exercise.mainVideoId;
    const previewVideoId = exercise.previewVideoId;

    console.log(`DEBUG [${timestamp}] - Exercise clicked:`, {
      videoId,
      mainVideoId,
      previewVideoId,
      exercise: {
        ...exercise,
        // Include specific video details if available
        mainVideo: exercise.mainVideo,
        previewVideo: exercise.previewVideo,
      },
      // Add cache-busting timestamp to help with debugging
      _debug: {
        timestamp,
        cacheBust: Math.random().toString(36).substring(2, 15),
      },
    });

    // Log a message if streamingUrl is missing
    if (mainVideoId && !exercise.mainVideo?.streamingUrl) {
      console.warn(
        `WARNING: streamingUrl is missing for mainVideo (ID: ${mainVideoId})`,
      );
    }

    if (previewVideoId && !exercise.previewVideo?.streamingUrl) {
      console.warn(
        `WARNING: streamingUrl is missing for previewVideo (ID: ${previewVideoId})`,
      );
    }

    // Only open modal on mobile/tablet (disable on desktop)
    const disableModal =
      typeof window !== "undefined" && window.innerWidth >= 1024;
    if (!disableModal) {
      setCurrentVideoId(videoId);
      setShowModal(true);
    }
    // optionally scroll the cell into view:
    cellRefs.current[idx]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div className=" flex flex-col h-full relative ">
      <div
        className="overflow-y-auto flex-1 no-scrollbar "
        ref={scrollContainerRef}>
        {exercises?.length ? (
          <div className="space-y-3 ">
            {exercises.map((exercise, i) => (
              <div
                key={exercise.id}
                ref={(el: HTMLDivElement | null) => {
                  cellRefs.current[i] = el;
                }}>
                <TrainingCell
                  className="training-exercise-item"
                  disableModal={
                    typeof window !== "undefined" && window.innerWidth >= 1024
                  }
                  title={exercise.label}
                  type={exercise.type as TrainingStepType}
                  time={exercise.duration}
                  onPreview={() =>
                    handlePreview(exercise.previewVideoId ?? "", i)
                  }
                  completed={false}
                  active={i === activeIndex}
                  reps={exercise.repsInstruction}
                />
              </div>
            ))}
          </div>
        ) : isMatchRoute ? (
          <div className="flex bg-red-200 flex-col flex-1 p-4 items-center justify-center text-red-600 font-bold">
            <p className="self-center">
              {noWorkoutMessage ?? "No training yet!"}
            </p>
          </div>
        ) : (
          <TrainingModeEmptyState />
        )}
      </div>
      {showModal && currentVideoId && (
        <WorkoutCarouselModal
          open={showModal}
          onClose={() => setShowModal(false)}
          exercises={exercises}
          initialIndex={activeIndex}
          onIndexChange={(newIndex) => {
            setActiveIndex?.(newIndex);
            // keep the parent cell in view too
            cellRefs.current[newIndex]?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }}
        />
      )}
    </div>
  );
};
