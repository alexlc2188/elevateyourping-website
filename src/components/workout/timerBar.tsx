// components/WorkoutTimerOverlay.tsx
"use client";
import { formatTime } from "@/lib/utils"; // Adjust the import based on your setup

export const TimerBar = ({
  timeLeft,
  duration,
}: {
  duration: number; // in seconds
  timeLeft: number; // in seconds
}) => {
  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="mt-4 text-center w-full">
      <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
        <div
          className="absolute top-0 left-0 h-full bg-red-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-lg font-bold text-slate-900">
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};
