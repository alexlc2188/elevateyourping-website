"use client";
import { Dialog } from "@headlessui/react";
import { Play, Pause, Video, X, ChevronLeft, ChevronRight, TimerIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { typeColors } from "@/constants/training";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { TimerBar } from "./timerBar";
import { DurationEditor } from "./durationEditor";
import { FaDumbbell } from "react-icons/fa";
import SafariInstallDialog from "../dialogs/safari-alert-dialog";
import { useWorkoutTimer } from "@/hooks/useWorkoutTimer";
import { releaseWakeLock } from "@/lib/wakeLock";
import { TrainingExerciseWithVideos } from "./training";
import VideoPlayer from "../video-player";

export function WorkoutCarouselModal({
  open,
  onClose,
  exercises = [],
  initialIndex = 0,
  onIndexChange,
}: {
  open: boolean;
  onClose: () => void;
  exercises?: TrainingExerciseWithVideos[];
  initialIndex?: number;
  onIndexChange?: (newIndex: number) => void;
}) {
  const [current, setCurrent] = useState(initialIndex);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [videoType, setVideoType] = useState<"preview" | "tutorial">("preview");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isInteractingWithVideo, setIsInteractingWithVideo] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const exercise = exercises[current];

  const playAlarm = () => {
    if (alarmRef.current) {
      alarmRef.current.currentTime = 0;
      alarmRef.current.play();
    }
  };

  const showSafariDialog = () => {
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

  useEffect(() => {
    return () => {
      releaseWakeLock(wakeLockRef);
    };
  }, []);

  useEffect(() => {
    releaseWakeLock(wakeLockRef);
    setCurrent(initialIndex);
    setTimeLeft(exercises[initialIndex]?.duration ?? 0);
    setVideoType("preview"); // Reset to Demo when modal opens or index changes
    setIsClosing(false); // Reset closing state when modal opens
  }, [initialIndex, open]);

  const goNext = async () => {
    await releaseWakeLock(wakeLockRef);

    setDirection("left");
    setShouldPlay(false);
    setVideoType("preview"); // Reset to Demo when changing exercises
    const next = (current + 1) % exercises.length;
    setCurrent(next);
    setTimeLeft(exercises[next].duration);
    resetTimerState();
    onIndexChange?.(next);
  };

  const goPrev = async () => {
    await releaseWakeLock(wakeLockRef);
    setDirection("right");
    setShouldPlay(false);
    setVideoType("preview"); // Reset to Demo when changing exercises
    const prev = (current - 1 + exercises.length) % exercises.length;
    setCurrent(prev);
    setTimeLeft(exercises[prev].duration);
    resetTimerState();
    onIndexChange?.(prev);
  };

  const resetTimerState = () => {
    setIsTimerRunning(false);
    setIsPaused(false);
    setIsComplete(false);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      // Check if swipe originated from video area
      const target = eventData.event.target as HTMLElement;
      const videoContainer = target.closest("[data-video-container]");

      // Only allow swipe if not from video area and other conditions are met
      if (
        !videoContainer &&
        !isVideoPlaying &&
        !isInteractingWithVideo &&
        !isTimerRunning
      ) {
        goNext();
      }
    },
    onSwipedRight: (eventData) => {
      // Check if swipe originated from video area
      const target = eventData.event.target as HTMLElement;
      const videoContainer = target.closest("[data-video-container]");

      // Only allow swipe if not from video area and other conditions are met
      if (
        !videoContainer &&
        !isVideoPlaying &&
        !isInteractingWithVideo &&
        !isTimerRunning
      ) {
        goPrev();
      }
    },
    onSwipedDown: (eventData) => {
      // Check if swipe originated from video area or scrollable text area
      const target = eventData.event.target as HTMLElement;
      const videoContainer = target.closest("[data-video-container]");
      const textArea = target.closest("[data-scrollable-text]");

      // Allow swipe down to close modal (but not from video area or text area)
      if (
        !videoContainer &&
        !textArea &&
        !isInteractingWithVideo &&
        !isClosing
      ) {
        setIsClosing(true);
        // Add a small delay for animation, then close
        setTimeout(() => {
          handleOnClose();
        }, 200);
      }
    },
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false, // Disable mouse tracking to prevent accidental swipes
    delta: 30, // Increase delta to require more deliberate swipes
  });

  function handleOnClose() {
    releaseWakeLock(wakeLockRef);
    onClose();
  }

  if (!exercise) return null;

  return (
    <>
      <audio
        ref={alarmRef}
        src="/sounds/alarm-exercise-finished.mp3"
        preload="auto"
      />
      <Dialog
        as="div"
        open={open}
        onClose={handleOnClose}
        className="relative z-50"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") goPrev();
          if (e.key === "ArrowRight") goNext();
        }}>
        <div
          {...swipeHandlers}
          className="fixed inset-0 flex items-center justify-center px-4 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/70"
            onClick={handleOnClose}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md overflow-hidden">
            <AnimatePresence
              mode="popLayout"
              initial={false}
              custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ x: direction === "left" ? 300 : -300, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  y: isClosing ? 100 : 0,
                  scale: isClosing ? 0.95 : 1,
                }}
                exit={{ x: direction === "left" ? -300 : 300, opacity: 0 }}
                transition={{
                  type: "tween",
                  ease: "easeInOut",
                  duration: isClosing ? 0.2 : 0.25,
                }}
                className="transform-gpu  bg-white rounded-xl w-full max-w-md p-6 relative text-center touch-pan-y pt-10">
                {/* Header Navigation */}
                <div className="mb-4">
                  {/* Navigation and title */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <button
                      onClick={goPrev}
                      disabled={current === 0}
                      className={cn(
                        "p-3 rounded-full transition-all border-2",
                        current === 0
                          ? "text-slate-300 cursor-not-allowed border-slate-200"
                          : "text-slate-700 hover:text-white hover:bg-blue-500 border-slate-300 hover:border-blue-500",
                      )}>
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="text-center flex-1 mx-4">
                      <h2 className="text-xl font-semibold">
                        {exercise.label}
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">
                        Exercise {current + 1} of {exercises.length}
                      </p>
                    </div>

                    <button
                      onClick={goNext}
                      disabled={current === exercises.length - 1}
                      className={cn(
                        "p-3 rounded-full transition-all border-2",
                        current === exercises.length - 1
                          ? "text-slate-300 cursor-not-allowed border-slate-200"
                          : "text-slate-700 hover:text-white hover:bg-blue-500 border-slate-300 hover:border-blue-500",
                      )}>
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 ">
                  <span
                    className={cn(
                      "text-sm px-3 py-1 rounded-lg font-medium capitalize",
                      typeColors[exercise.type].pill,
                      typeColors[exercise.type].text,
                    )}>
                    {exercise.type}
                  </span>
                  <DurationEditor
                    duration={timeLeft}
                    setDuration={(newSeconds) => {
                      setTimeLeft(newSeconds);
                    }}
                    disabled={isTimerRunning}
                  />
                </div>

                {!isTimerRunning && (
                  <div className="py-2">
                    {exercise.type === "footwork" &&
                    exercise.repsInstruction ? (
                      <div className="flex justify-center items-center text-sm font-medium text-muted-foreground">
                        <FaDumbbell className="w-4 h-4 mr-2" />
                        <span>{exercise.repsInstruction}</span>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Video Player with Tabs */}
                <div
                  data-video-container
                  className={cn(
                    "border border-slate-300 rounded-xl overflow-hidden",
                    isTimerRunning ? "my-4" : "mb-4",
                  )}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseMove={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerMove={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  style={{ touchAction: "auto" }}>
                  {/* Video Tabs */}
                  <div className="flex bg-slate-200 border-b border-slate-300">
                    <button
                      onClick={() => {
                        setVideoType("preview");
                        setShouldPlay(true);
                      }}
                      className={cn(
                        "flex-1 px-3 py-2 text-sm font-medium transition-all duration-200",
                        videoType === "preview"
                          ? "bg-blue-500 text-white"
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100",
                      )}>
                      <div className="flex items-center gap-1 justify-center">
                        🏓 <span>Demo</span>
                      </div>
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
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100",
                      )}>
                      <div className="flex items-center gap-1 justify-center">
                        <Video /> <span>Tutorial</span>
                      </div>
                    </button>
                  </div>

                  <div className="w-full aspect-[16/9] relative">
                    <VideoPlayer
                      key={current}
                      exerciseType={exercise.type}
                      videoUrl={
                        videoType === "preview"
                          ? exercise.previewVideo?.streamingUrl ??
                            exercise.previewVideo?.publicUrl ??
                            null
                          : exercise.mainVideo?.streamingUrl ??
                            exercise.mainVideo?.publicUrl ??
                            null
                      }
                      onEnded={() => setShouldPlay(false)}
                      forcePlay={shouldPlay}
                      rounded={false}
                      showCaptureButton={false}
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                      onUserInteracting={setIsInteractingWithVideo}
                    />
                  </div>
                </div>

                <div
                  data-scrollable-text
                  className="h-[5rem] overflow-y-auto px-2 mb-4"
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}>
                  <p className="text-sm text-slate-700">
                    {exercise.practiceInstruction}
                  </p>
                </div>

                <Button
                  className="w-full mt-4 bg-red-600 text-white"
                  onClick={isTimerRunning ? stopTimer : startTimer}>
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
                        }}>
                        Got It
                      </Button>
                    </div>
                  </div>
                ) : (
                  isTimerRunning && (
                    <div className="flex justify-center mt-2">
                      <Button variant="outline" size="sm" onClick={togglePause}>
                        {isPaused ? (
                           <div className="flex items-center justify-center gap-1">
                            <Play />
                            <span>Resume</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <Pause />
                            <span>Pause</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  )
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Dialog>
      {showInstallPrompt && (
        <SafariInstallDialog
          open={showInstallPrompt}
          onClose={() => setShowInstallPrompt(false)}
        />
      )}
    </>
  );
}
