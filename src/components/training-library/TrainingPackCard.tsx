"use client";
import Image from "next/image";
import { Pack } from "./training-library";
import { cn } from "@/lib/utils";

type Props = {
  pack: Pack;
  onAddToUser: (packId: string) => void;
  onPreview: (pack: Pack) => void;
  isSelected: boolean;
};

const difficultyStyles: Record<NonNullable<Props["pack"]["level"]>, string> = {
  BEGINNER: "bg-blue-100 text-blue-800 border border-blue-300",
  INTERMEDIATE: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  ADVANCED: "bg-red-100 text-red-800 border border-red-300",
};

export const TrainingPackCard = ({
  pack,
  onAddToUser,
  onPreview,
  isSelected,
}: Props) => {
  return (
    <div
      className={cn(
        "bg-white cursor-pointer rounded-xl overflow-hidden flex items-center gap-4 shadow-sm border border-slate-200 hover:shadow-md  p-3 lg:flex-col lg:p-6 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.015]",
        pack.shouldDisplayComingSoon && "opacity-60 cursor-not-allowed",
      )}
      onClick={() => !pack.shouldDisplayComingSoon && onPreview(pack)}>
      {/* Image Block */}
      <div className="relative w-36 h-36 rounded-md overflow-hidden shrink-0 lg:w-1/2">
        <Image
          src={pack.imageUrl || "https://picsum.photos/600/400"}
          alt={pack.title}
          fill
          className="object-contain"
        />
        {pack.shouldDisplayComingSoon && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
            Coming Soon
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">{pack.title}</p>
          {pack.description && (
            <p className="text-sm text-slate-500 line-clamp-2">
              {pack.description}
            </p>
          )}
        </div>

        <div className="flex gap-2 mt-3 justify-start">
          <div
            className={cn(
              "italic block md:hidden text-black text-xs font-medium hover:bg-black hover:text-white transition",
              isSelected && "text-green-500",
            )}>
            {isSelected ? "Currently Active" : ""}
          </div>
        </div>
      </div>
    </div>
  );
};
