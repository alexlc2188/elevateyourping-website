"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { typeColors } from "@/constants/training";
import { useState } from "react";
import { TimerBar } from "./timerBar";
import { useWorkoutTimer } from "@/hooks/useWorkoutTimer";

import VideoPlayer from "../video-player";
import { TrainingExerciseWithVideos } from "./training";

export const TrainingPreviewCard = ({
  exercises,
  activeIndex = 0,
  setActiveIndex,
}: {
  exercises: TrainingExerciseWithVideos[];
  activeIndex?: number;
  setActiveIndex?: (i: number) => void;
}) => {
  const [videoType, setVideoType] = useState<"preview" | "tutorial">("preview");
  const [shouldPlay, setShouldPlay] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const exercise = exercises[activeIndex];

  // Exercise is now loaded

  const playAlarm = () => {
    if (alarmRef.current) {
      alarmRef.current.currentTime = 0;
      alarmRef.current.play();
    }
  };

  const showSafariDialog = () => {
    // open a modal or toast here
    setShowInstallPrompt(true);
  };

  const {
    timeLeft,
    isTimerRunning,
    isPaused,
    isComplete,
    startTimer,
    wakeLockRef,
    stopTimer,
    togglePause,
    alarmRef,
    setTimeLeft,
    setIsComplete,
    setIsPaused,
    setIsTimerRunning,
  } = useWorkoutTimer({
    duration: exercise?.duration ?? 0,
    onComplete: playAlarm,
    onWakeLockFallback: showSafariDialog,
  });

  if (!exercise) return null;

  return (
    <Card className="lg:flex-1">
      <CardHeader className="items-start space-y-2">
        <div className="flex justify-between items-center">
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full font-medium capitalize",
              typeColors[exercise.type].pill,
              typeColors[exercise.type].text
            )}
          >
            {exercise.type}
          </span>
          <span className="text-xs text-muted-foreground">
            🕒 Duration: {Math.floor(exercise.duration / 60)} min
          </span>
        </div>

        <CardTitle className="text-2xl font-bold">{exercise.label}</CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          {exercise.practiceInstruction}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Video Player with Tabs */}
        <div className="border border-slate-300 rounded-xl overflow-hidden">
          {/* Video Tabs */}
          <div className="flex bg-slate-200 border-b border-gray-300">
            <button
              onClick={() => {
                setVideoType("preview");
                setShouldPlay(true);
              }}
              className={cn(
                "flex-1 px-3 py-2 text-sm font-medium transition-all duration-200",
                videoType === "preview"
                  ? "bg-blue-500 text-white"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              🏓 Demo
            </button>
            <button
              onClick={() => {
                setVideoType("tutorial");
                setShouldPlay(true);
              }}
              className={cn(
                "flex-1 px-3 py-2 text-sm font-medium transition-all duration-200",
                videoType === "tutorial"
                  ? "bg-blue-500 text-white"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              ▶️ Tutorial
            </button>
          </div>

          <div className="w-full aspect-[16/9] relative">
            <VideoPlayer
              // poster={`/images/exercises-poster-bg/${exercise.type}.jpg`}
              poster={exercise.thumbnail || undefined}
              overlayTitle={exercise.label}
              videoUrl={
                videoType === "preview"
                  ? exercise.previewVideo?.streamingUrl ??
                    exercise.previewVideo?.publicUrl ??
                    null
                  : exercise?.mainVideo?.streamingUrl ??
                    exercise?.mainVideo?.publicUrl ??
                    null
              }
              onEnded={() => setShouldPlay(false)}
              forcePlay={shouldPlay}
              rounded={false}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col">
        <Button
          className="w-full bg-red-600 text-white"
          onClick={isTimerRunning ? stopTimer : startTimer}
        >
          {isTimerRunning ? "Stop Timer" : "Start Timer"}
        </Button>

        {isTimerRunning && (
          <TimerBar timeLeft={timeLeft} duration={exercise.duration} />
        )}

        {isComplete ? (
          <div className="mt-4 px-4 py-3 rounded-lg border border-green-500 bg-green-50 shadow-inner animate-pulse-soft">
            <p className="text-green-700 font-semibold text-sm text-center mb-3">
              ✅ Drill complete!
            </p>
            <div className="flex justify-center">
              <Button
                variant={"default"}
                className="bg-green-500"
                onClick={() => {
                  setIsComplete(false);
                  setTimeLeft(exercise.duration);
                  setIsPaused(false);
                }}
              >
                Got It
              </Button>
            </div>
          </div>
        ) : (
          isTimerRunning && (
            <div className="flex justify-center mt-2">
              <Button variant="outline" size="sm" onClick={togglePause}>
                {isPaused ? "▶ Resume" : "⏸ Pause"}
              </Button>
            </div>
          )
        )}
      </CardFooter>
    </Card>
  );
};
