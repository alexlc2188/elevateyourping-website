import Image from "next/image";
import { Play } from "lucide-react";
import { typeColors } from "@/constants/training";
import { SkillLevel, TrainingExercise } from "@prisma/client";
import { cn } from "@/lib/utils";

type Props = {
  exercise: TrainingExercise;
  selected?: boolean;
  onSelect?: (id: string) => void;
};

const difficultyStyles: Record<SkillLevel, string> = {
  BEGINNER: "bg-blue-100 text-blue-800 border border-blue-300",
  INTERMEDIATE: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  ADVANCED: "bg-red-100 text-red-800 border border-red-300",
};

export function TrainingExerciseCard({ exercise, selected, onSelect }: Props) {
  const { pill, text } = typeColors[exercise.type] || {
    pill: "bg-slate-200",
    text: "text-slate-800",
  };

  return (
    <div
      onClick={() => onSelect?.(exercise.id)}
      className={cn(
        "cursor-pointer bg-white rounded-xl overflow-hidden flex items-center gap-4 border shadow-sm p-3 transition hover:shadow-md",
        selected && "ring-2 ring-primary",
      )}>
      <div className="relative w-28 h-28 rounded-md overflow-hidden shrink-0">
        <Image
          src={`https://picsum.photos/600/400?random=${exercise.id}`}
          alt={exercise.type}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <Play className="w-6 h-6 text-white" />
        </div>
        {exercise.skillLevel && (
          <span
            className={`absolute bottom-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
              difficultyStyles[exercise.skillLevel]
            }`}>
            {exercise.skillLevel}
          </span>
        )}
      </div>

      <div className="flex-1">
        <span
          className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${pill} ${text}`}>
          {exercise.type.toUpperCase()}
        </span>
        <p className="font-semibold text-slate-900 mt-1">{exercise.label}</p>
        <p className=" text-muted-foreground text-sm mt-1 line-clamp-3">
          {exercise.practiceInstruction}
        </p>
        <p className="text-sm text-slate-500 mt-1">
          {Math.round(exercise.duration / 60)} min
        </p>
      </div>
    </div>
  );
}
