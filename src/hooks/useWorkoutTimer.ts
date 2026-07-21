import { useEffect, useRef, useState } from "react";
import { releaseWakeLock, requestWakeLock } from "@/lib/wakeLock";

export function useWorkoutTimer({
  duration,
  onComplete,
  onWakeLockFallback,
}: {
  duration: number;
  onComplete?: () => void;
  onWakeLockFallback?: () => void;
}) {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);

  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const startTimer = () => {
    setIsTimerRunning(true);
    setIsPaused(false);
    setIsComplete(false);
    requestWakeLock(wakeLockRef, onWakeLockFallback, () => {
      console.warn("Wake Lock released");
    });
  };

  const stopTimer = async () => {
    setIsTimerRunning(false);
    setIsPaused(false);
    setTimeLeft(duration);
    setIsComplete(false);
    await releaseWakeLock(wakeLockRef);
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
  };

  const togglePause = () => setIsPaused((prev) => !prev);

  // inside your hook
  const handleOnComplete = () => {
    setIsTimerRunning(false);
    setIsComplete(true);
    onComplete?.(); // still optional
  };

  useEffect(() => {
    if (!isTimerRunning || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleOnComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, isPaused]);

  useEffect(() => {
    return () => {
      releaseWakeLock(wakeLockRef);
    };
  }, []);

  return {
    timeLeft,
    isTimerRunning,
    isPaused,
    isComplete,
    startTimer,
    stopTimer,
    togglePause,
    alarmRef,
    wakeLockRef,
    setTimeLeft,
    setIsComplete,
    setIsPaused,
    setIsTimerRunning,
  };
}
