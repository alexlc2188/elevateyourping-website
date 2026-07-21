"use client";
import { TrainingStepType } from "@/__data/users-simplified";
import { typeColors } from "@/constants/training";
import { cn, formatTime } from "@/lib/utils";
import { CheckCircle, ChevronRight, Play, TimerIcon } from "lucide-react";
import { FaDumbbell } from "react-icons/fa";

type TrainingCellProps = {
  title: string;
  type: TrainingStepType;
  onPreview: () => void;
  completed?: boolean;
  time: number;
  active?: boolean;
  reps?: string | null;
  disableModal?: boolean;
  className?: string;
};

export default function TrainingCell({
  title,
  type,
  onPreview,
  time,
  completed = false,
  active = false,
  reps,
  disableModal = false,
  className,
}: TrainingCellProps) {
  return (
    <div
      className={cn(
        "relative z-10 flex items-center justify-between rounded-xl border px-4 py-3 bg-white shadow-sm mb-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-slate-50   ease-out",
        className,
        active && "border-2 border-blue-600 ",
      )}
      onClick={() => {
        if (disableModal) {
          onPreview(); // triggers inline preview
        } else {
          onPreview(); // same, but in TrainingView we handle modal if not disabled
        }
      }}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn("w-2 h-2 rounded-full", typeColors[type].dot)} />
          <span
            className={cn(
              "text-xs  py-1 rounded-lg font-medium capitalize",
              typeColors[type].text,
            )}>
            {type}
          </span>
        </div>
        <h2 className="font-medium text-2xl text-slate-900">{title}</h2>
        <div className="flex items-center gap-1 text-muted-foreground font-medium text-sm mt-1">
          {type === "footwork" && reps ? (
            <>
              <FaDumbbell className="w-4 h-4" />
              <span>{reps}</span>
            </>
          ) : (
            <>
              <TimerIcon className="w-4 h-4" />
              <p>{formatTime(time)}</p>
            </>
          )}
        </div>
      </div>

      <div className="shrink-0 ml-4">
        {completed ? (
          <CheckCircle className="w-6 h-6 text-green-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-slate-500" />
        )}
      </div>
    </div>
  );
}
